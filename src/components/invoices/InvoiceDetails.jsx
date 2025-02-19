import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Para obtener el ID de la factura desde la URL

const API_URL = `${import.meta.env.VITE_API_SERVER}/api/v1/invoiceRouter`;

const InvoiceDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la factura desde la URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setInvoice(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los detalles de la factura:", error);
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  if (loading) {
    return <div>Cargando detalles de la factura...</div>;
  }

  if (!invoice) {
    return <div>No se encontró la factura.</div>;
  }
console.log(invoice)
  return (
    <div className="card h-100">
      <div className="card-header pb-0 p-3">
        <h6 className="mb-0">Detalles de la Factura #{invoice.invoiceNumber}</h6>
      </div>
      <div className="card-body p-3">
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Fecha de Emisión:</strong>{" "}
              {new Date(invoice.issueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Método de Pago:</strong> {invoice.paymentMethod}
            </p>
            <p>
              <strong>Estado:</strong> {invoice.status}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Total:</strong> ${invoice.total}
            </p>
            <p>
              <strong>Usuario:</strong> {invoice.user?.firstName + " " + invoice.user?.lastName || "N/A"}
            </p>
            <p>
              <strong>Fecha de Pago:</strong>{" "}
              {invoice.paymentDate
                ? new Date(invoice.paymentDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h6>Detalles de los Ítems:</h6>
          <ul className="list-group">
            {invoice.invoiceDetails?.map((detail) => (
              <li key={detail.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <span>{detail.itemName}</span>
                  <span>${detail.totalPrice}</span>
                </div>
                <small className="text-muted">{detail.itemDescription}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;