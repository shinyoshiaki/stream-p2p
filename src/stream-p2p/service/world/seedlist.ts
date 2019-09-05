export default class SeedList {
  readonly list: SeedListType = {};
  constructor() {}

  addSeed(url: string, ab: ArrayBuffer) {
    this.list[url] = ab;
  }
}

type SeedListType = { [url: string]: ArrayBuffer };
