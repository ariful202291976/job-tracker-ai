'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import EditJobDialog from './edit-job-dialog'
import DeleteJobDialog from './delete-job-dialog'

const statusColors = {
  WISHLIST: 'bg-gray-100 text-gray-800',
  APPLIED: 'bg-yellow-100 text-yellow-800',
  INTERVIEWING: 'bg-blue-100 text-blue-800',
  OFFER: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ACCEPTED: 'bg-purple-100 text-purple-800',
  WITHDRAWN: 'bg-gray-100 text-gray-800',
}

export default function ApplicationsTable({ applications }: { applications: any[] }) {
  const [editingJob, setEditingJob] = useState<any>(null)
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No applications yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Click "Add New Job" to start tracking your applications
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.company}</TableCell>
                <TableCell>{app.position}</TableCell>
                <TableCell>{app.location || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(app.appliedDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{app.source || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {app.jobUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(app.jobUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingJob(app)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingJobId(app.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {editingJob && (
        <EditJobDialog
          job={editingJob}
          open={!!editingJob}
          onOpenChange={(open) => !open && setEditingJob(null)}
        />
      )}

      {/* Delete Dialog */}
      {deletingJobId && (
        <DeleteJobDialog
          jobId={deletingJobId}
          open={!!deletingJobId}
          onOpenChange={(open) => !open && setDeletingJobId(null)}
        />
      )}
    </>
  )
}