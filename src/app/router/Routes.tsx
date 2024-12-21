import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import Login from "../../features/Login/Login";
import RoadmapDashboard from "../../features/Dashboard/RoadmapDashboard";
import CreateRoadmap from "../../features/Create/CreateRoadmap";
import AuditTrail from "../../features/AuditTrail/AuditTrail";
import Details from "../../features/View/Details";
import Preview from "../../features/View/Preview";
import EditRoadmap from "../../features/Create/EditRoadmap";


export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children:[
            {path: '', element:<Login/>},
            {path: 'roadmaps', element:<RoadmapDashboard/>},
            {path: 'create', element:<CreateRoadmap/>}, 
            {path: 'edit/:id', element:<EditRoadmap/>}, 
            {path: 'audittrail', element:<AuditTrail/>},
            {path: 'roadmaps/:id', element: <Details /> },
            {path: 'preview', element: <Preview /> },
        ]
    },
]

export const router = createBrowserRouter(routes);

