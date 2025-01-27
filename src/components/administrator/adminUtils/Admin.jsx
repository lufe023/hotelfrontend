import React from 'react'
import AreasManager from './AreasManager'
import Aside from '../../aside'
import Navbar from '../../Navbar'
import { useMenu } from '../../../utils/MenuContext'

const Admin = () => {
    const { isPinned } = useMenu(); // Controla el estado del menú
  return (
<div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>
      <Aside />
        <Navbar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
      <div className="container-fluid py-4 ">
      <div className="row">
      <div className="col-lg-8 col-md-6 mb-md-0 mb-4">

      </div>
      <div className="col-lg-4 col-md-6 mb-md-0 mb-4">
      <AreasManager/>
      </div>
      </div>
      </div>
      </main>
    </div>
  )
}

export default Admin