'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import Link from 'next/link'

interface Thread {
  title: string
  author: string
  subreddit: string
  upvotes: number
  comments: number
  postUrl: string
}

interface ThreadTableProps {
  threads: Thread[]
}

const ThreadTable: React.FC<ThreadTableProps> = ({ threads }) => {
  return (
    <div>
      <h2>Threads</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Subreddit</TableHead>
            <TableHead>Upvotes</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {threads.map((thread) => (
            <TableRow key={thread.title}>
              <TableCell>
                <Link href={thread.postUrl} target="_blank">
                  {thread.title}
                </Link>
              </TableCell>
              <TableCell url='https://www.reddit.com/{thread.author}'>{thread.author}</TableCell>
              <TableCell>{thread.subreddit}</TableCell>
              <TableCell>{thread.upvotes}</TableCell>
              <TableCell>{thread.comments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ThreadTable
