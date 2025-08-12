"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  X,
  Search,
  List,
  Radio,
  Plus,
  Music,
  Cast,
  Maximize,
  Minimize,
  Settings,
  Upload,
} from "lucide-react"

interface MediaPlayerProps {
  onClose?: () => void
}

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  url: string
  cover?: string
  type: "audio" | "video"
}

interface Playlist {
  id: string
  name: string
  tracks: Track[]
  cover?: string
  createdAt: Date
}

const sampleTracks: Track[] = [
  {
    id: "1",
    title: "Ambient Dreams",
    artist: "Chill Vibes",
    album: "Relaxation",
    duration: 240,
    url: "/placeholder.mp3",
    cover: "/ambient-music-cover.png",
    type: "audio",
  },
  {
    id: "2",
    title: "Electronic Pulse",
    artist: "Synth Wave",
    album: "Digital Nights",
    duration: 195,
    url: "/placeholder.mp3",
    cover: "/electronic-music-cover.png",
    type: "audio",
  },
  {
    id: "3",
    title: "Nature Documentary",
    artist: "BBC Earth",
    album: "Wildlife Series",
    duration: 3600,
    url: "/placeholder.mp4",
    cover: "/nature-documentary-thumbnail.png",
    type: "video",
  },
  {
    id: "4",
    title: "Jazz Cafe",
    artist: "Smooth Jazz Collective",
    album: "Evening Sessions",
    duration: 280,
    url: "/placeholder.mp3",
    cover: "/jazz-album-cover.png",
    type: "audio",
  },
]

const samplePlaylists: Playlist[] = [
  {
    id: "1",
    name: "Favoritos",
    tracks: sampleTracks.slice(0, 2),
    cover: "/favorites-playlist.png",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Relajación",
    tracks: [sampleTracks[0], sampleTracks[3]],
    cover: "/relaxation-playlist.png",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Videos",
    tracks: sampleTracks.filter((t) => t.type === "video"),
    cover: "/video-playlist.png",
    createdAt: new Date(),
  },
]

