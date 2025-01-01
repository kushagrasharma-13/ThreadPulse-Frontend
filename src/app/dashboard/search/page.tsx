'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SearchResults } from "@/components/search-results"
import { SubredditView } from "@/components/subreddit-view"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Subreddit, Thread } from "@/types/reddit"
import Link from 'next/link'
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function SearchPage() {
  const [keywords, setKeywords] = useState('')
  const [subredditIds, setSubredditIds] = useState('')
  const [strictMode, setStrictMode] = useState(false)
  const [searchResults, setSearchResults] = useState<{ communities: Subreddit[], threads: Thread[] }>({ communities: [], threads: [] })
  const [selectedSubreddit, setSelectedSubreddit] = useState<Subreddit | null>(null)
  const [viewMode, setViewMode] = useState<'communities' | 'threads'>('communities')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    setIsLoggedIn(!!accessToken)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSearchResults({ communities: [], threads: [] })
    setIsLoading(true)

    if (!keywords) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${backendUrl}/search/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "keywords": keywords, "subredditIds": subredditIds, "strictMode": strictMode }),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data = (await response.json())
      if (data.success) {
        const { communities, threads } = data.data
        const communityResults = communities.map((community: Subreddit) => ({
          id: community.name,
          name: community.name,
          description: community.description,
          subscribers: community.subscribers,
          created: community.created,
          url: community.url,
          icon_img: community.icon_img,
          advertiser_category: community.advertiser_category,
          submit_text: community.submit_text,
          subreddit_type: community.subreddit_type,
          banner_background_image: community.banner_background_image
        }))

        const threadResults = threads.map((thread: Thread) => ({
          id: thread.postUrl,
          title: thread.title,
          author: thread.author,
          subreddit: thread.subreddit,
          upvotes: thread.upvotes,
          comments: thread.comments,
          flair: thread.flair,
          postUrl: thread.postUrl,
        }))

        setSearchResults({
          communities: communityResults,
          threads: threadResults,
        })
      } else {
        throw new Error('Search failed: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error during search request:', error)
      setError('An error occurred while fetching results')
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedSubreddit) {
    return (
      <SubredditView
        subreddit={selectedSubreddit}
        onBack={() => setSelectedSubreddit(null)}
      />
    )
  }

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Reddit Search</h1>
        {!isLoggedIn && (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
      <Card className="bg-white shadow-sm">
        <CardContent className='p-6'>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">Keywords</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords (e.g., 'technology AI')"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="strict-mode"
                  checked={strictMode}
                  onCheckedChange={setStrictMode}
                />
                <Label htmlFor="strict-mode" className="text-sm text-gray-600">
                  Strict Mode (require all keywords)
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subredditIds" className="text-sm font-medium text-gray-700">Subreddit IDs (optional)</Label>
                <Input
                  id="subredditIds"
                  value={subredditIds}
                  onChange={(e) => setSubredditIds(e.target.value)}
                  placeholder="Enter subreddit IDs (e.g., 'AskReddit, funny')"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-800 text-white hover:bg-gray-900 transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          {error && (
            <div className="mt-4 text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>

      {(searchResults.communities.length > 0 || searchResults.threads.length > 0) && (
        <div className="mt-8">
          {subredditIds ? (
            <Tabs value="threads" className="mb-4">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="threads">Threads</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : (
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'communities' | 'threads')} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="communities">Communities</TabsTrigger>
                <TabsTrigger value="threads">Threads</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <SearchResults
            results={subredditIds ? searchResults.threads : (viewMode === 'communities' ? searchResults.communities : searchResults.threads)}
            onViewPosts={(subreddit) => setSelectedSubreddit(subreddit)}
            viewMode={subredditIds ? 'threads' : viewMode}
          />
        </div>
      )}
    </div>
  )
}

