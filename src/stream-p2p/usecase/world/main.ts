import Kademlia from "../../../pkg/kad-rtc/src";
import store from "../../domain/world/store";

export default class MainWorld {
  seedList: SeedList = {};

  constructor(private mainKad: Kademlia) {}

  async store(name: string, ab: ArrayBuffer) {
    const url = await store(name, ab, this.mainKad);
    this.seedList[url] = ab;
  }
}

type SeedList = { [url: string]: ArrayBuffer };
