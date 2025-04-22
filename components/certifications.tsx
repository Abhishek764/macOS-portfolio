import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, X, Check, Calendar, Award, Building2 } from "lucide-react"

interface Certification {
  id: string
  name: string
  organization: string
  issueDate: string
  expirationDate?: string
  credentialUrl?: string
  imageUrl?: string // Added for storing the image URL
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Certification, "id">>({
    name: "",
    organization: "",
    issueDate: "",
    expirationDate: "",
    credentialUrl: "",
    imageUrl: "", // Added for storing the image URL
  })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Load certifications from localStorage on mount
  useEffect(() => {
    const savedCertifications = localStorage.getItem("portfolio-certifications")
    if (savedCertifications) {
      try {
        setCertifications(JSON.parse(savedCertifications))
      } catch (e) {
        console.error("Failed to parse saved certifications", e)
        // Set default certifications if parsing fails
        setCertifications(getDefaultCertifications())
        localStorage.setItem("portfolio-certifications", JSON.stringify(getDefaultCertifications()))
      }
    } else {
      // Set default certifications if none exist
      setCertifications(getDefaultCertifications())
      localStorage.setItem("portfolio-certifications", JSON.stringify(getDefaultCertifications()))
    }
  }, [])

  // Save certifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem("portfolio-certifications", JSON.stringify(certifications))
  }, [certifications])

  // Default certifications for demo purposes
  function getDefaultCertifications(): Certification[] {
    return [
      {
        id: "1",
        name: "Cloud Computing",
        organization: "NPTEL",
        issueDate: "2024-11-29",
        credentialUrl: "https://aws.amazon.com/certification/",
      },
      {
        id: "2",
        name: "Data Structures And Algorithms",
        organization: "Udemy",
        issueDate: "2023-02-10",
        credentialUrl: "https://www.cncf.io/certification/cka/",
      },
      {
        id: "3",
        name: "Full Stack Development using Mern",
        organization: "CipherSchools",
        issueDate: "2024-07-20",
        Certificate_ID: 'CS2024-11578',
      },
    ]
  }

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      organization: "",
      issueDate: "",
      expirationDate: "",
      Certificate_ID: "",
      credentialUrl: "",
      imageUrl: "", // Reset the image URL
    })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Add a new certification
  const handleAddCertification = () => {
    if (!formData.name || !formData.organization || !formData.issueDate) {
      alert("Please fill in all required fields")
      return
    }

    const newCertification: Certification = {
      id: Date.now().toString(),
      ...formData,
    }

    setCertifications((prev) => [newCertification, ...prev])
    resetForm()
    setIsAddingNew(false)
  }

  // Start editing a certification
  const handleStartEdit = (cert: Certification) => {
    setIsEditing(cert.id)
    setFormData({
      name: cert.name,
      organization: cert.organization,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate || "",
      credentialUrl: cert.credentialUrl || "",
      imageUrl: cert.imageUrl || "", // Load the existing image URL if any
    })
  }

  // Save edited certification
  const handleSaveEdit = () => {
    if (!isEditing) return
    if (!formData.name || !formData.organization || !formData.issueDate) {
      alert("Please fill in all required fields")
      return
    }

    setCertifications((prev) =>
      prev.map((cert) =>
        cert.id === isEditing
          ? {
              ...cert,
              name: formData.name,
              organization: formData.organization,
              issueDate: formData.issueDate,
              expirationDate: formData.expirationDate,
              credentialUrl: formData.credentialUrl,
              imageUrl: formData.imageUrl, // Save the image URL as well
            }
          : cert,
      ),
    )

    setIsEditing(null)
    resetForm()
  }

  // Cancel editing or adding
  const handleCancel = () => {
    setIsEditing(null)
    setIsAddingNew(false)
    resetForm()
  }

  // Delete a certification
  const handleDelete = (id: string) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== id))
    setDeleteConfirm(null)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
  }

  // Filter certifications based on search query
  const filteredCertifications = certifications.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.organization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header with search and add button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Certifications</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search certifications..."
              className="px-3 py-1.5 pr-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <X
              size={16}
              className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer ${
                !searchQuery && "hidden"
              }`}
              onClick={() => setSearchQuery("")}
            />
          </div>
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            onClick={() => {
              setIsAddingNew(true)
              setIsEditing(null)
            }}
          >
            <PlusCircle size={16} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto p-4">
        {/* Add/Edit Form */}
        {(isAddingNew || isEditing) && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
            <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              {isAddingNew ? "Add New Certification" : "Edit Certification"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certification Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Amazon Web Services"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date *</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Credential URL (Optional)
                </label>
                <input
                  type="url"
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/credential/123"
                />
              </div>
              {/* File Upload for Certificate Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Certificate Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                onClick={isAddingNew ? handleAddCertification : handleSaveEdit}
              >
                <Check size={16} />
                <span>{isAddingNew ? "Add Certification" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Certifications List */}
        {filteredCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertifications.map((cert) => (
              <div
                key={cert.id}
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  isEditing === cert.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">{cert.name}</h3>
                    <div className="flex gap-1">
                      <button
                        className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        onClick={() => handleStartEdit(cert)}
                        aria-label="Edit certification"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        onClick={() => setDeleteConfirm(cert.id)}
                        aria-label="Delete certification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <strong>Issued by:</strong> {cert.organization}
                    </div>
                    <div>
                      <strong>Issue Date:</strong> {formatDate(cert.issueDate)}
                    </div>
                    {cert.expirationDate && (
                      <div>
                        <strong>Expiration Date:</strong> {formatDate(cert.expirationDate)}
                      </div>
                    )}
                    {cert.credentialUrl && (
                      <div>
                        <strong>Credential URL:</strong> <a href={cert.credentialUrl} className="text-blue-500">{cert.credentialUrl}</a>
                      </div>
                    )}
                    {cert.imageUrl && (
                      <div>
                        <strong>Certificate Image:</strong>
                        <img src={cert.imageUrl} alt="Certificate" className="mt-2 max-h-20 rounded-md" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No certifications found</p>
        )}
      </div>
    </div>
  )
}
