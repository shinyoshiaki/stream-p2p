import inject from "typed-di";
import SeedList from "./world/seedlist";
import NavigatorList from "./actor/navigatorlist";

const Services = inject({ SeedList, NavigatorList });

type Services = typeof Services;

export { Services };

export const createServices = () => inject({ SeedList, NavigatorList });
