import React, { useEffect, useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";


import Aside from "../aside";
import Navbar from "../Navbar";
import { useMenu } from "../../utils/MenuContext";
import getConfig from "../../utils/getConfig";
import InvoiceList from "./InvoiceList";

const InvoiceLayout = () => {
  const { isPinned } = useMenu();
  
  return (
    <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>
      <Aside />
      <Navbar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
        <div className="container-fluid py-4">

        <div className="row">
        
        <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
          <InvoiceList/>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceLayout;
