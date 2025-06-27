import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/DataContext'
import { motion, AnimatePresence  } from 'framer-motion'
import { useCurrent } from '../context/CurrentContext';
import { useParams } from 'react-router-dom';


const ProjectPage = () => {

  const {loading, projects} = useAuth()
  const { id } = useParams()

  
  const { openProject, setOpenProject, routes, setOpenRoute } = useCurrent();
    const [show, setShow] = useState(false) 
  
  useEffect(()=> {
    if (!openProject && projects && Array.isArray(projects)) {
      const found = projects.find(p => p._id === id)
      if (found) setOpenProject(found)
        
    }
  }, [id, projects])
  if (loading ) {
     return <div className='text-white text-center py-20'> Loading...</div>;
   }

  const name = openProject.name
  const slug = openProject.slug
  const apiKey = openProject.apiKey


  return (

    
    <div className="p-6 text-white max-w-5xl mx-auto flex flex-col gap-6">

         <h1 className="text-2xl font-bold">Available Routes<span className="text-blue-400">{slug}</span></h1>

          <div className="rounded-xl bg-[#2f2f2f] p-6 shadow-sm border border-[#3a3a3a]">
    <h2 className="text-lg font-medium mb-2">Project Overview</h2>
    <p className="text-sm text-gray-300">
      Name: 
    </p>
    <p className="text-sm text-gray-300">
      Slug: 
    </p>


<p className="text-sm text-gray-300 flex items-center gap-2">
  API Key:
  <AnimatePresence mode="wait">
    {show ? (
      <motion.span
        key="visible"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
        className="text-green-400 font-mono"
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
</p>

<button
  onClick={() => setShow(!show)}
  className="text-blue-400 text-xs hover:underline"
>
  {show ? "Hide" : "Show"}
</button>
   


  </div>


     

      {!routes || routes.length === 0 ? (
        <p className="text-gray-400">No routes found.</p>
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
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-green-400">{route.path}</h2>
                <span className="text-xs text-gray-500">
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
                  <pre className="bg-black/40 p-2 rounded overflow-auto">
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
