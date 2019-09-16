import Kademlia, { Peer, genKid } from "../../../pkg/kad-rtc/src";
import { FindValue } from "../../../pkg/kad-rtc/src/kademlia/actions/findvalue";
import { prefix } from "../../const";

export class Navigator {
  constructor(seederPeer: Peer, keyOfMeta: string, mainKad: Kademlia) {
    mainKad.rpcEvent.subscribe(async data => {
      const { rpc, peer } = data;
      if (rpc === "FindValue") {
        const { key } = (data as any) as FindValue;

        if (key === keyOfMeta) {
          const joinPeer = mainKad.di.modules.peerCreate(genKid());
          const offer = await joinPeer.createOffer();
          const joinLabel = prefix + "navigator";
          peer.rtc.sendJson(offer, joinLabel);

          {
            const { unSubscribe } = peer.rtc.onData.subscribe(
              ({ label, data }) => {
                if (joinLabel === label) {
                  const sdp = JSON.parse(data as string);
                  joinPeer.setAnswer(sdp);
                  unSubscribe();
                }
              }
            );
          }

          await joinPeer.onConnect.asPromise();

          mainKad.add(joinPeer);
        }
      }
    });
  }
}
