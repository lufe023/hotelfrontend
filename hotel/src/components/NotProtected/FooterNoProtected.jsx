import React from 'react'

const FooterNoProtected = () => {
  return (
    <footer className="footer py-5">
    <div className="container">
      <div className="row">
        <div className="col-lg-8 mb-4 mx-auto text-center">
          <a href="javascript:;" target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
            Compañía
          </a>
          <a href="javascript:;" target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
            Nosotros
          </a>
          <a href="javascript:;" target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
            Equipo
          </a>
          <a href="javascript:;" target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
            Productos
          </a>
     
        </div>
        <div className="col-lg-8 mx-auto text-center mb-4 mt-2">
         
          <a href="javascript:;" target="_blank" className="text-secondary me-xl-4 me-4">
            <span className="text-lg fab fa-twitter" />
          </a>
          <a href="javascript:;" target="_blank" className="text-secondary me-xl-4 me-4">
            <span className="text-lg fab fa-instagram" />
          </a>
          
          <a href="javascript:;" target="_blank" className="text-secondary me-xl-4 me-4">
            <span className="text-lg fab fa-github" />
          </a>
        </div>
      </div>
      <div className="row">
        <div className="col-8 mx-auto text-center mt-1">
          <p className="mb-0 text-secondary">
            Created By lufe023@gmail.com
          </p>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default FooterNoProtected