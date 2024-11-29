import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import Login from "../../features/Login/Login";
import RoadmapDashboard from "../../features/Dashboard/RoadmapDashboard";
// import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
// import ActivityForm from "../../features/activities/form/ActivityForm";
// import ActivityDetails from "../../features/activities/details/ActivityDetails";
// import TestErrors from "../../features/errors/TestError";
// import NotFound from "../../features/errors/NotFound";
// import ServerError from "../../features/errors/ServerError";
// import LoginForm from "../../features/users/LoginForm";
// import ProfilePage from "../../features/profiles/ProfilePage";
// import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children:[
            {path: '', element:<Login/>},
            {path: 'roadmaps', element:<RoadmapDashboard/>},
            // {path: 'createActivity', element:<ActivityForm key='create'/>},
            // {path: 'manage/:id', element:<ActivityForm key='edit'/>},
            // {path: 'profiles/:username', element:<ProfilePage/>},
            // {path: 'errors', element:<TestErrors/>}    
            // {element:<RequireAuth/>,children: [
                
            // ]},
            // {path: 'login', element:<LoginForm />},
            // {path: 'not-found', element:<NotFound/>},
            // {path: 'server-error', element:<ServerError/>},
            // {path: '*', element:<Navigate replace to='/not-found'/>},
        ]
    },
]

export const router = createBrowserRouter(routes);