export function MediaPlayer({ onClose }: MediaPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(sampleTracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(true)
  const [showQueue, setShowQueue] = useState(false)
  const [activeView, setActiveView] = useState<"library" | "search" | "radio" | "settings">("library")
  const [searchQuery, setSearchQuery] = useState("")
  const [playlists, setPlaylists] = useState<Playlist[]>(samplePlaylists)
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(samplePlaylists[0])
  const [queue, setQueue] = useState<Track[]>(sampleTracks)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [audioDevice, setAudioDevice] = useState("default")
  const [visualizer, setVisualizer] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && currentTrack) {
        const mediaElement = currentTrack.type === "video" ? videoRef.current : audioRef.current
        if (mediaElement) {
          setCurrentTime(mediaElement.currentTime)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, currentTrack])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    if (!currentTrack) return

    const mediaElement = currentTrack.type === "video" ? videoRef.current : audioRef.current
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause()
      } else {
        mediaElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePrevious = () => {
    if (!currentPlaylist) return
    const currentIndex = currentPlaylist.tracks.findIndex((t) => t.id === currentTrack?.id)
    if (currentIndex > 0) {
      setCurrentTrack(currentPlaylist.tracks[currentIndex - 1])
      setCurrentTime(0)
    }
  }

  const handleNext = () => {
    if (!currentPlaylist) return
    const currentIndex = currentPlaylist.tracks.findIndex((t) => t.id === currentTrack?.id)
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      setCurrentTrack(currentPlaylist.tracks[currentIndex + 1])
      setCurrentTime(0)
    }
  }

  const handleSeek = (value: number[]) => {
    if (!currentTrack) return
    const mediaElement = currentTrack.type === "video" ? videoRef.current : audioRef.current
    if (mediaElement) {
      mediaElement.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    const mediaElement = currentTrack?.type === "video" ? videoRef.current : audioRef.current
    if (mediaElement) {
      mediaElement.volume = newVolume / 100
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    const mediaElement = currentTrack?.type === "video" ? videoRef.current : audioRef.current
    if (mediaElement) {
      mediaElement.muted = !isMuted
    }
  }

  const playTrack = (track: Track) => {
    setCurrentTrack(track)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const addToPlaylist = (track: Track, playlistId: string) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, tracks: [...playlist.tracks, track] } : playlist,
      ),
    )
  }

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      cover: "/new-playlist.png",
      createdAt: new Date(),
    }
    setPlaylists((prev) => [...prev, newPlaylist])
  }

  const streamingServices = [
    { name: "Spotify", icon: "🎵", color: "bg-green-600", connected: true },
    { name: "YouTube Music", icon: "🎥", color: "bg-red-600", connected: false },
    { name: "Apple Music", icon: "🍎", color: "bg-gray-800", connected: false },
    { name: "SoundCloud", icon: "☁️", color: "bg-orange-600", connected: true },
  ]

  return (
    <Card
      className={`${isFullscreen ? "fixed inset-0 z-50" : "w-full h-full"} bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-2xl overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Centro Multimedia</h2>
            <p className="text-gray-400 text-sm">Reproductor integrado con IA</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-white"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisualizer(!visualizer)}
            className="text-gray-400 hover:text-white"
          >
            <Radio className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/50 border-r border-gray-700 flex flex-col">
          <div className="p-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeView === "library" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveView("library")}
              >
                <Music className="h-4 w-4 mr-3" />
                Mi Biblioteca
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeView === "search" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveView("search")}
              >
                <Search className="h-4 w-4 mr-3" />
                Buscar
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeView === "radio" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveView("radio")}
              >
                <Radio className="h-4 w-4 mr-3" />
                Radio IA
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeView === "settings" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveView("settings")}
              >
                <Settings className="h-4 w-4 mr-3" />
                Configuración
              </Button>
            </nav>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">PLAYLISTS</h3>
              <div className="space-y-1">
                {playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    variant="ghost"
                    className={`w-full justify-start text-left ${currentPlaylist?.id === playlist.id ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
                    onClick={() => setCurrentPlaylist(playlist)}
                  >
                    <List className="h-4 w-4 mr-3 flex-shrink-0" />
                    <div className="truncate">
                      <div className="truncate">{playlist.name}</div>
                      <div className="text-xs text-gray-500">{playlist.tracks.length} canciones</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">SERVICIOS</h3>
              <div className="space-y-1">
                {streamingServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-700/50"
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 ${service.color} rounded flex items-center justify-center text-xs mr-2`}>
                        {service.icon}
                      </div>
                      <span className="text-gray-300 text-sm">{service.name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${service.connected ? "bg-green-400" : "bg-gray-600"}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeView === "library" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {currentPlaylist ? currentPlaylist.name : "Mi Biblioteca"}
                  </h2>
                  <div className="flex space-x-2">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Playlist
                    </Button>
                    <Button variant="outline" className="border-gray-600 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivos
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {(currentPlaylist?.tracks || sampleTracks).map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-all group ${currentTrack?.id === track.id ? "bg-purple-600/20" : ""}`}
                      onClick={() => playTrack(track)}
                    >
                      <div className="w-8 text-gray-400 text-sm">{index + 1}</div>
                      <div className="w-12 h-12 bg-gray-700 rounded mr-4 flex items-center justify-center overflow-hidden">
                        {track.cover ? (
                          <img
                            src={track.cover || "/placeholder.svg"}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Music className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{track.title}</div>
                        <div className="text-gray-400 text-sm truncate">{track.artist}</div>
                      </div>
                      <div className="text-gray-400 text-sm mr-4">{track.album}</div>
                      <div className="text-gray-400 text-sm mr-4">{formatTime(track.duration)}</div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "search" && (
              <div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar canciones, artistas, álbumes..."
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sampleTracks
                    .filter(
                      (track) =>
                        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        track.artist.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((track) => (
                      <div
                        key={track.id}
                        className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 cursor-pointer transition-all group"
                        onClick={() => playTrack(track)}
                      >
                        <div className="aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                          {track.cover ? (
                            <img
                              src={track.cover || "/placeholder.svg"}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Music className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="text-white font-medium truncate">{track.title}</div>
                        <div className="text-gray-400 text-sm truncate">{track.artist}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeView === "radio" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Radio IA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Estación Personalizada</h3>
                    <p className="text-purple-100 mb-4">Música generada por IA basada en tus gustos</p>
                    <Button className="bg-white/20 hover:bg-white/30 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Reproducir
                    </Button>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Ambiente Inteligente</h3>
                    <p className="text-blue-100 mb-4">Música adaptada a tu actividad actual</p>
                    <Button className="bg-white/20 hover:bg-white/30 text-white">
                      <Radio className="h-4 w-4 mr-2" />
                      Activar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeView === "settings" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Configuración</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Audio</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-300 text-sm mb-2 block">Dispositivo de Audio</label>
                        <select
                          value={audioDevice}
                          onChange={(e) => setAudioDevice(e.target.value)}
                          className="w-full bg-gray-800 border-gray-600 text-white rounded px-3 py-2"
                        >
                          <option value="default">Altavoces (Predeterminado)</option>
                          <option value="headphones">Auriculares Bluetooth</option>
                          <option value="external">Altavoces Externos</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm mb-2 block">Velocidad de Reproducción</label>
                        <Slider
                          value={[playbackSpeed]}
                          onValueChange={(value) => setPlaybackSpeed(value[0])}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="text-gray-400 text-sm mt-1">{playbackSpeed}x</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Visualización</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visualizer}
                          onChange={(e) => setVisualizer(e.target.checked)}
                          className="mr-3"
                        />
                        <span className="text-gray-300">Activar visualizador de audio</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Now Playing Bar */}
          {currentTrack && (
            <div className="bg-gray-800/90 backdrop-blur border-t border-gray-700 p-4">
              <div className="flex items-center space-x-4">
                {/* Track Info */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-14 h-14 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                    {currentTrack.cover ? (
                      <img
                        src={currentTrack.cover || "/placeholder.svg"}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium truncate">{currentTrack.title}</div>
                    <div className="text-gray-400 text-sm truncate">{currentTrack.artist}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white flex-shrink-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={`${isShuffle ? "text-purple-400" : "text-gray-400"} hover:text-white`}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      className="text-gray-400 hover:text-white"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handlePlayPause}
                      className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 p-0"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleNext} className="text-gray-400 hover:text-white">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={`${isRepeat ? "text-purple-400" : "text-gray-400"} hover:text-white`}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 w-full">
                    <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      onValueChange={handleSeek}
                      max={currentTrack.duration}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-gray-400 text-xs">{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>

                {/* Volume */}
                <div className="flex items-center space-x-2 flex-1 justify-end">
                  <Button variant="ghost" size="sm" onClick={toggleMute} className="text-gray-400 hover:text-white">
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} className="w-24" />
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Cast className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQueue(!showQueue)}
                    className="text-gray-400 hover:text-white"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio/Video Elements */}
      <audio ref={audioRef} src={currentTrack?.type === "audio" ? currentTrack.url : ""} />
      <video ref={videoRef} src={currentTrack?.type === "video" ? currentTrack.url : ""} className="hidden" />
    </Card>
  )
}
