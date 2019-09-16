import { Peer } from "../../../pkg/kad-rtc/src";
import { prefix } from "../../const";

export async function setupJoinPeer(peer: Peer, joinPeer: Peer) {
  const offer = await joinPeer.createOffer();
  const joinLabel = prefix + "seeder";
  peer.rtc.sendJson(offer, joinLabel);
  {
    const { unSubscribe } = peer.rtc.onData.subscribe(({ label, data }) => {
      if (joinLabel === label) {
        const sdp = JSON.parse(data as string);
        joinPeer.setAnswer(sdp);
        unSubscribe();
      }
    });
  }
  await joinPeer.onConnect.asPromise();
}
