"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  Search,
  Grid,
  Heart,
  Clock,
  Tag,
  Plus,
  ArrowLeft,
  Download,
} from "lucide-react"

// Gallery data
const personalPhotos = [
  {
    id: 1,
    title: "Profile Shot",
    description: "A candid photo of Abhishek",
    thumbnail: "/photos/abhishek.jpg",
    fullImage: "/photos/abhishek.jpg",
    category: "Portrait",
    date: "2025-04-30",
    favorite: true,
  },
  {
    id: 2,
    title: "Hiking Adventure",
    description: "Weekend hike in the mountains",
    thumbnail: "/placeholder.svg?height=200&width=300",
    fullImage: "/placeholder.svg?height=800&width=1200",
    category: "Nature",
    date: "2023-06-22",
    favorite: false,
  },
  {
    id: 3,
    title: "Birthday Celebration",
    description: "Birthday party with friends",
    thumbnail: "/placeholder.svg?height=200&width=300",
    fullImage: "/placeholder.svg?height=800&width=1200",
    category: "Events",
    date: "2023-05-10",
    favorite: true,
  },
  {
    id: 4,
    title: "Sunset at the Beach",
    description: "Beautiful sunset captured during vacation",
    thumbnail: "/placeholder.svg?height=200&width=300",
    fullImage: "/placeholder.svg?height=800&width=1200",
    category: "Nature",
    date: "2023-07-16",
    favorite: true,
  },
  {
    id: 5,
    title: "Office Team Building",
    description: "Annual team building event",
    thumbnail: "/placeholder.svg?height=200&width=300",
    fullImage: "/placeholder.svg?height=800&width=1200",
    category: "Work",
    date: "2023-04-05",
    favorite: false,
  },
  {
    id: 6,
    title: "Pet Portrait",
    description: "My dog Max enjoying the park",
    thumbnail: "/placeholder.svg?height=200&width=300",
    fullImage: "/placeholder.svg?height=800&width=1200",
    category: "Pets",
    date: "2023-03-12",
    favorite: true,
  },
]

interface PhotoGalleryProps {
  onSetWallpaper?: (imageUrl: string) => void
}

export default function PhotoGallery({ onSetWallpaper }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<(typeof personalPhotos)[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"all" | "favorites" | "recents">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [wallpaperSet, setWallpaperSet] = useState(false)

  // Get unique categories
  const categories = Array.from(new Set(personalPhotos.map((img) => img.category)))

  // Filter images
  const filteredImages = personalPhotos.filter((img) => {
    if (activeCategory && img.category !== activeCategory) return false
    if (activeView === "favorites" && !img.favorite) return false
    if (activeView === "recents") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      if (new Date(img.date) < thirtyDaysAgo) return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        img.title.toLowerCase().includes(query) ||
        img.description.toLowerCase().includes(query) ||
        img.category.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleNext = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setSelectedImage(filteredImages[nextIndex])
    setWallpaperSet(false)
  }

  const handlePrevious = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[prevIndex])
    setWallpaperSet(false)
  }

  const handleSetWallpaper = () => {
    if (!selectedImage || !onSetWallpaper) return
    onSetWallpaper(selectedImage.fullImage)
    setWallpaperSet(true)
    localStorage.setItem("wallpaper", selectedImage.fullImage)
    localStorage.setItem("wallpaperTitle", selectedImage.title)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/80 dark:bg-gray-900/80 shrink-0">
          <div className="p-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search photos..."
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-2 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          <div className="px-3 py-2">
            <h3 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Library
            </h3>
            <ul className="space-y-0.5">
              <li>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] flex items-center gap-2 ${
                    activeView === "all" && !activeCategory
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setActiveView("all")
                    setActiveCategory(null)
                  }}
                >
                  <Grid size={15} />
                  All Photos
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] flex items-center gap-2 ${
                    activeView === "recents"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setActiveView("recents")
                    setActiveCategory(null)
                  }}
                >
                  <Clock size={15} />
                  Recents
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] flex items-center gap-2 ${
                    activeView === "favorites"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setActiveView("favorites")
                    setActiveCategory(null)
                  }}
                >
                  <Heart size={15} />
                  Favorites
                </button>
              </li>
            </ul>
          </div>

          <div className="px-3 py-2">
            <h3 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex justify-between items-center">
              Albums
              <button className="text-blue-500 hover:text-blue-600">
                <Plus size={14} />
              </button>
            </h3>
            <ul className="space-y-0.5">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] flex items-center gap-2 ${
                      activeCategory === category
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      setActiveCategory(category)
                      setActiveView("all")
                    }}
                  >
                    <Tag size={15} />
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto flex flex-col">
          {selectedImage ? (
            /* ===== INLINE IMAGE VIEWER ===== */
            <div className="flex flex-col h-full">
              {/* Viewer toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setWallpaperSet(false)
                  }}
                  className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 absolute left-1/2 -translate-x-1/2">
                  {selectedImage.title}
                </h3>

                <div className="flex items-center gap-1">
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  {onSetWallpaper && (
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        wallpaperSet
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      onClick={handleSetWallpaper}
                    >
                      <Monitor size={14} />
                      {wallpaperSet ? "✓ Set" : "Set Wallpaper"}
                    </button>
                  )}
                </div>
              </div>

              {/* Image display area */}
              <div className="flex-1 relative bg-black/5 dark:bg-black/30 flex items-center justify-center overflow-hidden min-h-0">
                {/* Previous button */}
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-gray-800 dark:text-white shadow-lg transition-all opacity-70 hover:opacity-100"
                  onClick={handlePrevious}
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Image */}
                <img
                  src={selectedImage.fullImage || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />

                {/* Next button */}
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-gray-800 dark:text-white shadow-lg transition-all opacity-70 hover:opacity-100"
                  onClick={handleNext}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Info bar */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 shrink-0">
                <div className="flex items-center gap-3">
                  <span>{selectedImage.description}</span>
                  <span>•</span>
                  <span>{new Date(selectedImage.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Tag size={11} />
                    {selectedImage.category}
                  </span>
                </div>
                <span className="text-gray-400">
                  {filteredImages.findIndex((img) => img.id === selectedImage.id) + 1} of {filteredImages.length}
                </span>
              </div>
            </div>
          ) : (
            /* ===== THUMBNAIL GRID ===== */
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {activeCategory
                  ? activeCategory
                  : activeView === "favorites"
                    ? "Favorites"
                    : activeView === "recents"
                      ? "Recent Photos"
                      : "All Photos"}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  {filteredImages.length} {filteredImages.length === 1 ? "photo" : "photos"}
                </span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={image.thumbnail || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-opacity" />
                      {image.favorite && (
                        <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 rounded-full p-1">
                          <Heart size={14} className="text-red-500 fill-red-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-medium truncate text-gray-900 dark:text-gray-100">{image.title}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        {new Date(image.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">No photos found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
