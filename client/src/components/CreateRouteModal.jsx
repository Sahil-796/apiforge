import React, { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const CreateRouteModal = ({ isOpen, closeModal, onSubmit, projectId }) => {
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    path: '',
    methods: ['GET'],
    logic: 'function(input) {\n  // Write your code here\n  // Use vm2 sandbox for secure execution\n  return { message: "Success" };\n}',
    schema: {
      type: 'object',
      properties: {}
    },
    mockData: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingData, setIsGeneratingData] = useState(false)
  const [isGeneratingLogic, setIsGeneratingLogic] = useState(false)
  const [schemaFields, setSchemaFields] = useState([])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        projectId: projectId || '',
        path: '',
        methods: ['GET'],
        logic: 'function(input) {\n  // Write your code here\n  // Use vm2 sandbox for secure execution\n  return { message: "Success" };\n}',
        schema: {
          type: 'object',
          properties: {}
        },
        mockData: []
      })
      setSchemaFields([])
      setIsLoading(false)
    }
  }, [isOpen, projectId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter(m => m !== method)
        : [...prev.methods, method]
    }))
  }

  const addSchemaField = () => {
    setSchemaFields(prev => [...prev, { name: '', type: 'string' }])
  }

  const updateSchemaField = (index, field, value) => {
    const newFields = [...schemaFields]
    newFields[index][field] = value
    setSchemaFields(newFields)
    
    // Update schema in formData
    const properties = {}
    newFields.forEach(field => {
      if (field.name) {
        properties[field.name] = { type: field.type }
      }
    })
    
    setFormData(prev => ({
      ...prev,
      schema: {
        type: 'object',
        properties
      }
    }))
  }

  const removeSchemaField = (index) => {
    const newFields = schemaFields.filter((_, i) => i !== index)
    setSchemaFields(newFields)
    
    // Update schema in formData
    const properties = {}
    newFields.forEach(field => {
      if (field.name) {
        properties[field.name] = { type: field.type }
      }
    })
    
    setFormData(prev => ({
      ...prev,
      schema: {
        type: 'object',
        properties
      }
    }))
  }

  const generateMockData = async () => {
    if (Object.keys(formData.schema.properties).length === 0) {
      alert('Please add schema fields before generating mock data')
      return
    }

    setIsGeneratingData(true)
    try {
      const response = await fetch('http://localhost:3000/api/generateData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema: formData.schema })
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          mockData: data.mockData || []
        }))
      } else {
        console.error('Failed to generate mock data')
      }
    } catch (error) {
      console.error('Error generating mock data:', error)
    } finally {
      setIsGeneratingData(false)
    }
  }

  const generateLogic = async () => {
    if (Object.keys(formData.schema.properties).length === 0) {
      alert('Please add schema fields before generating logic')
      return
    }

    setIsGeneratingLogic(true)
    try {
      const response = await fetch('http://localhost:3000/api/generateLogic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema: formData.schema })
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          logic: data.logic || prev.logic
        }))
      } else {
        console.error('Failed to generate logic')
      }
    } catch (error) {
      console.error('Error generating logic:', error)
    } finally {
      setIsGeneratingLogic(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error creating route:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-[#2f2f2f] border border-[#3a3a3a] p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  Create New Route
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project ID */}
                  <div>
                    <label htmlFor="projectId" className="block text-sm font-medium text-gray-300 mb-1">
                      Project ID *
                    </label>
                    <input
                      type="text"
                      id="projectId"
                      name="projectId"
                      required
                      value={formData.projectId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project ID"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Path */}
                  <div>
                    <label htmlFor="path" className="block text-sm font-medium text-gray-300 mb-1">
                      Route Path *
                    </label>
                    <input
                      type="text"
                      id="path"
                      name="path"
                      required
                      value={formData.path}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/api/route"
                      disabled={isLoading}
                    />
                  </div>

                  {/* HTTP Methods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      HTTP Methods *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => (
                        <label key={method} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.methods.includes(method)}
                            onChange={() => handleMethodChange(method)}
                            className="mr-2 rounded border-gray-300"
                            disabled={isLoading}
                          />
                          <span className="text-gray-300">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Schema Fields */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Schema Fields
                      </label>
                      <button
                        type="button"
                        onClick={addSchemaField}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        disabled={isLoading}
                      >
                        Add Field
                      </button>
                    </div>
                    <div className="space-y-2">
                      {schemaFields.map((field, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Field name"
                            value={field.name}
                            onChange={(e) => updateSchemaField(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <select
                            value={field.type}
                            onChange={(e) => updateSchemaField(index, 'type', e.target.value)}
                            className="px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                          >
                            <option value="string">String</option>
                            <option value="integer">Integer</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="array">Array</option>
                            <option value="object">Object</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeSchemaField(index)}
                            className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                            disabled={isLoading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Data */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Mock Data
                      </label>
                      <button
                        type="button"
                        onClick={generateMockData}
                        disabled={isGeneratingData || isLoading}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded text-sm flex items-center space-x-1"
                      >
                        {isGeneratingData && (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>✨ Generate with AI</span>
                      </button>
                    </div>
                    <textarea
                      value={JSON.stringify(formData.mockData, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value)
                          setFormData(prev => ({ ...prev, mockData: parsed }))
                        } catch (error) {
                          // Invalid JSON, don't update
                        }
                      }}
                      rows={6}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                      placeholder="[]"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      *Generate mock data using AI
                    </p>
                  </div>

                  {/* Logic */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Logic Function
                      </label>
                      <button
                        type="button"
                        onClick={generateLogic}
                        disabled={isGeneratingLogic || isLoading}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:opacity-50 text-white rounded text-sm flex items-center space-x-1"
                      >
                        {isGeneratingLogic && (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>✨ Generate with AI</span>
                      </button>
                    </div>
                    <textarea
                      value={formData.logic}
                      onChange={(e) => setFormData(prev => ({ ...prev, logic: e.target.value }))}
                      rows={8}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Write your function logic here. Use vm2 sandbox for secure execution.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm text-gray-300 hover:text-white transition duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !formData.projectId || !formData.path || formData.methods.length === 0}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-sm transition duration-200 flex items-center space-x-2"
                    >
                      {isLoading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>{isLoading ? 'Creating...' : 'Create Route'}</span>
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CreateRouteModal