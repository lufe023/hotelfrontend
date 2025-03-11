import React from 'react'
  import DashboardContent from '../dashboard';
  import Aside from '../aside/';
  import Navbar from '../Navbar';
import { useMenu } from '../../utils/MenuContext'; // Asegúrate de que la ruta sea correcta

const Inventory = () => {

  const { isPinned } = useMenu(); // Ahora esto funcionará correctamente
  
  return (
    <div className={`g-sidenav-show  ${isPinned ? 'g-sidenav-pinned' : ''}`}>
    <Aside />
      <Navbar />
    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
     
    </main>
  </div>
  )
}

export default Inventory