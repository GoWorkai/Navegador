"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Home,
  Music,
  Gamepad2,
  GraduationCap,
  Atom,
  Tv,
  Users,
  Plus,
  Settings,
  Bell,
  MessageCircle,
  Grid3X3,
  Brain,
  Globe,
  TrendingUp,
  Sparkles,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SearchWindow } from "@/components/windows/search-window"
import { BrowserWindow } from "@/components/windows/browser-window"

interface CommunityBrowserProps {
  onClose?: () => void
}

export default function CommunityBrowser({ onClose }: CommunityBrowserProps) {
  const [activeCategory, setActiveCategory] = useState("Home")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState("Lofi Hip Hop - Study Beats")
  const [volume, setVolume] = useState(75)

  const categories = [
    { id: "Home", name: "Home", icon: Home },
    { id: "Music", name: "Music", icon: Music },
    { id: "Gaming", name: "Gaming", icon: Gamepad2 },
    { id: "Education", name: "Education", icon: GraduationCap },
    { id: "Science", name: "Science & Tec", icon: Atom },
    { id: "Entertainment", name: "Entertainment", icon: Tv },
    { id: "Students", name: "Student hubs", icon: Users },
  ]

  const featuredCommunities = [
    {
      id: 1,
      title: "Virtual Reality",
      description: "A community for VR and novices alike, regular and friendly chat.",
      members: "345,678 Members",
      image: "/virtual-reality-neon.png",
      category: "Gaming",
      trending: true,
    },
    {
      id: 2,
      title: "Game Play",
      description: "Always a new challenge. Great place to make new friends.",
      members: "948,712 Members",
      image: "/gaming-colorful-abstract.png",
      category: "Gaming",
      trending: false,
    },
  ]

  const popularCommunities = [
    {
      id: 1,
      title: "3D Art",
      description: "A great place to discuss art.",
      members: "345,678 Members",
      image: "/3d-digital-brain.png",
      category: "Entertainment",
      aiRecommended: true,
    },
    {
      id: 2,
      title: "NFT",
      description: "An NFT community so that everyone can share their NFTs.",
      members: "345,678 Members",
      image: "/placeholder-344s8.png",
      category: "Entertainment",
      aiRecommended: false,
    },
  ]

  const newMembers = [
    { name: "Anne Couture", time: "5 min ago", avatar: "/woman-profile.png", status: "online" },
    { name: "Miriam Soleil", time: "7 min ago", avatar: "/woman-profile-two.png", status: "away" },
    { name: "Marie Laval", time: "35 min ago", avatar: "/woman-profile-3.png", status: "offline" },
    { name: "Mark Morain", time: "40 min ago", avatar: "/man-profile.png", status: "online" },
  ]

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query)
      setShowAdvancedSearch(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    const tracks = ["Lofi Hip Hop - Study Beats", "Ambient Space - Deep Focus", "Jazz Cafe - Relaxing"]
    const currentIndex = tracks.indexOf(currentTrack)
    const nextIndex = (currentIndex + 1) % tracks.length
    setCurrentTrack(tracks[nextIndex])
  }

  const prevTrack = () => {
    const tracks = ["Lofi Hip Hop - Study Beats", "Ambient Space - Deep Focus", "Jazz Cafe - Relaxing"]
    const currentIndex = tracks.indexOf(currentTrack)
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1
    setCurrentTrack(tracks[prevIndex])
  }

  if (showAdvancedSearch) {
    return (
      <div className="h-full w-full">
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <Button
            variant="ghost"
            onClick={() => setShowAdvancedSearch(false)}
            className="text-gray-400 hover:text-white"
          >
            ← Volver a Comunidades
          </Button>
          <h1 className="text-white font-semibold">Búsqueda Inteligente</h1>
          <div className="w-20"></div>
        </div>
        <SearchWindow />
      </div>
    )
  }

  if (showBrowser) {
    return (
      <div className="h-full w-full">
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <Button variant="ghost" onClick={() => setShowBrowser(false)} className="text-gray-400 hover:text-white">
            ← Volver a Comunidades
          </Button>
          <h1 className="text-white font-semibold">Navegador Web</h1>
          <div className="w-20"></div>
        </div>
        <BrowserWindow />
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-purple-600 to-purple-800 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold">Explore</span>
        </div>

        <nav className="flex-1 space-y-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeCategory === category.id ? "bg-gray-800 text-white" : "text-purple-100 hover:bg-purple-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.name}
              </button>
            )
          })}

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-purple-700 mt-4">
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </nav>

        {/* Enhanced Music Player */}
        <div className="mt-auto">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-20 rounded-lg flex items-end justify-center p-4 mb-4">
            <div className="flex items-end gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-full ${isPlaying ? "animate-pulse" : ""}`}
                  style={{
                    width: "3px",
                    height: `${Math.random() * 30 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <div className="text-sm font-medium text-white mb-2 truncate">{currentTrack}</div>
            <div className="flex items-center justify-between mb-2">
              <Button size="sm" variant="ghost" onClick={prevTrack} className="text-purple-200 hover:text-white">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={togglePlayPause} className="text-purple-200 hover:text-white">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={nextTrack} className="text-purple-200 hover:text-white">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-3 h-3 text-purple-200" />
              <div className="flex-1 bg-gray-700 rounded-full h-1">
                <div className="bg-purple-400 h-1 rounded-full transition-all" style={{ width: `${volume}%` }}></div>
              </div>
              <span className="text-xs text-purple-200">{volume}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-purple-200">Sophiefortune</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-purple-200 hover:text-white">
                <Music className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-purple-200 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Búsqueda inteligente con IA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  <Brain className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowBrowser(true)}
              className="text-gray-400 hover:text-white"
              title="Navegador Web"
            >
              <Globe className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAdvancedSearch(true)}
              className="text-gray-400 hover:text-white"
              title="Búsqueda Avanzada"
            >
              <Brain className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Grid3X3 className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Enhanced Hero Banner */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Find your Community</h1>
                <p className="text-xl mb-4">on Daccoard</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    IA Recomendada
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              </div>
              <div className="absolute right-4 top-4 w-32 h-32 opacity-30">
                <div className="w-full h-full bg-white/20 rounded-full"></div>
              </div>
            </div>

            {/* Enhanced Featured Community */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  Featured Community
                  <Badge variant="outline" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    IA Curated
                  </Badge>
                </h2>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  See all
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {featuredCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors cursor-pointer relative"
                  >
                    {community.trending && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <div className="h-32 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg mb-4 relative overflow-hidden">
                      <img
                        src={community.image || "/placeholder.svg"}
                        alt={community.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <h3 className="font-semibold mb-2">{community.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{community.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{community.members}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {community.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Popular Right Now */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Popular Right Now</h2>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  See all
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {popularCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors cursor-pointer relative"
                  >
                    {community.aiRecommended && (
                      <Badge className="absolute top-2 right-2 bg-purple-500 text-white text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        IA
                      </Badge>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex-shrink-0">
                        <img
                          src={community.image || "/placeholder.svg"}
                          alt={community.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{community.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{community.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{community.members}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {community.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Add */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Add</h2>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  See all
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 rounded-xl h-32 bg-gradient-to-br from-purple-600 to-pink-500 hover:scale-105 transition-transform cursor-pointer"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Right Sidebar */}
          <div className="w-80 bg-gray-800 p-6">
            {/* User Profile */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <h3 className="font-semibold">Sophie Fortune</h3>
              <p className="text-sm text-gray-400">@sophiefortune</p>
              <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
                <div>
                  <span className="text-white font-semibold">127</span>
                  <div>Communities</div>
                </div>
                <div>
                  <span className="text-white font-semibold">2.4k</span>
                  <div>Following</div>
                </div>
                <div>
                  <span className="text-white font-semibold">892</span>
                  <div>Followers</div>
                </div>
              </div>
            </div>

            {/* Enhanced New Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">New Members</h3>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  See all
                </Button>
              </div>

              <div className="space-y-3">
                {newMembers.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex-shrink-0 relative">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-800 ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.time}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow Me */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Follow me</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📷</span>
                  </div>
                  <span className="text-sm">@betsc.lot</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📌</span>
                  </div>
                  <span className="text-sm">@betselottadele357</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
