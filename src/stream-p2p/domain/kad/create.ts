import Kademlia, {
  genKid,
  PeerModule,
  KvsModule
} from "../../../pkg/kad-rtc/src";

export const createKad = () =>
  new Kademlia(genKid(), { peerCreate: PeerModule, kvs: KvsModule });
