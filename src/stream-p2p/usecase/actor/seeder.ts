import { Meta } from "../../model/meta";
import { createKad } from "../../domain/kad/create";
import { Peer, genKid } from "../../../pkg/kad-rtc/src";
import { prefix } from "../../const";
import { setupJoinPeer } from "../../domain/kad/peer";

export default class Seeder {
  smallKad = createKad();
  constructor(ab: ArrayBuffer, meta: Meta<any>, url: string) {}

  async addPeer(peer: Peer) {
    const joinPeer = this.smallKad.di.modules.peerCreate(genKid());
    await setupJoinPeer(peer, joinPeer);
    this.smallKad.add(joinPeer);
  }
}
