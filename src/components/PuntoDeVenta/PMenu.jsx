import React, { } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Notifications } from '../Navbar/Notifications';
import FechaHora from './utils/FechaHora ';
import PuntoDeVentaMenu from './PuntoDeVentaMenu';



const PMenu = ({busqueda, setBusqueda}) => {

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
  <div>
    <nav className="navbar  navbar-main px-0 bg-white shadow-sm"
    style={{width:"100vp", boxSizing: "border-box", top: 0}}
    id="navbarBlur" navbar-scroll="true">
    <div className="container-fluid" >
    <nav 
  aria-label="breadcrumb" 
  className="d-none d-md-block"  
  style={{width: 200}}
>
  <FechaHora />
</nav>
      <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4 align-items-left" id="navbar" style={{minHeight: 50, display: "flex", justifyContent: "space-between", width: "80%"}}>
      <div className="ms-md-3 col-8 " style={{ width: "100%" }}>
  <input
    type="text"
    className="form-control w-100"
    placeholder="Buscar por nombre o código de barras"
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
</div>
        <ul className="navbar-nav  justify-content-end gap-2">
          <li className="nav-item  d-flex align-items-center text-nowrap pl-2 d-sm-inline d-none" >
            <Link  className="nav-link text-body font-weight-bold px-0 ">
              <i className="fa fa-user me-sm-1" />
              <span className="d-sm-inline d-none ">{user?.firstName}</span>
            </Link>
          </li>
      
          <li className="nav-item px-3 d-flex align-items-center">
            <Link onClick={()=>LogGoutConfirm()} className="nav-link text-body p-0">
          <i className="fas fa-window-close text-danger" />
          </Link>
          </li>

          <li className="nav-item dropdown pe-2 d-flex align-items-center">
            <PuntoDeVentaMenu/>
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
  </div>
  )
}

export default PMenu