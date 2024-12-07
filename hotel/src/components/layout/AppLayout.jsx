import React from 'react'
  import DashboardContent from '../dashboard';
  import Aside from '../aside/';
  import Navbar from '../Navbar';
import { useMenu } from '../../utils/MenuContext'; // Asegúrate de que la ruta sea correcta

const AppLayout = () => {

  const { isPinned } = useMenu(); // Ahora esto funcionará correctamente
  
  return (
    <div className={`g-sidenav-show  ${isPinned ? 'g-sidenav-pinned' : ''}`}>
    <Aside />
    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <Navbar />
      <DashboardContent />
    </main>
  </div>
  )
}

export default AppLayout