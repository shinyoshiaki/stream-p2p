import Kademlia from "../../../pkg/kad-rtc/src";
import { Meta } from "../../model/meta";
import sha1 from "sha1";
import { prefix } from "../../const";

export default async function store(
  name: string,
  ab: ArrayBuffer,
  mainKad: Kademlia
) {
  const hash = sha1(new Buffer(ab));
  const meta: Meta<"static"> = { name, type: "static", payload: { hash } };

  const metaStr = JSON.stringify(meta);
  const url = sha1(metaStr);
  await mainKad.store(url, metaStr, storeOrder);

  return url;
}

export const storeOrder = prefix + "world_store";
