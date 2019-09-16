import Kademlia, { genKid } from "../../../pkg/kad-rtc/src";
import store, { storeOrder } from "../../domain/world/store";
import { Services } from "../../service";
import { Store } from "../../../pkg/kad-rtc/src/kademlia/actions/store";
import { Navigator } from "../actor/navigator";
import { Meta } from "../../model/meta";
import { findStatic } from "../../domain/world/find";
import Seeder from "../actor/seeder";
import { FindValue } from "../../../pkg/kad-rtc/src/kademlia/actions/findvalue";
import { offerPeerLabel, OfferPeer } from "../../domain/peer/offer";
import { setupAnswerPeer } from "../../domain/peer/answer";

export default class MainWorld {
  constructor(private services: Services, private mainKad: Kademlia) {
    const { NavigatorList, SeedList } = services;

    mainKad.rpcEvent.subscribe(async data => {
      const { rpc, peer, id } = data;
      switch (rpc) {
        case "Store":
          {
            const { key, value, msg } = (data as any) as Store;

            switch (msg) {
              case storeOrder:
                if (!NavigatorList.isExist(key)) {
                  const meta: Meta<any> = JSON.parse(value as string);
                  NavigatorList.addNavigator(
                    key,
                    new Navigator(peer, key, mainKad)
                  );
                }
                break;
            }
          }
          break;
        case "FindValue": // from user
          {
            const { key } = (data as any) as FindValue;
            if (SeedList.isExist(key)) {
              const seeder = SeedList.list[key];
              seeder.addPeer(peer);
            } else {
            }
          }
          break;
        case offerPeerLabel:
          {
            const { url } = (data as any) as OfferPeer;
            const joinPeer = mainKad.di.modules.peerCreate(genKid());
            const res = await setupAnswerPeer(id, data as any, peer, joinPeer);
            if (SeedList.isExist(url)) {
              const seeder = SeedList.list[url];
              seeder.addPeer(res);
            } else if (NavigatorList.isExist(url)) {
              const nav = NavigatorList.list[url];
            }
          }
          break;
      }
    });
  }

  async storeStatic(name: string, ab: ArrayBuffer) {
    const { SeedList } = this.services;

    const { url, meta } = await store(name, ab, this.mainKad);

    const seeder = new Seeder(ab, meta, url);
    SeedList.addSeed(url, seeder);

    return url;
  }

  async findStatic(url: string) {
    const meta = await findStatic(url, this.mainKad);
    if (!meta) return undefined;
  }
}
