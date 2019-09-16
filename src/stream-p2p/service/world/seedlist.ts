import Seeder from "../../usecase/actor/seeder";

export default class SeedList {
  readonly list: { [url: string]: Seeder } = {};
  constructor() {}

  addSeed(url: string, seeder: Seeder) {
    this.list[url] = seeder;
  }

  isSeedExist(url: string) {
    return this.list[url] ? true : false;
  }
}
