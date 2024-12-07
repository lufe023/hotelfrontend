import React, { useEffect, useState } from 'react'
import { useMenu } from '../../utils/MenuContext'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Notifications } from './Notifications';



const Navbar = () => {
  const { toggleMenu } = useMenu();
  const navigate = useNavigate();
  const user = useSelector(state => state.userSlice);


  const LogGoutConfirm = ()=>{
    Swal.fire({
        title: "¿Está seguro que quiere cerrar la sesión?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Si, quiero salir",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Adios!", "", "success");
          navigate('/logout');
        } else if (result.isDenied) {
          Swal.fire("Bien! Permanecerás en el sistema", "", "info");
        }
      });
    }


  return (
 // <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
    <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky" id="navbarBlur" navbar-scroll="true">
    <div className="container-fluid py-1 px-3">
      <nav aria-label="breadcrumb">
      </nav>
      <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
        <div className="ms-md-auto pe-md-3 d-flex align-items-center">

        </div>
        <ul className="navbar-nav  justify-content-end">

          <li className="nav-item d-flex align-items-center">
            <Link  className="nav-link text-body font-weight-bold px-0">
              <i className="fa fa-user me-sm-1" />
              <span className="d-sm-inline d-none">{user?.firstName}</span>
            </Link>
          </li>
          <li className="nav-item d-xl-none ps-3 d-flex align-items-center" style={{cursor:'pointer'}}>
            <a  className="nav-link text-body p-0" onClick={toggleMenu}>
              <div className="sidenav-toggler-inner">
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
              </div>
            </a>
          </li>
          <li className="nav-item px-3 d-flex align-items-center">
            <Link onClick={()=>LogGoutConfirm()} className="nav-link text-body p-0">
          <i className="fas fa-window-close text-danger" />
          </Link>
          </li>

          <li className="nav-item px-3 d-flex align-items-center">
            <a  className="nav-link text-body p-0">
              <i className="fa fa-cog fixed-plugin-button-nav cursor-pointer" />
            </a>
          </li>
          
          {user && (
            <li className="nav-item dropdown pe-2 d-flex align-items-center">
    <Notifications user={user}/>
    </li>
          )}
      
      
           {/* Si hay una solicitud de soporte, mostrar el botón para responder */}
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default Navbar