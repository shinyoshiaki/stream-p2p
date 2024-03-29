import { Peer } from "../../../modules/peer/base";
import { FindValuePeerOffer } from "./peer";
import { DependencyInjection } from "../../../di";
import { FindValue, FindValueAnswer } from "..";
import { timeout } from "../../../const";
import { Item } from "../../../modules/kvs/base";
import { ID } from "../../../services/rpcmanager";

export default class FindValueProxy {
  constructor(private listen: Peer, private di: DependencyInjection) {
    const { rpcManager } = di;

    rpcManager
      .asObservable<FindValue>("FindValue", listen)
      .subscribe(this.findvalue);

    rpcManager
      .asObservable<FindValueAnswer>("FindValueAnswer", listen)
      .subscribe(this.findValueAnswer);
  }

  findvalue = async (data: FindValue & ID) => {
    const { kTable, rpcManager } = this.di;
    const { key, except, id } = data;

    const { kvs } = this.di.modules;

    const item = kvs.get(key);

    if (item) {
      this.listen.rpc({ ...FindValueResult({ item }), id });
    } else {
      const peers = kTable.findNode(key);
      const offers: { peerkid: string; sdp: string }[] = [];

      await Promise.all(
        peers.map(async peer => {
          if (!(peer.kid === this.listen.kid || except.includes(peer.kid))) {
            const wait = rpcManager.getWait<FindValuePeerOffer>(
              peer,
              FindValueProxyOpen(this.listen.kid)
            );
            const res = await wait(timeout).catch(() => {});

            if (res) {
              const { peerkid, sdp } = res;
              if (sdp) offers.push({ peerkid, sdp });
            }
          }
        })
      );

      this.listen.rpc({ ...FindValueResult({ offers }), id });
    }
  };

  findValueAnswer = (data: FindValueAnswer & ID) => {
    const { kTable } = this.di;
    const { sdp, peerkid, id } = data;

    const peer = kTable.getPeer(peerkid);
    if (!peer) return;
    peer.rpc({ ...FindValueProxyAnswer(sdp, this.listen.kid), id });
  };
}

const FindValueResult = (data: Partial<{ item: Item; offers: Offer[] }>) => ({
  rpc: "FindValueResult" as const,
  data
});

export type Offer = { peerkid: string; sdp: string };

export type FindValueResult = ReturnType<typeof FindValueResult>;

const FindValueProxyOpen = (finderkid: string) => ({
  rpc: "FindValueProxyOpen" as const,
  finderkid
});

export type FindValueProxyOpen = ReturnType<typeof FindValueProxyOpen>;

const FindValueProxyAnswer = (sdp: string, finderkid: string) => ({
  rpc: "FindValueProxyAnswer" as const,
  sdp,
  finderkid
});

export type FindValueProxyAnswer = ReturnType<typeof FindValueProxyAnswer>;
