import { useContext,createContext } from "react";
import RoadmapStore from "./roadmapsStore";
import UserStore from "./userStore";

interface Store {
    roadmapStore: RoadmapStore
    userStore: UserStore
}

export const store: Store = {
    roadmapStore: new RoadmapStore(),
    userStore: new UserStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}