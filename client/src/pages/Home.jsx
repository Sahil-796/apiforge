import React, { useEffect } from 'react'
import {useAuth} from '../context/DataContext'
import { Navigate, useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion'



const Home = () => {
     const { user, logout } = useAuth()
     const navigate = useNavigate()

      if(!user) {
        console.log(user)
        return <Navigate to='/login' replace/>
      }
     
  const projects = [
  {
    userId: "60f1e7e2c9e77c3f20a1b111",
    name: "User Management",
    slug: "users",
    description: "Handles user registration, login, and profile management.",
    apiKey: "api_123456789_users",
    createdAt: new Date("2025-06-20T10:00:00.000Z"),
    updatedAt: new Date("2025-06-20T10:00:00.000Z"),
  },
  {
    userId: "60f1e7e2c9e77c3f20a1b111",
    name: "Product Catalog",
    slug: "products",
    description: "API for managing product listings and details.",
    apiKey: "api_987654321_products",
    createdAt: new Date("2025-06-21T11:00:00.000Z"),
    updatedAt: new Date("2025-06-21T11:00:00.000Z"),
  },
  {
    userId: "60f1e7e2c9e77c3f20a1b222",
    name: "Order Processing",
    slug: "orders",
    description: "Handles creation and tracking of customer orders.",
    apiKey: "api_456123789_orders",
    createdAt: new Date("2025-06-22T12:00:00.000Z"),
    updatedAt: new Date("2025-06-22T12:00:00.000Z"),
  },
  {
    userId: "60f1e7e2c9e77c3f20a1b222",
    name: "Analytics Dashboard",
    slug: "analytics",
    description: "Provides data and metrics about system usage.",
    apiKey: "api_789321654_analytics",
    createdAt: new Date("2025-06-23T13:00:00.000Z"),
    updatedAt: new Date("2025-06-23T13:00:00.000Z"),
  },
  {
    userId: "60f1e7e2c9e77c3f20a1b333",
    name: "Feedback Service",
    slug: "feedback",
    description: "Collects and manages user feedback and suggestions.",
    apiKey: "api_321654987_feedback",
    createdAt: new Date("2025-06-24T14:00:00.000Z"),
    updatedAt: new Date("2025-06-24T14:00:00.000Z"),
  }
];



  return (
    <div>
    
    <div className="flex flex-col gap-6">
  <div className="flex items-center justify-between">
    <h1 className="text-xl md:text-2xl font-semibold text-white">Dashboard</h1>
    <button
      onClick={() => navigate("/create")}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm md:text-base transition duration-200"
    >
      + Create Project
    </button>
  </div>

  <div className="rounded-xl bg-[#2f2f2f] p-6 shadow-sm border border-[#3a3a3a]">
    <h2 className="text-lg font-medium mb-2">Welcome {user?.username || "Developer"} 👋</h2>
    <p className="text-sm text-gray-300">
      You can start by creating a new project or explore existing projects below.
    </p>
  </div>

  {/* Sample Projects */}
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {

  projects.map((project) => ( 
      <motion.div
        key={project.id}
        initial={{ backgroundImage: "radial-gradient(circle at top right, rgba(59,130,246,0.4), #1a1a1a 80%)" }}
        whileHover={{ scale: 1.05, backgroundImage: "radial-gradient(circle at top right, rgba(59,130,246,0.4), #1a1a1a 110%)" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className=" border border-[#3a3a3a] rounded-xl p-4"

      >
        <div className='flex flex-row items-center gap-2'>
        <h3 className="text-white text-lg font-semibold">{project.name}</h3>
        <h2 className="text-md text-gray-400">/{project.slug}</h2>
        </div>
        <p className="text-xs text-gray-500 mt-2">Last updated: {new Date(project.updatedAt).toLocaleString()}</p>
        <button
          onClick={() => navigate(`/project/${project.name}`)}
          className="mt-4 inline-block text-sm text-blue-500 hover:underline"
        >
          View Details →
        </button>
      </motion.div>
    ))}
  </div>
</div>

<button onClick={logout}>logout</button>
    
    </div>
    
  )
}

export default Home