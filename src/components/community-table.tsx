'use client'

import { RedirectButton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface Community {
    id: string
    name: string
    description: string
    subscribers: number
    created: string
    url: string
}

interface CommunityTableProps {
    communities: Community[]
}

const CommunityTable: React.FC<CommunityTableProps> = ({ communities }) => {
    return (
        <div>
            <h2>Communities</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Subscribers</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Join</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {communities.map((community) => (
                        <TableRow key={community.id}>
                            <TableCell>{community.name}</TableCell>
                            <TableCell>{community.description}</TableCell>
                            <TableCell>{community.subscribers}</TableCell>
                            <TableCell>{community.created}</TableCell>
                            <TableCell className="text-center">
                                <RedirectButton url={community.url}>Join</RedirectButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CommunityTable
