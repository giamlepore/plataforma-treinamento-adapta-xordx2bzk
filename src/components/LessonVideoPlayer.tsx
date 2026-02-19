import { Play, AlertCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LessonVideoPlayerProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  imageQuery: string
  imageColor: string
  courseDescription?: string
  videoUrl?: string | null
  title?: string
}

export function LessonVideoPlayer({
  isPlaying,
  setIsPlaying,
  imageQuery,
  imageColor,
  courseDescription,
  videoUrl,
  title,
}: LessonVideoPlayerProps) {
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    try {
      // Append autoplay if not present to ensure video starts when overlay is clicked
      if (url.includes('autoplay=1')) return url
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}autoplay=1`
    } catch (e) {
      return url
    }
  }

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col">
      {/* Video Player Container - 16:9 Aspect Ratio */}
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative group shadow-lg mb-8">
        {!videoUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Video Unavailable</h3>
            <p className="text-gray-400 text-sm max-w-md">
              This lesson does not have a video assigned yet.
            </p>
          </div>
        ) : isPlaying ? (
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="w-full h-full absolute top-0 left-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title={title || 'Lesson Video'}
          />
        ) : (
          <>
            <img
              src={`https://img.usecurling.com/p/1200/675?q=${imageQuery || 'abstract'}&color=${imageColor?.replace('bg-', '') || 'orange'}`}
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-16 h-16 md:w-20 md:h-20 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform group-hover:scale-110"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
              </button>
            </div>
            {/* Fake Progress Bar - Only show when not playing (thumbnail mode) */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
              <div className="h-full w-[35%] bg-[#FF6B6B]" />
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="bg-transparent border-b border-gray-100 w-full justify-start h-auto p-0 rounded-none mb-6">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 mr-8 text-gray-500 data-[state=active]:text-gray-900 font-semibold text-sm"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-gray-500 data-[state=active]:text-gray-900 font-semibold text-sm"
          >
            Rating and review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-0">
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
            <p className="mb-4">{courseDescription}</p>
            <p>
              This immersive course is designed for aspiring developers,
              creative minds, and tech enthusiasts ready to unlock the full
              potential of the platform. You will learn to navigate the
              interface, create scalable components, and build a complete system
              from scratch.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-0">
          <div className="text-gray-500 text-sm">
            Reviews section content would appear here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
