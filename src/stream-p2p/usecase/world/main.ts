import Kademlia from "../../../pkg/kad-rtc/src";
import store, { storeOrder } from "../../domain/world/store";
import Services from "../../service";
import { Store } from "../../../pkg/kad-rtc/src/kademlia/actions/store";
import createNavigator from "../../domain/navigator/create";

export default class MainWorld {
  constructor(private services: typeof Services, private mainKad: Kademlia) {
    let navigator: ReturnType<typeof createNavigator>;

    mainKad.event.subscribe(data => {
      const { rpc } = data;
      if (rpc === "Store") {
        const { key, value, msg } = (data as any) as Store;
        switch (msg) {
          case storeOrder:
            navigator = createNavigator();
            break;
        }
      }
    });
  }

  async store(name: string, ab: ArrayBuffer) {
    const { SeedList } = this.services;

    const url = await store(name, ab, this.mainKad);
    SeedList.addSeed(url, ab);
  }
}
