import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Subreddit, Thread } from "@/types/reddit"
import { MessageSquare, ArrowBigUp, ExternalLink } from 'lucide-react'

interface SearchResultsProps {
  results: (Subreddit | Thread)[]
  onViewPosts: (subreddit: Subreddit) => void
  viewMode: 'communities' | 'threads'
}

export function SearchResults({ results, onViewPosts, viewMode }: SearchResultsProps) {
  const formatDate = (dateString: string) => {
    try {
      // Handle the specific date format "DD-MM-YYYY HH:MM:SS"
      const [datePart, timePart] = dateString.split(' ');
      if (!datePart) return 'Invalid Date';

      const [day, month, year] = datePart.split('-');
      if (!day || !month || !year) return 'Invalid Date';

      const date = new Date(`${year}-${month}-${day}${timePart ? ' ' + timePart : ''}`);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return `Invalid Date ${error}`;
    }
  };

  if (results.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6 text-center text-gray-500">
          No {viewMode} found for the given search criteria.
        </CardContent>
      </Card>
    )
  }

  if (viewMode === 'communities') {
    return (
      <div className="space-y-4">
        {(results as Subreddit[]).map((subreddit) => (
          <Card key={subreddit.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="space-y-2 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-800 break-words">{subreddit.name}</h2>
                  <p className="text-sm text-gray-600 break-words">{subreddit.description}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs text-gray-500">
                    <span>{subreddit.subscribers.toLocaleString()} subscribers</span>
                    <span>Created: {formatDate(subreddit.created)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewPosts(subreddit)}
                    className="text-gray-800 border-gray-800 hover:bg-gray-100"
                  >
                    View Posts
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gray-800 text-white hover:bg-gray-900"
                    onClick={() => window.open(subreddit.url, '_blank')}
                  >
                    Visit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } else {
    return (
      <div className="space-y-4">
        {(results as Thread[]).map((thread) => (
          <Card key={thread.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="space-y-2 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-800 break-words">{thread.title}</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-500">
                    <span className="truncate">Posted by <a href={`https://www.reddit.com/u/${thread.author}`} target="_blank" rel="noopener noreferrer" className="hover:underline"> u/{thread.author}</a></span>
                    <span className="truncate">in <a href={`https://www.reddit.com/r/${thread.subreddit}`} target="_blank" rel="noopener noreferrer" className="hover:underline">r/{thread.subreddit}</a></span>
                    <span className="flex items-center gap-1">
                      <ArrowBigUp className="h-4 w-4" />
                      {thread.upvotes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {thread.comments.toLocaleString()}
                    </span>
                  </div>
                  {thread.flair && (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {thread.flair}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-gray-800 border-gray-800 hover:bg-gray-100 shrink-0"
                  onClick={() => window.open(thread.postUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Reddit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}

