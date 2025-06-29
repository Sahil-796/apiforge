import React, { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const CreateProjectModal = ({ isOpen, closeModal, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', slug: '', description: '' })
      setIsLoading(false)
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from name if slug field hasn't been manually edited
      ...(name === 'name' && {
        slug: value.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      })
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSubmit(formData)
      // Form will be reset by useEffect when modal closes
      // Modal will be closed by parent component
    } catch (error) {
      console.error('Error creating project:', error)
      // Don't close modal on error, keep form data
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-[#2f2f2f] border border-[#3a3a3a] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  Create New Project
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                      Project Slug *
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      required
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="project-slug"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL-friendly version of your project name
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Brief description of your project (optional)"
                      disabled={isLoading}
                    />
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
                      disabled={isLoading || !formData.name || !formData.slug}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-sm transition duration-200 flex items-center space-x-2"
                    >
                      {isLoading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>{isLoading ? 'Creating...' : 'Create Project'}</span>
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

export default CreateProjectModal