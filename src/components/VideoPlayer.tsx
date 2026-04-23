import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface VideoPlayerProps {
  videoUrl?: string | null
  title?: string
  className?: string
}

export function VideoPlayer({ videoUrl, title, className }: VideoPlayerProps) {
  const getVimeoId = (url: string) => {
    if (!url) return null
    // Matches https://vimeo.com/123456 and https://player.vimeo.com/video/123456
    const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const getYoutubeId = (url: string) => {
    if (!url) return null
    // Matches various YouTube URL formats
    const regExp =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const vimeoId = videoUrl ? getVimeoId(videoUrl) : null
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null

  return (
    <div
      className={cn(
        'w-full rounded-xl overflow-hidden shadow-lg bg-black border border-white/10',
        className,
      )}
    >
      <AspectRatio ratio={16 / 9}>
        {vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            allowFullScreen
            title={title || 'Vimeo Video'}
          />
        ) : youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || 'YouTube Video'}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400">
            Vídeo indisponível
          </div>
        )}
      </AspectRatio>
    </div>
  )
}
