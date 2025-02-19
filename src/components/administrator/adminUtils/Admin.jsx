import React, { useEffect, useState } from "react";
import axios from "axios";
import AreasManager from "./AreasManager";
import Aside from "../../aside";
import Navbar from "../../Navbar";
import { useMenu } from "../../../utils/MenuContext";
import Swal from "sweetalert2";
import SistemConfiguration from "./SistemConfiguration";
import CreateRoom from "./CreateRoom";
import CreateMultipleRooms from "./CreateMultipleRooms";
import getConfig from "../../../utils/getConfig";
import InvoiceList from "../../invoices/InvoiceList";

const Admin = () => {
  const { isPinned } = useMenu();
  const [areas, setAreas] = useState([]); // Lista de áreas
  const fetchAreas = () => {
    axios
  .get(`${import.meta.env.VITE_API_SERVER}/api/v1/areas`, getConfig())
  .then((response) => {
    setAreas(response.data);
  })
  .catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Error al cargar áreas",
      text: error.response?.data?.message || "No se pudieron cargar las áreas",
    });
  });
  };
  return (
    <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>
      <Aside />
      <Navbar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
        <div className="container-fluid py-4">

        
         <div className="row">
        
         <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
          <CreateMultipleRooms areas={areas}/>
            </div>
            <div className="col-lg-4 col-md-6 mb-md-0 mb-4">
            <CreateRoom areas={areas}/>
            <AreasManager fetchAreas={fetchAreas} areas={areas} />
            </div>
         </div>
          <div className="row">
      
            <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
              <SistemConfiguration/>
            </div>
            <div className="col-lg-4 col-md-6 mb-md-0 mb-4">
             <h5>Vacio</h5>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
