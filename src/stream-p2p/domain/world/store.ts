import Kademlia from "../../../pkg/kad-rtc/src";
import { Meta, Block } from "../../model/meta";
import sha1 from "sha1";
import { prefix } from "../../const";
import { sliceArraybuffer } from "../../util/arraybuffer";

export default async function store(
  name: string,
  ab: ArrayBuffer,
  mainKad: Kademlia
) {
  const hash = sha1(new Buffer(ab));
  const blocks: Block[] = sliceArraybuffer(ab, 16000).map((v, i) => ({
    i,
    k: sha1(new Buffer(v)),
    v
  }));

  const meta: Meta<"static"> = {
    name,
    type: "static",
    payload: { hash, blocks }
  };

  const metaStr = JSON.stringify(meta);
  const url = sha1(metaStr);
  await mainKad.store(url, metaStr, storeOrder);

  return url;
}

export const storeOrder = prefix + "world_store";
