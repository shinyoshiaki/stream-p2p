import Kademlia from "../../../pkg/kad-rtc/src";

export default class UserList {
  readonly list: { [url: string]: Kademlia } = {};
  constructor() {}

  addUser(url: string, kad: Kademlia) {
    this.list[url] = kad;
  }

  isExist(url: string) {
    return this.list[url] ? true : false;
  }
}
