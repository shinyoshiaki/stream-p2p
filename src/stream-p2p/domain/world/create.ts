import { createKad } from "../kad/create";
import { Peer } from "../../../pkg/kad-rtc/src";

export default function createWorld(peer: Peer) {
  const kad = createKad();
  kad.add(peer);
}
