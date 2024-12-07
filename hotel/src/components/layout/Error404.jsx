import React from 'react'
import NavbarNoProtected from '../NotProtected/NavbarNoProtected'
import FooterNoProtected from '../NotProtected/FooterNoProtected'
import { Link } from 'react-router-dom'

const Error404 = () => {
  return (
    <div className='bg-white'>
    <div className="container position-sticky z-index-sticky top-0">
      <div className="row">
        <div className="col-12">
      <NavbarNoProtected/>
        </div>
      </div>
    </div>
    <main className="main-content  mt-0">
      <section>
        <div className="page-header min-vh-75">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                <div className="card card-plain mt-8">
                  <div className="card-header pb-0 text-left bg-transparent">
                    <h2 className="font-weight-bolder text-info text-gradient">404 Error</h2>
                    <p className="mb-0">Parece que ha entrado a un área que no existe</p>
                    <p className="mb-4 text-sm mx-auto">
                    Para volver al inicio haga click 
                      <Link to={'/'} className="text-info text-gradient font-weight-bold"> Aquí</Link>
                    </p>
                  </div>
                 
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </section>
    </main>
    {/* -------- START FOOTER 3 w/ COMPANY DESCRIPTION WITH LINKS & SOCIAL ICONS & COPYRIGHT ------- */}
  <FooterNoProtected/>
    {/* -------- END FOOTER 3 w/ COMPANY DESCRIPTION WITH LINKS & SOCIAL ICONS & COPYRIGHT ------- */}
    {/*   Core JS Files   */}
    {/* Github buttons */}
    {/* Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc */}
  </div>
  )
}

export default Error404