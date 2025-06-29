import React, { useEffect, useState } from 'react'
import {useAuth} from '../context/DataContext'
import { Navigate, useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion'
import { useCurrent } from '../context/CurrentContext.jsx'
import Loading from '../components/Loading';
import CreateProjectModal from '../components/CreateProjectModal'; // Import the modal

const Home = () => {
     const { user, logout, loading, projects } = useAuth()
     const { setOpenProject, fetchRoutes } = useCurrent()
     const [isModalOpen, setIsModalOpen] = useState(false)
     
     const navigate = useNavigate()

     if(loading) {
      return <Loading message="Loading dashboard..." />;
     }
     
     if (!user) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">User Not Found</h2>
            <p className="text-gray-400 mb-4">Please log in to continue.</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    // Handle project creation
    const handleCreateProject = async (projectData) => {
      try {
        // Replace this with your actual API call
        console.log('Creating project:', projectData)
        
        const res = await axios.post('localhos')
        // Example API call (replace with your actual implementation):
        // const response = await fetch('/api/projects', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(projectData)
        // })
        // const newProject = await response.json()
        
        // After successful creation, you might want to:
        // 1. Refresh the projects list
        // 2. Navigate to the new project
        // 3. Show a success message
        
      } catch (error) {
        console.error('Error creating project:', error)
        throw error // Re-throw to let modal handle the error state
      }
    }

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-semibold text-white">Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)} // Open modal instead of navigating
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm md:text-base transition duration-200 self-start sm:self-auto"
          >
            + Create Project
          </button>
        </div>

        <div className="rounded-xl bg-[#2f2f2f] p-4 md:p-6 shadow-sm border border-[#3a3a3a]">
          <h2 className="text-lg font-medium mb-2">Welcome {user?.username || "Developer"} 👋</h2>
          <p className="text-sm text-gray-300">
            You can start by creating a new project or explore existing projects below.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {console.log(user)}
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400 text-lg mb-2">No projects found</p>
              <p className="text-gray-500 text-sm">Create your first project to get started.</p>
            </div>
          ) : (
            projects.map((project) => ( 
              <motion.div
                key={project.id}
                initial={{ backgroundImage: "radial-gradient(circle at top right, rgba(59,130,246,0.4), #1a1a1a 80%)" }}
                whileHover={{ scale: 1.05, backgroundImage: "radial-gradient(circle at top right, rgba(59,130,246,0.4), #1a1a1a 110%)" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="border border-[#3a3a3a] rounded-xl p-4"
              >
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <h3 className="text-white text-lg font-semibold break-words">{project.name}</h3>
                  <h2 className="text-md text-gray-400 break-all">/{project.slug}</h2>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {new Date(project.updatedAt).toLocaleString()}
                </p>
                
                <button
                  onClick={() => {
                    setOpenProject(project)
                    navigate(`/project/${project._id}`)
                  }}
                  className="mt-4 inline-block text-sm text-blue-500 hover:underline focus:outline-none focus:underline"
                >
                  View Details →
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <button 
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition duration-200"
      >
        Logout
      </button>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}

export default Home