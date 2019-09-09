import Kademlia from "../../../pkg/kad-rtc/src";
import { Meta } from "../../model/meta";

export async function findStatic(url: string, mainKad: Kademlia) {
  const res = await mainKad.findValue(url);
  if (!res) return;
  const { value } = res;
  try {
    const meta: Meta<"static"> = JSON.parse(value as string);
    return meta;
  } catch (error) {}
  return undefined;
}
