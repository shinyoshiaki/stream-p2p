import Kademlia from "../../../pkg/kad-rtc/src";
import store, { storeOrder } from "../../domain/world/store";
import { Services } from "../../service";
import { Store } from "../../../pkg/kad-rtc/src/kademlia/actions/store";
import { Navigator } from "../actor/navigator";
import { Meta } from "../../model/meta";
import { findStatic } from "../../domain/world/find";
import Seeder from "../actor/seeder";
import { FindValue } from "../../../pkg/kad-rtc/src/kademlia/actions/findvalue";

export default class MainWorld {
  constructor(private services: Services, private mainKad: Kademlia) {
    const { NavigatorList, SeedList } = services;

    mainKad.event.subscribe(data => {
      const { rpc, peer } = data;
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
            if (SeedList.isSeedExist(key)) {
              const seeder = SeedList.list[key];
              seeder.addPeer(peer);
            } else {
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
