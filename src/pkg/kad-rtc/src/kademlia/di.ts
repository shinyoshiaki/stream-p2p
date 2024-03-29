import Ktable, { Option } from "./ktable";
import Modules from "./modules";
import RpcManager from "./services/rpcmanager";
import Signaling from "./services/signaling";
import JobSystem from "./services/jobsystem";
import KadEvent from "./services/event";

type Options = Option;

export type DependencyInjection = {
  kTable: Ktable;
  modules: Modules;
  rpcManager: RpcManager;
  signaling: Signaling;
  jobSystem: JobSystem;
  rpcEvent: KadEvent;
};

export const dependencyInjection = (
  kid: string,
  modules: Modules,
  opt: Partial<Options> = {}
): DependencyInjection => {
  return {
    modules,
    kTable: new Ktable(kid, opt),
    rpcManager: new RpcManager(),
    signaling: new Signaling(modules.peerCreate),
    jobSystem: new JobSystem(),
    rpcEvent: new KadEvent()
  };
};
