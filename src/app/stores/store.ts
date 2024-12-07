import { useContext,createContext } from "react";
import RoadmapStore from "./roadmapsStore";
import UserStore from "./userStore";
import AuditTrailStore from "./auditTrailStore";

interface Store {
    roadmapStore: RoadmapStore
    userStore: UserStore
    auditTrailStore: AuditTrailStore
}

export const store: Store = {
    roadmapStore: new RoadmapStore(),
    userStore: new UserStore(),
    auditTrailStore: new AuditTrailStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}