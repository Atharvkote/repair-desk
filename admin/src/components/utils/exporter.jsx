import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

/* ======================================================
   Helpers
====================================================== */

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const splitItems = (items = []) => {
  return {
    services: items.filter(i => i.itemType === "SERVICE"),
    parts: items.filter(i => i.itemType === "PART"),
  }
}

/* ======================================================
   SINGLE SERVICE RECEIPT (PDF)
====================================================== */

export const generateReceipt = (service) => {
  const doc = new jsPDF("p", "mm", "a4")
  const { services, parts } = splitItems(service.items)

  const PRIMARY = [15, 118, 110]
  const GRAY = [120, 120, 120]

  /* ---------- Background Card ---------- */
  doc.setFillColor(245, 247, 250)
  doc.rect(10, 10, 190, 277, "F")

  /* ---------- Header ---------- */
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.setTextColor(...PRIMARY)
  doc.text("Mate Tractor", 105, 25, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...GRAY)
  doc.text("Serving farmers with trust since 1991", 105, 32, { align: "center" })

  doc.text("+91 98765 43210 | support@matetractor.com", 105, 38, { align: "center" })
  doc.text("Pune, Maharashtra, India", 105, 44, { align: "center" })

  doc.setDrawColor(...PRIMARY)
  doc.line(20, 48, 190, 48)

  /* ---------- Title ---------- */
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0)
  doc.text("SERVICE RECEIPT", 105, 60, { align: "center" })

  /* ---------- Order Info Box ---------- */
  doc.setFillColor(255)
  doc.roundedRect(20, 68, 170, 30, 4, 4, "F")

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Order No: ${service.orderNumber || service._id}`, 25, 78)
  doc.text(`Order Date: ${formatDate(service.createdAt)}`, 25, 85)

  doc.text(`Customer: ${service.customerId?.name}`, 120, 78)
  doc.text(`Phone: ${service.customerId?.phone}`, 120, 85)
  doc.text(`Email: ${service.customerId?.email || "-"}`, 120, 92)

  /* ---------- Tractor ---------- */
  doc.setFont("helvetica", "bold")
  doc.text("Tractor Details", 20, 110)

  doc.setFont("helvetica", "normal")
  doc.text(`Brand: ${service.tractor?.name}`, 20, 118)
  doc.text(`Model: ${service.tractor?.model} `, 20, 124)

  /* ---------- Items Table ---------- */
  const tableRows = [
    ...services.map(s => [
      s.serviceId?.title || s.name,
      s.quantity,
      `Rs. ${s.unitPrice} /-`,
      `Rs. ${s.lineTotals?.final} /-`,
    ]),
    ...parts.map(p => [
      p.partId?.title,
      p.quantity,
      `Rs. ${p.unitPrice} /-`,
      `Rs. ${p.lineTotals?.final} /-`,
    ]),
  ]

  autoTable(doc, {
    startY: 135,
    head: [["Item", "Qty", "Rate", "Amount"]],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: PRIMARY,
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  })

  /* ---------- TOTAL BOX ---------- */
  const y = doc.lastAutoTable.finalY + 15

  doc.setFillColor(...PRIMARY)
  doc.roundedRect(110, y, 80, 18, 4, 4, "F")

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255)
  doc.text("TOTAL AMOUNT", 115, y + 11)
  doc.text(`Rs. ${service.totals?.final  || 0} /-`, 185, y + 11, { align: "right" })

  /* ---------- Footer ---------- */
  doc.setFontSize(9)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(100)
  doc.text(
    "Thank you for choosing Mate Tractor • This is a system-generated receipt",
    105,
    280,
    { align: "center" }
  )

  doc.save(`Receipt_${service.orderNumber || service._id}.pdf`)
}

/* ======================================================
   EXPORT TO EXCEL
====================================================== */

export const exportToExcel = (services = []) => {
  const data = services.map(service => ({
    "Order No": service.orderNumber || service._id,
    Customer: service.customerId?.name,
    Phone: service.customerId?.phone,
    Tractor: service.tractor?.name,
    Model: service.tractor?.model,
    "Order Date": formatDate(service.createdAt),
    "Completed Date": formatDate(service.completedAt),
    "Services Total": service.totals?.services || 0,
    "Parts Total": service.totals?.parts || 0,
    "Grand Total": service.totals?.final || 0,
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Service History")

  XLSX.writeFile(workbook, "Service_History.xlsx")
}

/* ======================================================
   EXPORT TO PDF (SUMMARY)
====================================================== */

export const exportToPDF = (services = []) => {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Service History Report", 105, 15, { align: "center" })

  autoTable(doc, {
    startY: 25,
    head: [["Order", "Customer", "Tractor", "Order Date", "Total"]],
    body: services.map(s => [
      s.orderNumber || s._id,
      s.customerId?.name,
      `${s.tractor?.name} ${s.tractor?.model}`,
      formatDate(s.createdAt),
      `Rs.${s.totals?.final || 0} /-`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
    },
  })

  doc.save("Service_History.pdf")
}
