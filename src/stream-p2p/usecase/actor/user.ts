import Kademlia, { genKid } from "../../../pkg/kad-rtc/src";
import { FindValueResult } from "../../../pkg/kad-rtc/src/kademlia/actions/findvalue/listen/proxy";
import { setupOfferPeer } from "../../domain/peer/offer";
import { RPCType } from "../../../pkg/kad-rtc/src/kademlia/modules/peer/base";
import { Services } from "../../service";
import { createKad } from "../../domain/kad/create";

export default class User {
  constructor(private services: Services, private mainKad: Kademlia) {}
  async findStatic(url: string) {
    const { UserList } = this.services;

    this.mainKad.findValue(url);
    {
      const { unSubscribe } = this.mainKad.rpcEvent.subscribe(async data => {
        const { rpc, peer } = data;
        if ((rpc as RPCType) === "FindValueResult") {
          const res = (data as any) as FindValueResult;
          const { item } = res.data;
          if (item && item.key === url) {
            const joinPeer = this.mainKad.di.modules.peerCreate(genKid());
            await setupOfferPeer(peer, joinPeer, url);
            const kad = createKad();
            UserList.addUser(url, kad);
            kad.add(joinPeer);
            unSubscribe();
          }
        }
      });
    }
  }
}
