import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const mockRoutes = [
  {
    _id: "r1",
    path: "/users",
    methods: ["GET", "POST"],
    logic: "return users.filter(u => u.active); // example VM2 code",
    updatedAt: "2025-06-25T13:45:00.000Z",
    schema: {
      name: "string",
      email: "string",
    }
  },
  {
    _id: "r2",
    path: "/users/:id",
    methods: ["GET", "PUT", "DELETE"],
    // No logic here
    updatedAt: "2025-06-24T11:00:00.000Z",
    schema: {
      id: "string"
    }
  }
];

const ProjectPage = () => {
  const { slug } = useParams(); // e.g., project slug like 'users'
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    // Later replace with actual fetch from backend/context
    setRoutes(mockRoutes);
  }, []);

  const apiKey = 'apeljenilapkjskrs'
  const [show, setShow] = useState(false)

  return (

    
    <div className="p-6 text-white max-w-5xl mx-auto flex flex-col gap-6">

         <h1 className="text-2xl font-bold">Available Routes<span className="text-blue-400">{slug}</span></h1>

          <div className="rounded-xl bg-[#2f2f2f] p-6 shadow-sm border border-[#3a3a3a]">
    <h2 className="text-lg font-medium mb-2">Project Overview</h2>
    <p className="text-sm text-gray-300">
      Name: 
    </p>
    <p className="text-sm text-gray-300">
      slug: 
    </p>
    <p className="text-sm text-gray-300">
      Api Key: {show?apiKey:"*****"}
    </p>
    <button onClick={()=>setShow((p)=>!p)}>
        Show api key
    </button>

  </div>


     

      {routes.length === 0 ? (
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
