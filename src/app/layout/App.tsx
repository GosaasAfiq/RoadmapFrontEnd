import { observer } from "mobx-react-lite"; // For observing MobX state changes
import NavBar from "./Navbar";
import "./style.css";
import { Outlet, useLocation, } from "react-router-dom";

function App() {
    const location = useLocation(); 
    const showNavBar = location.pathname !== "/"; 

    return (
        <div>
          {showNavBar && <NavBar />} {/* Conditionally render NavBar */}
          <Outlet /> {/* Render child routes here */}
        </div>
    );
}

export default observer(App); // Wrap with `observer` to react to MobX state changes
