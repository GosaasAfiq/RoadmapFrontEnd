import { useContext,createContext } from "react";
import RoadmapStore from "./roadmapsStore";

interface Store {
    roadmapStore: RoadmapStore
}

export const store: Store = {
    roadmapStore: new RoadmapStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}