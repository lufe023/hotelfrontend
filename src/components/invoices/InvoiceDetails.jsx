import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Para obtener el ID de la factura desde la URL
import Aside from "../aside";
import Navbar from "../Navbar";
import { useMenu } from "../../utils/MenuContext";

const API_URL = `${import.meta.env.VITE_API_SERVER}/api/v1/invoice`;

const InvoiceDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la factura desde la URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

    const { isPinned } = useMenu();

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

  return (

    <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>
    <Aside />
    <Navbar />
    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
      <div className="container-fluid py-4">

      <div className="row">
      
      <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
    <div className="card h-100">
      <div className="card-body p-2">
  
    <div className="col-12">
      
    <div className="list-group-item border-0  p-4 mb-2 bg-gray-100 border-radius-lg shadow">
  
    <div className="row mb-3">

      <div className="col-md-6">
        <h6 className="mb-3 text-sm">  Recibo# {invoice.invoiceNumber.toString().padStart(4, '0')}</h6>
      </div>

      <div className="col-md-6">
        <div className=" text-end">
        <a className="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;"><i className="far fa-trash-alt me-2" />Anular</a>
        <a className="btn btn-link text-dark px-3 mb-0" href="javascript:;"><i className="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />Editar</a>
      </div>
    </div>

  </div>

    <div className="row d-flex">
        <div className="col-md-6">
        <div className="d-flex flex-column">
          
          {invoice.debtor?.firstName && invoice.debtor?.lastName  && <span className="mb-2 text-xs">Servido a: <span className="text-dark font-weight-bold ms-sm-2">{invoice.debtor?.firstName + " " + invoice.debtor?.lastName || "N/A"}</span></span>}
          <span className="mb-2 text-xs">Metodo de pago: <span className="text-dark ms-sm-2 font-weight-bold"> {invoice.paymentMethod}</span></span>
          <span className="mb-2 text-xs">Emitido: <span className="text-dark ms-sm-2 font-weight-bold">{new Date(invoice.issueDate).toLocaleDateString()}</span></span>

          {invoice.debtor?.phone &&(<span className="mb-2 text-xs">Telefono: <span className="text-dark ms-sm-2 font-weight-bold">{invoice.debtor.phone}</span></span> )}

          {invoice.debtor?.email &&(<span className="mb-2 text-xs">Correo: <span className="text-dark ms-sm-2 font-weight-bold">{invoice.debtor.email}</span></span> )}
        </div>
      </div>

      <div className="col-md-6">
      <div className="d-flex flex-column">
          <span className="mb-2 text-xs">Total: <span className="text-dark font-weight-bold ms-sm-2">${Number(invoice.total).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
          <span className="mb-2 text-xs">Despachado por: <span className="text-dark ms-sm-2 font-weight-bold"> {invoice.vendor.email}</span></span>
          <span className="text-xs">Ruta: <span className="text-dark ms-sm-2 font-weight-bold">Servido</span></span>
        </div>
      </div>

      </div>

  </div>


  <ul className="list-group p-1">
  {invoice.invoice_details?.map((detail) => (
    <div  key={detail.id}>
    <li className="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg">
      <div className="d-flex flex-column">
        <h6 className="mb-1 text-dark font-weight-bold text-sm"> {detail.quantity} {detail.itemName}</h6>
        <span className="text-xs">${Number(detail.unitPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
      </div>
      <div className="d-flex align-items-center text-sm">
      ${Number(detail.totalPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
     
    </li>
     <hr className="horizontal dark mt-0"/>
     </div>
  ))}
  </ul>
  </div>
        </div>
 
      </div>

    </div>
    </div>
    </div>
    </main>
    </div>
  );
};

export default InvoiceDetails;