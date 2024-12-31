import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import type { Subreddit } from "@/types/reddit"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Calendar, Link2, Tag, FileText, Globe2, ImageIcon } from 'lucide-react'

interface SubredditViewProps {
  subreddit: Subreddit
  onBack: () => void
}

export function SubredditView({ subreddit, onBack }: SubredditViewProps) {
  const [bannerError, setBannerError] = useState(false)
  const [iconError, setIconError] = useState(false)

  const formatDate = (dateString: string): string => {
    try {
      const [datePart, timePart] = dateString.split(' ');
      if (!datePart) return 'Invalid Date';
      const [day, month, year] = datePart.split('-').map(Number);
      if (!day || !month || !year) return 'Invalid Date';
      const [hours, minutes, seconds] = timePart
        ? timePart.split(':').map(Number)
        : [0, 0, 0];
      const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
      const formattedDate = utcDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = utcDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Button>

      {subreddit.banner_background_image && subreddit.banner_background_image !== "N/A" && !bannerError && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
          <img
            src={decodeURIComponent(subreddit.banner_background_image)}
            alt={`${subreddit.name} banner`}
            className="w-full h-full object-cover"
            onError={() => setBannerError(true)}
          />
        </div>
      )}

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-4 items-start">
            {subreddit.icon_img && subreddit.icon_img !== "N/A" && !iconError ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                <img
                  src={subreddit.icon_img}
                  alt={`${subreddit.name} icon`}
                  className="w-full h-full object-cover"
                  onError={() => setIconError(true)}
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-800">{subreddit.name}</h1>
                  <p className="text-gray-600 mt-2">{subreddit.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="bg-gray-800 text-white hover:bg-gray-900 transition duration-150 ease-in-out"
                    onClick={() => window.open(subreddit.url, '_blank')}
                  >
                    Join Subreddit
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{subreddit.subscribers.toLocaleString()} subscribers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(subreddit.created)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe2 className="h-4 w-4" />
                    <span>Type: {subreddit.subreddit_type}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {subreddit.advertiser_category !== "N/A" && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="h-4 w-4" />
                      <span>Category: {subreddit.advertiser_category}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Link2 className="h-4 w-4" />
                    <a 
                      href={subreddit.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {subreddit.url}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {subreddit.submit_text !== "N/A" && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Submission Guidelines</h2>
            </div>
            <div className="text-gray-600 whitespace-pre-wrap">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-800">{children}</strong>
                  ),
                }}
              >
                {subreddit.submit_text}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
)}
    </div>
  )
}

