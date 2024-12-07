import React from 'react'

const Tasks = () => {
  return (
   
    <div className="card h-100">
      <div className="card-header pb-0">
        <h6>Tareas</h6>
        <p className="text-sm">
          <i className="fa fa-arrow-up text-success" aria-hidden="true" />
          <span className="font-weight-bold">24%</span> Tareas Pendientes
        </p>
      </div>
      <div className="card-body p-3">
        <div className="timeline timeline-one-side">
          <div className="timeline-block mb-3">
            <span className="timeline-step">
              <i className="ni ni-bell-55 text-success text-gradient" />
            </span>
            <div className="timeline-content">
              <h6 className="text-dark text-sm font-weight-bold mb-0">Requerimiento del Huesped al llegar</h6>
              <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">22 DEC 7:20 PM</p>
            </div>
          </div>
          <div className="timeline-block mb-3">
            <span className="timeline-step">
            <i className="fas fa-concierge-bell text-danger text-gradient" />

         
            </span>
            <div className="timeline-content">
              <h6 className="text-dark text-sm font-weight-bold mb-0">Servicio a la Habitación #101</h6>
              <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">21 DEC 11 PM</p>
            </div>
          </div>
          <div className="timeline-block mb-3">
            <span className="timeline-step">
              <i className="ni ni-cart text-info text-gradient" />
            </span>
            <div className="timeline-content">
              <h6 className="text-dark text-sm font-weight-bold mb-0">Cliente envió comprobante de pago</h6>
              <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">21 DEC 9:34 PM</p>
            </div>
          </div>
          <div className="timeline-block mb-3">
            <span className="timeline-step">
            <i className="fas fa-birthday-cake text-warning text-gradient" />
   
            </span>
            <div className="timeline-content">
              <h6 className="text-dark text-sm font-weight-bold mb-0">Cliente cumpleños en 1 semana</h6>
              <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">20 DEC 2:20 AM</p>
            </div>
          </div>
          <div className="timeline-block mb-3">
            <span className="timeline-step">
              <i className="ni ni-key-25 text-primary text-gradient" />
            </span>
            <div className="timeline-content">
              <h6 className="text-dark text-sm font-weight-bold mb-0">Hoy salen 3 clientes (Limpiar) </h6>
              <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">18 DEC 4:54 AM</p>
            </div>
          </div>
          <div className="timeline-block">
            <span className="timeline-step">
              <i className="ni ni-money-coins text-dark text-gradient" />
            </span>
            <div className="timeline-content">
              <h6 className="text-dark text-sm font-weight-bold mb-0">New order #9583120</h6>
              <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">17 DEC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  )
}

export default Tasks