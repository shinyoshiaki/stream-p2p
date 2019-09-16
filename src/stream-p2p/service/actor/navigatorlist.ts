import { Navigator } from "../../usecase/actor/navigator";

export default class NavigatorList {
  readonly list: NavigatorListType = {};
  constructor() {}

  addNavigator(url: string, nav: Navigator) {
    this.list[url] = nav;
  }

  isExist(url: string) {
    return this.list[url] ? true : false;
  }
}

type NavigatorListType = { [url: string]: any };
