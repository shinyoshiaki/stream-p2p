import { Peer, RPC } from "../../modules/peer/base";
import Event from "rx.mini";

export default class KadEvent {
  event = new Event<RPC>();

  listen(peer: Peer) {
    const { unSubscribe } = peer.onRpc.subscribe(this.event.execute);
    peer.onDisconnect.once(unSubscribe);
  }
}
