'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import Link from 'next/link'

// Placeholder data
const results = [
  {
    id: 'AskReddit',
    name: 'AskReddit',
    description: 'Ask and answer questions from Reddit!',
    subscribers: 35000000,
    created: '2008-01-25',
  },
  {
    id: 'funny',
    name: 'funny',
    description: 'Reddit\'s largest humour depository',
    subscribers: 40000000,
    created: '2008-01-25',
  },
]

export default function ResultsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subreddit</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Subscribers</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>View Posts</TableHead>
          <TableHead>Join</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.id}>
            <TableCell>{result.name}</TableCell>
            <TableCell>{result.description}</TableCell>
            <TableCell>{result.subscribers.toLocaleString()}</TableCell>
            <TableCell>{new Date(result.created).toLocaleDateString()}</TableCell>
            <TableCell>
              <Link href={`/subreddit/${result.id}`}>
                <Button variant="outline">View Posts</Button>
              </Link>
            </TableCell>
            <TableCell>
              <Button>Join</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

