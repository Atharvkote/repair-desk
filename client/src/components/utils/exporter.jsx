import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"


const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

const generateReceipt = (service) => {
    const doc = new jsPDF()

    /* =======================
       HEADER
    ======================= */
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.text("Mate Tractor", 20, 20)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Serving farmers with trust since 1991", 20, 27)

    doc.setFontSize(9)
    doc.text("Contact : +91 98765 43210", 140, 18)
    doc.text("Email : support@matetractor.com", 140, 24)
    doc.text("Address : 123 Main Street,Pune, Maharashtra, India", 140, 30)

    doc.setDrawColor(220)
    doc.line(20, 35, 190, 35)

    /* =======================
       TITLE
    ======================= */
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("SERVICE RECEIPT", 105, 45, { align: "center" })

    /* =======================
       ORDER INFO
    ======================= */
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    doc.text(`Order ID: ${service.id}`, 20, 60)
    doc.text(`Order Date: ${service.orderDate}`, 20, 66)
    doc.text(`Completion Date: ${service.completionDate}`, 20, 72)

    /* =======================
       CUSTOMER & TRACTOR INFO
    ======================= */
    doc.setFont("helvetica", "bold")
    doc.text("Customer Details", 20, 85)

    doc.setFont("helvetica", "normal")
    doc.text(`Name: ${service.customer.name}`, 20, 92)
    doc.text(`Phone: ${service.customer.phone}`, 20, 98)
    doc.text(`Email: ${service.customer.email}`, 20, 104)

    doc.setFont("helvetica", "bold")
    doc.text("Tractor Details", 120, 85)

    doc.setFont("helvetica", "normal")
    doc.text(`Tractor: ${service.tractor.name}`, 120, 92)
    doc.text(`Model: ${service.tractor.model}`, 120, 98)

    /* =======================
       ITEMS TABLE
    ======================= */
    const items = [
        ...service.services.map((s) => ({
            name: s.title,
            qty: s.quantity ?? 0,
            rate: s.price ?? 0,
        })),
        ...service.parts.map((p) => ({
            name: p.title,
            qty: p.quantity ?? 0,
            rate: p.price ?? 0,
        })),
    ]

    const tableBody = items.map((item) => [
        item.name,
        item.qty,
        `Rs. ${item.rate}`,
        `Rs. ${item.qty * item.rate}`,
    ])

    autoTable(doc, {
        startY: 115,
        head: [["Item Description", "Qty", "Rate", "Amount"]],
        body: tableBody,
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

    /* =======================
       ORDER SUMMARY
    ======================= */
    const subtotal =
        calculateTotal(service.services) + calculateTotal(service.parts)
    const discount = 0
    const grandTotal = subtotal - discount

    const summaryY = doc.lastAutoTable.finalY + 12

    doc.setFont("helvetica", "bold")
    doc.text("Order Summary", 120, summaryY)

    doc.setFont("helvetica", "normal")
    doc.text(`Subtotal:`, 120, summaryY + 8)
    doc.text(`Rs. ${subtotal}`, 190, summaryY + 8, { align: "right" })

    doc.text(`Discount:`, 120, summaryY + 14)
    doc.text(`Rs. ${discount}`, 190, summaryY + 14, { align: "right" })

    doc.setFont("helvetica", "bold")
    doc.text(`Grand Total:`, 120, summaryY + 22)
    doc.text(`Rs. ${grandTotal}`, 190, summaryY + 22, { align: "right" })

    /* =======================
       FOOTER
    ======================= */
    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(120)
    doc.text(
        "Thank you for choosing Mate Tractor. This is a system-generated receipt.",
        105,
        285,
        { align: "center" }
    )

    doc.save(`Service_Receipt_${service.id}.pdf`)
}

const exportToExcel = () => {
    const servicesToExport =
        selectedServices.length > 0
            ? mockCompletedServices.filter((s) => selectedServices.includes(s.id))
            : mockCompletedServices

    const data = servicesToExport.map((service) => ({
        "Order ID": service.id,
        "Order Date": service.orderDate,
        "Completion Date": service.completionDate,
        Customer: service.customer.name,
        Phone: service.customer.phone,
        Email: service.customer.email,
        Tractor: service.tractor.name,
        Model: service.tractor.model,
        Status: service.status,
        "Services Total": calculateTotal(service.services),
        "Parts Total": calculateTotal(service.parts),
        "Grand Total": calculateTotal(service.services) + calculateTotal(service.parts),
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service History")
    XLSX.writeFile(workbook, "Service_History.xlsx")
}

const exportToPDF = () => {
    const servicesToExport =
        selectedServices.length > 0
            ? mockCompletedServices.filter((s) => selectedServices.includes(s.id))
            : mockCompletedServices

    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Service History Report", 105, 20, { align: "center" })

    const tableData = servicesToExport.map((service) => [
        service.id,
        service.customer.name,
        service.tractor.name,
        service.completionDate,
        `Rs. ${calculateTotal(service.services) + calculateTotal(service.parts)}`,
    ])

    autoTable(doc, {
        startY: 35,
        head: [["Order ID", "Customer", "Tractor", "Completed", "Total"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [20, 184, 166], fontStyle: "bold" },
    })

    doc.save("Service_History.pdf")
}

export {
    generateReceipt,
    exportToExcel,
    exportToPDF
}