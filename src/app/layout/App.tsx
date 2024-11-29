import { useEffect } from "react";
import { observer } from "mobx-react-lite"; // For observing MobX state changes
import NavBar from "./Navbar";
import "./style.css";
import Login from "../../features/Login/Login";
import { useStore } from "../stores/store";
import { Outlet } from "react-router-dom";

function App() {
    const { roadmapStore } = useStore();

    useEffect(() => {
        roadmapStore.loadRoadmaps();
    }, [roadmapStore]);

    return (
        <div>
          {location.pathname === '/' ? (
            <Login/>
          ) : (
            <>
              <NavBar />
              <Outlet />
            </>
          )}
        </div>
    );
}

export default observer(App); // Wrap with `observer` to react to MobX state changes
