import { Meta } from "../../model/meta";
import { createKad } from "../../domain/kad/create";
import { Peer, genKid } from "../../../pkg/kad-rtc/src";
import { setupOfferPeer } from "../../domain/peer/offer";

export default class Seeder {
  smallKad = createKad();
  constructor(ab: ArrayBuffer, meta: Meta<any>, private url: string) {}

  async addPeer(peer: Peer) {
    const joinPeer = this.smallKad.di.modules.peerCreate(genKid());
    await setupOfferPeer(peer, joinPeer, this.url);
    this.smallKad.add(joinPeer);
  }
}
