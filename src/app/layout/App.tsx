import { useEffect, useState } from 'react'
import NavBar from './Navbar';
import './style.css';  // Correct relative path to index.css
import { Outlet } from 'react-router-dom';
import { Roadmap } from '../models/roadmap';
import RoadmapDashboard from '../../features/Dashboard/RoadmapDashboard';
import agent from '../api/agent';


function App() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  useEffect(() => {
    agent.Roadmaps.list().then(response => {
        setRoadmaps(response);
      })
  }, [])

  return (
    <div>
      <NavBar/>
        <RoadmapDashboard roadmaps={roadmaps}/>
      <Outlet/>
    </div>
  )
}

export default App
