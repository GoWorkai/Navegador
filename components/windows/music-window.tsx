"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  isLiked: boolean
}

interface Playlist {
  id: string
  name: string
  songs: Song[]
  cover: string
}

export function MusicWindow() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState([0])
  const [activePlaylist, setActivePlaylist] = useState<string>("favorites")

  const songs: Song[] = [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: "5:55",
      cover: "/placeholder.svg?height=60&width=60",
      isLiked: true,
    },
    {
      id: "2",
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      duration: "6:30",
      cover: "/placeholder.svg?height=60&width=60",
      isLiked: false,
    },
    {
      id: "3",
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      duration: "3:07",
      cover: "/placeholder.svg?height=60&width=60",
      isLiked: true,
    },
    {
      id: "4",
      title: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      duration: "4:54",
      cover: "/placeholder.svg?height=60&width=60",
      isLiked: false,
    },
  ]

  const playlists: Playlist[] = [
    {
      id: "favorites",
      name: "Favoritos",
      songs: songs.filter((song) => song.isLiked),
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "recent",
      name: "Reproducidos recientemente",
      songs: songs.slice(0, 3),
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "rock",
      name: "Rock Clásico",
      songs: songs.slice(0, 2),
      cover: "/placeholder.svg?height=200&width=200",
    },
  ]

  const currentPlaylist = playlists.find((p) => p.id === activePlaylist) || playlists[0]

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress([0])
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLike = (songId: string) => {
    // En una implementación real, esto actualizaría el estado de la canción
    console.log("Toggle like for song:", songId)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-black/20 backdrop-blur-sm p-4">
          <h2 className="text-xl font-bold mb-6">Mi Música</h2>

          <nav className="space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => setActivePlaylist(playlist.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activePlaylist === playlist.id ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img src={playlist.cover || "/placeholder.svg"} alt={playlist.name} className="w-10 h-10 rounded" />
                  <div>
                    <p className="font-medium">{playlist.name}</p>
                    <p className="text-sm text-gray-300">{playlist.songs.length} canciones</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Header de playlist */}
          <div className="p-6 bg-gradient-to-b from-black/40 to-transparent">
            <div className="flex items-end space-x-6">
              <img
                src={currentPlaylist.cover || "/placeholder.svg"}
                alt={currentPlaylist.name}
                className="w-48 h-48 rounded-lg shadow-2xl"
              />
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-300">Playlist</p>
                <h1 className="text-5xl font-bold mb-4">{currentPlaylist.name}</h1>
                <p className="text-gray-300">{currentPlaylist.songs.length} canciones</p>
              </div>
            </div>
          </div>

          {/* Lista de canciones */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-2">
              {currentPlaylist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-colors group ${
                    currentSong?.id === song.id ? "bg-white/20" : ""
                  }`}
                >
                  <div className="w-8 text-center">
                    {currentSong?.id === song.id && isPlaying ? (
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                        <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    ) : (
                      <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hidden group-hover:flex w-8 h-8 p-0"
                      onClick={() => playSong(song)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>

                  <img src={song.cover || "/placeholder.svg"} alt={song.album} className="w-12 h-12 rounded" />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-gray-300 truncate">{song.artist}</p>
                  </div>

                  <p className="text-sm text-gray-300 hidden md:block">{song.album}</p>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleLike(song.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className={`w-4 h-4 ${song.isLiked ? "fill-green-500 text-green-500" : ""}`} />
                    </Button>
                    <span className="text-sm text-gray-300 w-12 text-right">{song.duration}</span>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reproductor inferior */}
      <div className="h-24 bg-black/80 backdrop-blur-sm border-t border-white/10 px-4 flex items-center">
        {currentSong && (
          <>
            {/* Información de la canción actual */}
            <div className="flex items-center space-x-4 w-80">
              <img
                src={currentSong.cover || "/placeholder.svg"}
                alt={currentSong.album}
                className="w-14 h-14 rounded"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">{currentSong.title}</p>
                <p className="text-sm text-gray-300 truncate">{currentSong.artist}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toggleLike(currentSong.id)}>
                <Heart className={`w-4 h-4 ${currentSong.isLiked ? "fill-green-500 text-green-500" : ""}`} />
              </Button>
            </div>

            {/* Controles de reproducción */}
            <div className="flex-1 flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="ghost">
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  className="w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button size="sm" variant="ghost">
                  <SkipForward className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>

              {/* Barra de progreso */}
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className="text-xs text-gray-300">0:00</span>
                <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="flex-1" />
                <span className="text-xs text-gray-300">{currentSong.duration}</span>
              </div>
            </div>

            {/* Control de volumen */}
            <div className="flex items-center space-x-2 w-32">
              <Volume2 className="w-4 h-4" />
              <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
