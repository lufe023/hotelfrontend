import React from "react";
import { Link } from "react-router-dom"; // Para el botón de ver detalles

const InvoiceCard = ({ invoice }) => {
  return (
    <li className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
      <div className="d-flex flex-column">
        <h6 className="mb-1 text-dark font-weight-bold text-sm">
          {new Date(invoice.issueDate).toLocaleDateString()}
        </h6>
        <span className="text-xs">#{invoice.invoiceNumber}</span>
        <span className="text-xs">{invoice.user.firstName + " "+invoice.user.lastName}</span>
        {invoice.user.email &&(<span className="text-xs">{invoice.user.email}</span> )}
        {invoice.user.phone &&(<span className="text-xs">{invoice.user.phone}</span> ) }
      </div>
      <div className="d-flex align-items-center text-sm">
        ${invoice.total}
        <Link
          to={`/invoices/${invoice.id}`} // Ruta para ver detalles
          className="btn btn-link text-dark text-sm mb-0 px-0 ms-4"
        >
          <i className="fas fa-file-pdf text-lg me-1"></i> PDF
        </Link>
      </div>
    </li>
  );
};

export default InvoiceCard;