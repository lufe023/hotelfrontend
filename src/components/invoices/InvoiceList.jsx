import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import InvoiceCard from "./InvoiceCard";
import Spinner from "../spinner/Spinner";

const InvoiceList = () => {
  const today = new Date().toISOString().split("T")[0];
  const [searchParams, setSearchParams] = useSearchParams();


  const initialStartDate = searchParams.get("startDate") || today;
  const initialEndDate = searchParams.get("endDate") || today;

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_SERVER}/api/v1/invoice`;

  useEffect(() => {
    // Actualiza la URL cuando los valores cambian
    setSearchParams({ startDate, endDate });

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL, { params: { startDate, endDate } });
        setInvoices(response.data);
      } catch (error) {
        console.error("Error al obtener facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [startDate, endDate, setSearchParams]);

  const setDateRange = (type) => {
    const now = new Date();
    let newStartDate, newEndDate;

    switch (type) {
      case "yesterday":
        now.setDate(now.getDate() - 1);
        newStartDate = newEndDate = now.toISOString().split("T")[0];
        break;
      case "last3Days":
        newEndDate = today;
        newStartDate = new Date(now.setDate(now.getDate() - 2)).toISOString().split("T")[0];
        break;
      case "lastWeek":
        newStartDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split("T")[0];
        newEndDate = today;
        break;
      case "lastMonth":
        now.setMonth(now.getMonth() - 1);
        newStartDate = new Date(now).toISOString().split("T")[0];
        newEndDate = today;
        break;
      case "today":
        newStartDate = newEndDate = today;
        break;
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setActiveRange(type);
  };

  return (
    <div className="card h-100">
      <div className="card-header pb-0 p-3">
        <div className="row">
          <div className="col-6 d-flex align-items-center">
            <h6 className="mb-0">Cuentas: {invoices.length}</h6>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">Desde</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-6 text-end">
            <label className="form-label">Hasta</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3 gap-2 d-flex">
          <button
            className={`btn btn-sm me-2 ${activeRange === "yesterday" ? "bg-dark" : "btn-primary"}`}
            onClick={() => setDateRange("yesterday")}
          >
            Ayer
          </button>
          <button
            className={`btn btn-sm me-2 ${activeRange === "last3Days" ? "bg-dark" : "btn-secondary"}`}
            onClick={() => setDateRange("last3Days")}
          >
            Últimos 3 días
          </button>
          <button
            className={`btn btn-sm me-2 ${activeRange === "lastWeek" ? "bg-dark" : "btn-success"}`}
            onClick={() => setDateRange("lastWeek")}
          >
            Última semana
          </button>
          <button
            className={`btn btn-sm ${activeRange === "lastMonth" ? "bg-dark" : "btn-warning"}`}
            onClick={() => setDateRange("lastMonth")}
          >
            Un mes
          </button>
          <button
            className={`btn btn-sm ${activeRange === "today" ? "bg-dark" : "btn-info"}`}
            onClick={() => setDateRange("today")}
          >
            Hoy
          </button>
        </div>
      </div>

      <div className="card-body p-3 pb-0">
        {loading && (
          <div
            className="row"
            style={{
              justifyContent: "center",
              paddingTop: 100,
              position: "absolute",
              zIndex: 1000,
              height: "80vh",
              width: "99%",
              backdropFilter: "blur(1px)",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "0.5rem",
            }}
          >
            <Spinner />
          </div>
        )}
        {invoices.length === 0 && !loading ? (
          <p className="text-muted">No hay facturas en este rango de fechas.</p>
        ) : (
          <ul className="list-group">
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
