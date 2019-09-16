import MainWorld from "../usecase/world/main";
import { createServices } from "../service";
import Kademlia, {
  genKid,
  PeerModule,
  KvsModule,
  Peer
} from "../../pkg/kad-rtc/src";

export default class Controller {
  mainKad = new Kademlia(genKid(), { peerCreate: PeerModule, kvs: KvsModule });
  services = createServices();
  mainWorld = new MainWorld(this.services, this.mainKad);

  addPeer(peer: Peer) {
    this.mainKad.add(peer);
  }

  async storeStatic(name: string, ab: ArrayBuffer) {
    const url = await this.mainWorld.storeStatic(name, ab);
    return url;
  }

  getStatic(key: string) {}
}
