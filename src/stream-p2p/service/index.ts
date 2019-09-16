import inject from "typed-di";
import SeedList from "./world/seedlist";
import NavigatorList from "./actor/navigatorlist";
import UserList from "./actor/userlist";

const Services = inject({ SeedList, NavigatorList, UserList });

type Services = typeof Services;

export { Services };

export const createServices = () =>
  inject({ SeedList, NavigatorList, UserList });
