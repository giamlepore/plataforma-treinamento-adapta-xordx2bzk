import { AlertCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LessonVideoPlayerProps {
  courseDescription?: string
  videoUrl?: string | null
  title?: string
}

export function LessonVideoPlayer({
  courseDescription,
  videoUrl,
  title,
}: LessonVideoPlayerProps) {
  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col">
      {/* Video Player Container - 16:9 Aspect Ratio */}
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative shadow-lg mb-8">
        {!videoUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Video not available</h3>
            <p className="text-gray-400 text-sm max-w-md">
              This lesson does not have a video assigned yet.
            </p>
          </div>
        ) : (
          <iframe
            src={videoUrl}
            className="w-full h-full absolute top-0 left-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title={title || 'Lesson Video'}
          />
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
