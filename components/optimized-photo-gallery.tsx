"use client"

import { useState, useRef, useEffect } from "react"
import {
  X,
  ZoomIn,
  Download,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Search,
  Grid,
  Heart,
  Clock,
  Tag,
  Plus,
} from "lucide-react"
import { useVirtualizer } from "@tanstack/react-virtual"

// Sample gallery data - replace with your actual images
const personalPhotos = [
  {
    id: 1,
    title: "Office",
    description: "Summer trip to the beach with family",
    thumbnail: "/placeholder.svg?height=200&width=300",
    fullImage: "/placeholder.svg?height=800&width=1200",
    category: "Family",
    date: "2023-07-15",
    favorite: true,
  },
  // ... other photos
]

interface PhotoGalleryProps {
  onSetWallpaper?: (imageUrl: string) => void
}

export default function OptimizedPhotoGallery({ onSetWallpaper }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<(typeof personalPhotos)[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"all" | "favorites" | "recents">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [wallpaperSet, setWallpaperSet] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Get unique categories
  const categories = Array.from(new Set(personalPhotos.map((img) => img.category)))

  // Refs for virtualization
  const parentRef = useRef<HTMLDivElement>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter images by category, view, and search
  const filteredImages = personalPhotos.filter((img) => {
    // Filter by category
    if (activeCategory && img.category !== activeCategory) return false

    // Filter by view
    if (activeView === "favorites" && !img.favorite) return false
    if (activeView === "recents") {
      // Consider images from the last 30 days as recent
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const imgDate = new Date(img.date)
      if (imgDate < thirtyDaysAgo) return false
    }

    // Filter by search
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      return (
        img.title.toLowerCase().includes(query) ||
        img.description.toLowerCase().includes(query) ||
        img.category.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Set up virtualization
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(filteredImages.length / 4), // 4 images per row
    getScrollElement: () => parentRef.current,
    estimateSize: () => 250, // Approximate height of each row
    overscan: 5, // Load extra rows for smoother scrolling
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

    // Call the parent function to set the wallpaper
    onSetWallpaper(selectedImage.fullImage)

    // Show success message
    setWallpaperSet(true)

    // Save to local storage
    localStorage.setItem("wallpaper", selectedImage.fullImage)
    localStorage.setItem("wallpaperTitle", selectedImage.title)
  }

  const toggleFavorite = (id: number) => {
    // In a real app, this would update the database
    // For this demo, we'll just update the local state
    const updatedPhotos = personalPhotos.map((photo) =>
      photo.id === id ? { ...photo, favorite: !photo.favorite } : photo,
    )

    // Update the selected image if it's the one being favorited
    if (selectedImage && selectedImage.id === id) {
      setSelectedImage({
        ...selectedImage,
        favorite: !selectedImage.favorite,
      })
    }
  }

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Sidebar and main content layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-gray-200 dark:border-gray-800 flex flex-col">
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
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Library
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center ${
                    activeView === "all"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setActiveView("all")
                    setActiveCategory(null)
                  }}
                >
                  <Grid size={16} className="mr-2" />
                  All Photos
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center ${
                    activeView === "recents"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setActiveView("recents")
                    setActiveCategory(null)
                  }}
                >
                  <Clock size={16} className="mr-2" />
                  Recents
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center ${
                    activeView === "favorites"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setActiveView("favorites")
                    setActiveCategory(null)
                  }}
                >
                  <Heart size={16} className="mr-2" />
                  Favorites
                </button>
              </li>
            </ul>
          </div>

          <div className="px-3 py-2">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex justify-between items-center">
              Categories
              <button className="text-blue-500 hover:text-blue-600">
                <Plus size={14} />
              </button>
            </h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center ${
                      activeCategory === category
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      setActiveCategory(category)
                      setActiveView("all")
                    }}
                  >
                    <Tag size={16} className="mr-2" />
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content with virtualization */}
        <div ref={parentRef} className="flex-1 overflow-auto p-4">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
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

          {filteredImages.length > 0 ? (
            <div
              className="relative"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const rowStart = virtualRow.index * 4
                const rowImages = filteredImages.slice(rowStart, rowStart + 4)

                return (
                  <div
                    key={virtualRow.index}
                    className="absolute top-0 left-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {rowImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className="aspect-square relative">
                          {!loadedImages.has(image.id) && (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          )}
                          <img
                            src={image.thumbnail || "/placeholder.svg"}
                            alt={image.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                              loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={() => handleImageLoad(image.id)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="text-white" />
                          </div>

                          {/* Favorite indicator */}
                          {image.favorite && (
                            <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 rounded-full p-1">
                              <Heart size={16} className="text-red-500 fill-red-500" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <h3 className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                            {image.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {new Date(image.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No photos found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Image viewer modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{selectedImage.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onClick={() => toggleFavorite(selectedImage.id)}
                >
                  <Heart size={18} className={selectedImage.favorite ? "text-red-500 fill-red-500" : ""} />
                </button>
                <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <Download size={18} />
                </button>
                <button
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Image container */}
            <div className="relative flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={selectedImage.fullImage || "/placeholder.svg"}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />

              {/* Navigation buttons */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-gray-800 dark:text-white shadow-lg"
                onClick={handlePrevious}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-gray-800 dark:text-white shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Modal footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedImage.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-3">{new Date(selectedImage.date).toLocaleDateString()}</span>
                  <span className="flex items-center">
                    <Tag size={12} className="mr-1" />
                    {selectedImage.category}
                  </span>
                </div>
                {wallpaperSet && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Set as desktop wallpaper</p>
                )}
              </div>
              <div>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium"
                  onClick={handleSetWallpaper}
                >
                  <Monitor size={16} />
                  <span>Set as Wallpaper</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
