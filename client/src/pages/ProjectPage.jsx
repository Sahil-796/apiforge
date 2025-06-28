import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/DataContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrent } from '../context/CurrentContext';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading'; // Import the new Loading component

const ProjectPage = () => {
  const { loading, projects } = useAuth()
  const { id } = useParams()
  const { openProject, setOpenProject, routes, setOpenRoute } = useCurrent();
  const [show, setShow] = useState(false)
  const [projectNotFound, setProjectNotFound] = useState(false)

  useEffect(() => {
    // Reset project not found state when id changes
    setProjectNotFound(false)
    
    // Only try to find project if we have projects array
    if (projects && Array.isArray(projects)) {
      if (projects.length > 0) {
        const found = projects.find(p => p._id === id)
        if (found) {
          // Only set if it's different to avoid unnecessary re-renders
          if (!openProject || openProject._id !== found._id) {
            setOpenProject(found)
          }
        } else {
          // Project not found in the loaded projects
          setProjectNotFound(true)
        }
      } else {
        // Projects array is empty
        setProjectNotFound(true)
      }
    }
    // If projects is null/undefined, we're still loading, so don't set projectNotFound
  }, [id, projects, openProject, setOpenProject])

  // Show loading while auth is loading or projects haven't been loaded yet
  if (loading || !projects || !Array.isArray(projects)) {
    return <Loading message="Loading projects..." />;
  }

  // Show project not found if we've checked and it doesn't exist
  if (projectNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-4">The project you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show loading while waiting for project to be set in context
  if (!openProject) {
    return <Loading message="Loading project details..." />;
  }

  const name = openProject.name
  const slug = openProject.slug
  const apiKey = openProject.apiKey

  return (
    <div className="p-4 md:p-6 text-white max-w-5xl mx-auto flex flex-col gap-6">
      <h1 className="text-xl md:text-2xl font-bold">
        Available Routes <span className="text-blue-400">({slug})</span>
      </h1>

      <div className="rounded-xl bg-[#2f2f2f] p-4 md:p-6 shadow-sm border border-[#3a3a3a]">
        <h2 className="text-lg font-medium mb-2">Project Overview</h2>
        <p className="text-sm text-gray-300 mb-1">
          Name: <span className="text-white">{name}</span>
        </p>
        <p className="text-sm text-gray-300 mb-2">
          Slug: <span className="text-white">{slug}</span>
        </p>

        <div className="text-sm text-gray-300 flex flex-col  gap-2">
          <div>
              <span>API Key:</span>
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {show ? (
                    <motion.span
                      key="visible"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-green-400 font-mono text-xs break-all"
                    >
                      {apiKey}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="hidden"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-500"
                    >
                      •••••••••••
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setShow(!show)}
                  className="text-blue-400 text-xs hover:underline ml-2"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              </div>
          
          <span>Set this api key in header as x-api-key for any method call</span>
        </div>
      </div>

      {!routes || routes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg mb-2">No routes found</p>
          <p className="text-gray-500 text-sm">Create your first route to get started.</p>
        </div>
      ) : (
        <div className="gap-4 flex flex-col">
          {routes.map((route) => (
            <motion.div
              key={route._id}
              className="bg-[#1e1e1e] p-4 rounded-xl border border-[#3a3a3a]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                <h2 className="text-lg font-semibold text-green-400 break-all">
                  {route.path}
                </h2>
                <span className="text-xs text-gray-500 self-start sm:self-auto">
                  Updated: {new Date(route.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric"
                  })}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {route.methods.map((method) => (
                  <span
                    key={method}
                    className="bg-gray-800 px-2 py-0.5 text-xs rounded text-blue-300 border border-blue-500"
                  >
                    {method}
                  </span>
                ))}
              </div>

              {route.logic ? (
                <div className="text-xs text-gray-300 mb-3">
                  <p className="mb-1 text-gray-400">Logic:</p>
                  <pre className="bg-[#111] p-3 rounded text-green-300 whitespace-pre-wrap overflow-auto max-h-48 text-xs leading-relaxed">
                    {route.logic}
                  </pre>
                </div>
              ) : (
                <p className="text-xs text-gray-300 mb-2">Logic - default</p>
              )}

              {route.schema && Object.keys(route.schema).length > 0 && (
                <div className="text-xs text-gray-400">
                  <p className="mb-1">Schema:</p>
                  <pre className="bg-black/40 p-2 rounded overflow-auto text-xs">
                    {JSON.stringify(route.schema, null, 2)}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;