import Kademlia from "../../../pkg/kad-rtc/src";
import { FindValueResult } from "../../../pkg/kad-rtc/src/kademlia/actions/findvalue/listen/proxy";

export default class User {
  constructor(private mainKad: Kademlia) {}
  findStatic(url: string) {
    this.mainKad.findValue(url);
    {
      const { unSubscribe } = this.mainKad.event.subscribe(data => {
        const { rpc, peer } = data;
        if (rpc === "FindValueResult") {
          const res = (data as any) as FindValueResult;
          const { item } = res.data;
          if (item && item.key === url) {
            peer.rpc({ rpc: "" });
            unSubscribe();
          }
        }
      });
    }
  }
}
