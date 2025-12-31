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
  const doc = new jsPDF()
  const { services, parts } = splitItems(service.items)

  /* ---------- Header ---------- */
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.text("Mate Tractor", 20, 20)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Serving farmers with trust since 1991", 20, 27)

  doc.text("Contact: +91 98765 43210", 140, 18)
  doc.text("Email: support@matetractor.com", 140, 24)
  doc.text("Pune, Maharashtra, India", 140, 30)

  doc.line(20, 35, 190, 35)

  /* ---------- Title ---------- */
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("SERVICE RECEIPT", 105, 45, { align: "center" })

  /* ---------- Order Info ---------- */
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Order No: ${service.orderNumber || service._id}`, 20, 60)
  doc.text(`Order Date: ${formatDate(service.createdAt)}`, 20, 66)
  doc.text(`Completed: ${formatDate(service.completedAt)}`, 20, 72)

  /* ---------- Customer ---------- */
  doc.setFont("helvetica", "bold")
  doc.text("Customer Details", 20, 85)

  doc.setFont("helvetica", "normal")
  doc.text(`Name: ${service.customerId?.name}`, 20, 92)
  doc.text(`Phone: ${service.customerId?.phone}`, 20, 98)
  doc.text(`Email: ${service.customerId?.email || "-"}`, 20, 104)

  /* ---------- Tractor ---------- */
  doc.setFont("helvetica", "bold")
  doc.text("Tractor Details", 120, 85)

  doc.setFont("helvetica", "normal")
  doc.text(`Brand: ${service.tractor?.name}`, 120, 92)
  doc.text(`Model: ${service.tractor?.model}`, 120, 98)

  /* ---------- Items Table ---------- */
  const tableRows = [
    ...services.map(s => [
      s.serviceId?.title || s.name,
      s.quantity,
      `Rs.${s.unitPrice} /-`,
      `Rs.${s.lineTotals?.final} /-`,
    ]),
    ...parts.map(p => [
      p.partId?.title,
      p.quantity,
      `Rs.${p.unitPrice} /-`,
      `Rs.${p.lineTotals?.final} /-`,
    ]),
  ]

  autoTable(doc, {
    startY: 115,
    head: [["Item", "Qty", "Rate", "Amount"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  })

  /* ---------- Totals ---------- */
  const y = doc.lastAutoTable.finalY + 10

  doc.setFont("helvetica", "bold")
  doc.text("Total Amount", 120, y)
  doc.text(`Rs.${service.totals?.final || 0} /-`, 190, y, { align: "right" })

  /* ---------- Footer ---------- */
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(120)
  doc.text(
    "Thank you for choosing Mate Tractor. This is a system-generated receipt.",
    105,
    285,
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
    head: [["Order", "Customer", "Tractor", "Completed", "Total"]],
    body: services.map(s => [
      s.orderNumber || s._id,
      s.customerId?.name,
      `${s.tractor?.name} ${s.tractor?.model}`,
      formatDate(s.completedAt),
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
