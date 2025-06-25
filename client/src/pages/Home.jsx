import React, { useEffect } from 'react'
import {useAuth} from '../context/DataContext'
import { Navigate, useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion'



const Home = () => {
     const { user, logout } = useAuth()
     const navigate = useNavigate()

      // if(!user) {
      //   return <Navigate to='/login'/>
      // }
     

  return (
    <div>
    
    <div className="flex flex-col gap-6">
  <div className="flex items-center justify-between">
    <h1 className="text-xl md:text-2xl font-semibold text-white">Dashboard</h1>
    <button
      onClick={() => navigate("/create")}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm md:text-base transition duration-200"
    >
      + Create API
    </button>
  </div>

  <div className="rounded-xl bg-[#2f2f2f] p-6 shadow-sm border border-[#3a3a3a]">
    <h2 className="text-lg font-medium mb-2">Welcome {user?.username || "Developer"} 👋</h2>
    <p className="text-sm text-gray-300">
      You can start by creating a new API route or explore existing projects below.
    </p>
  </div>

  {/* Sample Projects */}
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {[
      { id: 1, name: "User Auth API", routes: 5, lastUpdated: "2 days ago" },
      { id: 2, name: "E-Commerce API", routes: 12, lastUpdated: "5 days ago" },
      { id: 3, name: "Weather Service", routes: 3, lastUpdated: "1 day ago" },
      { id: 4, name: "Chatbot Backend", routes: 7, lastUpdated: "3 hours ago" }
    ].map((project) => (
      <motion.div
        key={project.id}
        initial={{ backgroundImage: "radial-gradient(circle at top right, rgba(59,130,246,0.4), #1a1a1a 80%)" }}
        whileHover={{ scale: 1.05, backgroundImage: "radial-gradient(circle at top right, rgba(59,130,246,0.4), #1a1a1a 100%)" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className=" border border-[#3a3a3a] rounded-xl p-4"

      >
        <h3 className="text-white text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-gray-400 mt-1">{project.routes} Routes</p>
        <p className="text-xs text-gray-500 mt-2">Last updated {project.lastUpdated}</p>
        <button
          onClick={() => navigate(`/project/${project.id}`)}
          className="mt-4 inline-block text-sm text-blue-500 hover:underline"
        >
          View Details →
        </button>
      </motion.div>
    ))}
  </div>
</div>

    
    </div>
    
  )
}

export default Home