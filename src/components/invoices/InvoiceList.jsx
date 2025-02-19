import React, { useEffect, useState } from "react";
import axios from "axios";
import InvoiceCard from "./InvoiceCard"; // Importamos el componente InvoiceCard

const API_URL = `${import.meta.env.VITE_API_SERVER}/api/v1/invoiceRouter`;

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(API_URL);
        setInvoices(response.data);
      } catch (error) {
        console.error("Error al cargar las facturas:", error);
      }
    };

    fetchInvoices();
  }, []);
console.log(invoices)
  return (
    <div className="card h-100">
      <div className="card-header pb-0 p-3">
        <div className="row">
          <div className="col-6 d-flex align-items-center">
            <h6 className="mb-0">Invoices</h6>
          </div>
          <div className="col-6 text-end">
            <button className="btn btn-outline-primary btn-sm mb-0">View All</button>
          </div>
        </div>
      </div>
      <div className="card-body p-3 pb-0">
        <ul className="list-group">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvoiceList;