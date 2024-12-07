import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// show
const NavbarNoProtected = () => {
    const [open, setOpen] = useState(null)
  return (
    <nav className="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4 ">
    <div className="container-fluid pe-0">
      <Link to={'/'} className="navbar-brand font-weight-bolder ms-lg-0 ms-3 ">
      Nombre del Proyecto 
      </Link>
      <button onClick={()=>setOpen(!open)} className="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded={open?"true":"false"} aria-label="Toggle navigation">
        <span className="navbar-toggler-icon mt-2">
          <span className="navbar-toggler-bar bar1" />
          <span className="navbar-toggler-bar bar2" />
          <span className="navbar-toggler-bar bar3" />
        </span>
      </button>
      <div className={`collapse navbar-collapse ${open?'show ':''}`} id="navigation">
        <ul className="navbar-nav mx-auto ms-xl-auto me-xl-7">
          <li className="nav-item hoverB">
            <Link to={'/dashboard'} className="nav-link d-flex align-items-center me-2 active" aria-current="page">
              <i className="fa fa-chart-pie opacity-6 text-dark me-1" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item hoverB">
          <Link to={'/profile'}  className="nav-link me-2" href="../pages/profile.html">
              <i className="fa fa-user opacity-6 text-dark me-1" />
              Perfil
            </Link>
          </li>
          <li className="nav-item hoverB ">
            <Link to={'/signup'} className="nav-link me-2" href="../pages/sign-up.html">
              <i className="fas fa-user-circle opacity-6 text-dark me-1" />
              Crear Cuenta
            </Link>
          </li>
          <li className="nav-item hoverB">
            <Link to={'/login'} className="nav-link me-2" href="../pages/sign-in.html">
              <i className="fas fa-key opacity-6 text-dark me-1" />
              Iniciar Sesión
            </Link>
          </li>
        </ul>
       
        <ul className="navbar-nav d-lg-block d-none">
          <li className="nav-item">
            <Link to={'/support'} className="btn btn-sm btn-round mb-0 me-1 bg-gradient-dark">Soporte</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default NavbarNoProtected