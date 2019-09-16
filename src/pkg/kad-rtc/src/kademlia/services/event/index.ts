import { Peer, RPC } from "../../modules/peer/base";
import Event from "rx.mini";

export default class KadEvent {
  event = new Event<RPC & { peer: Peer }>();

  listen(peer: Peer) {
    const { unSubscribe } = peer.onRpc.subscribe(rpc => {
      this.event.execute({ ...rpc, peer: peer as any });
    });
    peer.onDisconnect.once(unSubscribe);
  }
}
