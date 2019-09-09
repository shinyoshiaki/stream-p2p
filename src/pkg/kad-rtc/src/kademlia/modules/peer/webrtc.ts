import { RPC, Peer } from "./base";
import Event from "rx.mini";
import WebRTC, { Signal } from "webrtc4me";
import { decode, encode } from "@msgpack/msgpack";
import { timeout } from "../../const";
const wrtc = require("wrtc");

export const PeerModule = (kid: string) => new PeerWebRTC(kid);

export default class PeerWebRTC implements Peer {
  type = "webrtc";
  rtc: WebRTC = new WebRTC({ disable_stun: true, wrtc });
  onRpc = new Event<RPC>();
  onDisconnect = new Event();
  onConnect = new Event();

  constructor(public kid: string) {
    this.rtc.nodeId = kid;
    this.rtc.onConnect.once(() => this.onConnect.execute(null));
    this.rtc.onDisconnect.once(() => this.onDisconnect.execute(null));
    const { unSubscribe } = this.rtc.onData.subscribe(
      ({ label, data, dataType }) => {
        try {
          if (label == "datachannel" && dataType === "ArrayBuffer") {
            const obj = this.parseRPC(data as ArrayBuffer);
            if (obj) this.onRpc.execute(obj);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
    this.onDisconnect.once(unSubscribe);
  }

  parseRPC = (data: ArrayBuffer) => {
    const buffer = Buffer.from(data);
    try {
      const data: RPC = decode(buffer) as any;
      if (data.rpc) {
        return data;
      }
    } catch (error) {
      console.error(error, buffer);
    }
    return undefined;
  };

  rpc = (send: RPC) => {
    const packet = encode(send);
    this.rtc.send(packet);
  };

  eventRpc = (rpc: string, id: string) => {
    const observer = new Event<any>();
    const { unSubscribe } = this.rtc.onData.subscribe(
      ({ label, data, dataType }) => {
        if (label == "datachannel" && dataType === "ArrayBuffer") {
          const obj = this.parseRPC(data as ArrayBuffer);
          if (obj && obj.rpc === rpc) {
            if (obj.id === id) {
              observer.execute(data);
              unSubscribe();
            }
          }
        }
      }
    );
    return observer;
  };

  createOffer = async () => {
    this.rtc.makeOffer();
    const offer = await this.rtc.onSignal.asPromise();
    await new Promise(r => setTimeout(r, 0));
    return offer;
  };

  setOffer = async (offer: Signal) => {
    this.rtc.setSdp(offer);
    const answer = await this.rtc.onSignal.asPromise();
    await new Promise(r => setTimeout(r, 0));
    return answer;
  };

  setAnswer = async (answer: Signal) => {
    this.rtc.setSdp(answer);
    const err = await this.rtc.onConnect
      .asPromise(timeout)
      .catch(e => new Error(e));
    if (err) this.onConnect.error(err);
    return err;
  };

  disconnect = () => {
    this.rtc.hangUp();
  };
}
