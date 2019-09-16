import { Peer, Uuid } from "../../../pkg/kad-rtc/src";
import { RPC } from "../../../pkg/kad-rtc/src/kademlia/modules/peer/base";
import { AnswerPeer } from "./answer";

export async function setupOfferPeer(peer: Peer, joinPeer: Peer, url: string) {
  const offer = await joinPeer.createOffer();

  const rpcId = peer.kid + new Uuid().get();
  peer.rpc({ id: rpcId, ...offerPeer(offer, url) });
  {
    const { unSubscribe } = peer.onRpc.subscribe((data: RPC & AnswerPeer) => {
      const { id, answer } = data;
      if (rpcId === id) {
        joinPeer.setAnswer(answer);
        unSubscribe();
      }
    });
  }
  await joinPeer.onConnect.asPromise();
}

export const offerPeerLabel = "OfferPeer" as const;

const offerPeer = (offer: any, url: string) => ({
  rpc: offerPeerLabel,
  offer,
  url
});

export type OfferPeer = ReturnType<typeof offerPeer>;
