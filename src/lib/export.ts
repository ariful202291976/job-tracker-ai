import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export interface Application {
  id: string
  company: string
  position: string
  location: string | null
  status: string
  appliedDate: Date | string
  source: string | null
  salary: string | null
  notes: string | null
}

export const exportToPDF = (applications: Application[], userName?: string) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.text('Job Applications Report', 14, 22)

  // Add metadata
  doc.setFontSize(10)
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 32)
  if (userName) {
    doc.text(`User: ${userName}`, 14, 38)
  }
  doc.text(`Total Applications: ${applications.length}`, 14, 44)

  // Prepare table data
  const tableData = applications.map(app => [
    app.company,
    app.position,
    app.location || 'N/A',
    app.status,
    format(new Date(app.appliedDate), 'MMM dd, yyyy'),
    app.source || 'N/A',
    app.salary || 'N/A',
  ])

  // Add table
  autoTable(doc, {
    head: [['Company', 'Position', 'Location', 'Status', 'Applied', 'Source', 'Salary']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }, // Blue header
  })

  // Save PDF
  doc.save(`job-applications-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

export const exportToExcel = (applications: Application[]) => {
  // Prepare data
  const excelData = applications.map(app => ({
    Company: app.company,
    Position: app.position,
    Location: app.location || 'N/A',
    Status: app.status,
    'Applied Date': format(new Date(app.appliedDate), 'MMM dd, yyyy'),
    Source: app.source || 'N/A',
    Salary: app.salary || 'N/A',
    Notes: app.notes || '',
  }))

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData)

  // Set column widths
  const colWidths = [
    { wch: 20 }, // Company
    { wch: 25 }, // Position
    { wch: 20 }, // Location
    { wch: 15 }, // Status
    { wch: 15 }, // Applied Date
    { wch: 15 }, // Source
    { wch: 15 }, // Salary
    { wch: 40 }, // Notes
  ]
  ws['!cols'] = colWidths

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Applications')

  // Save file
  XLSX.writeFile(wb, `job-applications-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
}