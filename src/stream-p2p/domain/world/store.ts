import Kademlia from "../../../pkg/kad-rtc/src";
import { Meta } from "../../model/meta";
import sha1 from "sha1";

export default async function store(
  name: string,
  ab: ArrayBuffer,
  mainKad: Kademlia
) {
  const hash = sha1(new Buffer(ab));
  const meta: Meta<"static"> = { name, type: "static", payload: { hash } };

  const metaStr = JSON.stringify(meta);
  const url = sha1(metaStr);
  await mainKad.store(url, metaStr);

  return url;
}
