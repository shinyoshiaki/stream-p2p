import { OfferPeer } from "./offer";
import { Peer } from "../../../pkg/kad-rtc/src";

export async function setupAnswerPeer(
  id: string,
  data: OfferPeer,
  peer: Peer,
  joinPeer: Peer
) {
  const { offer } = data;
  const answer = await joinPeer.setOffer(offer);
  peer.rpc({ id, ...answerPeer(answer) });
  await peer.onConnect.asPromise();
  return peer;
}

export const answerPeerLabel = "AnswerPeer" as const;

const answerPeer = (answer: any) => ({ rpc: answerPeerLabel, answer });

export type AnswerPeer = ReturnType<typeof answerPeer>;
