import React from "react";
import { Link } from "react-router-dom"; // Para el botón de ver detalles

const InvoiceCard = ({ invoice }) => {
  // Formatear la fecha en español (Latinoamérica)
  const formattedDate = new Date(invoice.issueDate).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <li className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
      <div className="d-flex flex-column">
        <h6 className="mb-1 text-dark font-weight-bold text-sm">{formattedDate}</h6>
        <span className="text-xs">#{invoice.invoiceNumber.toString().padStart(4, '0')}</span>
        {invoice.debtor?.firstName && <span className="text-xs">{invoice.debtor.firstName}</span>}
        {invoice.debtor?.lastName && <span className="text-xs">{invoice.debtor.lastName}</span>}
        
        {invoice.debtor?.email && <span className="text-xs">{invoice.debtor.email}</span>}
        {invoice.debtor?.phone && <span className="text-xs">{invoice.debtor.phone}</span>}
      </div>
      <div className="d-flex align-items-center text-sm">
      
        <p className="text-xs p-3">
        Total: ${Number(invoice.total).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        {invoice.vendor.email && <span className="text-xs d-block"> Vendido por: {invoice.vendor.email}</span>}
        </p>
        <Link
          to={`/invoices/${invoice.id}`} // Ruta para ver detalles
          className="btn btn-dark"
        >
          <i className="fas fa-receipt" /> Examinar
        </Link>
    
      </div>
      
    </li>
  );
};

export default InvoiceCard;
