"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, ExternalLink, Search, Briefcase } from "lucide-react";
import EditJobDialog from "./edit-job-dialog";
import DeleteJobDialog from "./delete-job-dialog";

const statusColors = {
  WISHLIST: "bg-gray-100 text-gray-800",
  APPLIED: "bg-yellow-100 text-yellow-800",
  INTERVIEWING: "bg-blue-100 text-blue-800",
  OFFER: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  ACCEPTED: "bg-purple-100 text-purple-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
};

export default function ApplicationsTable({
  applications,
}: {
  applications: any[];
}) {
  const [editingJob, setEditingJob] = useState<any>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "company">("date");

  // Filter and search logic
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.location?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Sort
    if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime(),
      );
    } else {
      filtered.sort((a, b) => a.company.localeCompare(b.company));
    }

    return filtered;
  }, [applications, searchQuery, statusFilter, sortBy]);

  if (applications.length === 0) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
        <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No applications yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Start tracking your job search journey by adding your first application.
        Use the AI tools to optimize your resume and cover letter!
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={() => window.location.href = '/dashboard/ai-tools'} variant="outline">
          Try AI Tools
        </Button>
      </div>
    </div>
  )
}

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by company, position, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="WISHLIST">Wishlist</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value: "date" | "company") => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="company">Company (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredApplications.length} of {applications.length}{" "}
        applications
      </div>

      {/* Table */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">No applications match your search</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters
          </p>
        </div>
      ) : (
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
                <TableHead>Resume</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.company}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell>{app.location || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusColors[app.status as keyof typeof statusColors]
                      }
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(app.appliedDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{app.source || "N/A"}</TableCell>
                  <TableCell>
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2">
                      {app.jobUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(app.jobUrl, "_blank")}
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
      )}

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
  );
}
