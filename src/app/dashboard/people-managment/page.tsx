'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PeopleManagementPage() {
  const [leads, setLeads] = useState([
    { id: 1, name: 'John Doe', redditUsername: 'john_reddit' },
    { id: 2, name: 'Jane Smith', redditUsername: 'jane_reddit' },
  ])
  const [newLead, setNewLead] = useState({ name: '', redditUsername: '' })

  const addLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (newLead.name && newLead.redditUsername) {
      setLeads([...leads, { ...newLead, id: leads.length + 1 }])
      setNewLead({ name: '', redditUsername: '' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">People Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Leads</CardTitle>
          <CardDescription>Add and view leads saved from Reddit</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addLead} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redditUsername">Reddit Username</Label>
                <Input
                  id="redditUsername"
                  value={newLead.redditUsername}
                  onChange={(e) => setNewLead({ ...newLead, redditUsername: e.target.value })}
                  placeholder="Enter Reddit username"
                />
              </div>
            </div>
            <Button type="submit">Add Lead</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Saved Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {leads.map((lead) => (
              <li key={lead.id} className="flex justify-between items-center border-b py-2">
                <span>{lead.name}</span>
                <span className="text-gray-500">{lead.redditUsername}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

