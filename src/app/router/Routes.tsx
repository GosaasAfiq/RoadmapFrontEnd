import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import Login from "../../features/Login/Login";
import RoadmapDashboard from "../../features/Dashboard/RoadmapDashboard";


export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children:[
            {path: '', element:<Login/>},
            {path: 'roadmaps', element:<RoadmapDashboard/>},
        ]
    },
]

export const router = createBrowserRouter(routes);

