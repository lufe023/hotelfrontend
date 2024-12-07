import React from 'react'

const RoomsClients = () => {
  return (
    <div className="row">
    <div className="col-12 mt-4">
<div className="card mb-4">
  <div className="card-header pb-0 p-3">
    <h6 className="mb-1">Habitaciones</h6>
    <p className="text-sm">Architects design houses</p>
  </div>
  <div className="card-body p-3">
    <div className="row">
      <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
        <div className="card card-blog card-plain">
          <div className="position-relative">
            <a className="d-block">
              <img src="./src/assets/img/home-decor-2.jpg" alt="img-blur-shadow" className="img-fluid shadow border-radius-md" />
            </a>
          </div>
          <div className="card-body px-1 pb-0">
            <p className="text-secondary mb-0 text-sm">Habitación #102</p>
            <a href="javascript:;">
              <h5 className="font-weight-bolder">
                Doble
              </h5>
            </a>
            <p className="mb-4 text-sm">
            Habitación doble acogedora con cama cómoda para dos personas y una espectacular vista al paisaje, ideal para relajarse y disfrutar del entorno natural.
            </p>
            <div className="d-flex align-items-center justify-content-between">
<button type="button" className="btn btn-outline-primary btn-sm mb-0">Ver Proyecto</button>
<div className="icon-group mt-2">
  {/* Icono de cama */}
  <div className="icon-item" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cama doble">
    <i className="fas fa-bed"></i> 1 cama doble
  </div>
  
  {/* Icono de ocupación */}
  <div className="icon-item" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Capacidad para 2 personas">
    <i className="fas fa-user-friends"></i> 2 personas
  </div>
  
  {/* Icono de vistas */}
  <div className="icon-item" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Hermosa vista">
    <i className="fas fa-mountain"></i> Vista al paisaje
  </div>
</div>
</div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
        <div className="card card-blog card-plain">
          <div className="position-relative">
            <a className="d-block">
              <img src="./src/assets/img/home-decor-1.jpg" alt="img-blur-shadow" className="img-fluid shadow border-radius-md" />
            </a>
          </div>
          <div className="card-body px-1 pb-0">
            <p className="text-secondary mb-0 text-sm">Project #1</p>
            <a href="javascript:;">
              <h5 className="font-weight-bolder">
                Scandinavian
              </h5>
            </a>
            <p className="mb-4 text-sm">
              Music is something that every person has his or her own specific opinion.
            </p>
            <div className="d-flex align-items-center justify-content-between">
<button type="button" className="btn btn-outline-primary btn-sm mb-0">Ver Proyecto</button>
<div className="icon-group mt-2">
  {/* Icono de cama */}
  <div className="icon-item" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cama doble">
    <i className="fas fa-bed"></i> 1 cama doble
  </div>
  
  {/* Icono de ocupación */}
  <div className="icon-item" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Capacidad para 2 personas">
    <i className="fas fa-user-friends"></i> 2 personas
  </div>
  
  {/* Icono de vistas */}
  <div className="icon-item" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Hermosa vista">
    <i className="fas fa-mountain"></i> Vista al paisaje
  </div>
</div>
</div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
        <div className="card card-blog card-plain">
          <div className="position-relative">
            <a className="d-block">
              <img src="./src/assets/img/home-decor-3.jpg" alt="img-blur-shadow" className="img-fluid shadow border-radius-md" />
            </a>
          </div>
          <div className="card-body px-1 pb-0">
            <p className="text-secondary mb-0 text-sm">Project #3</p>
            <a href="javascript:;">
              <h5 className="font-weight-bolder">
                Minimalist
              </h5>
            </a>
            <p className="mb-4 text-sm">
              Different people have different taste, and various types of music.
            </p>
            <div className="d-flex align-items-center justify-content-between">
              <button type="button" className="btn btn-outline-primary btn-sm mb-0">View Project</button>
              <div className="avatar-group mt-2">
                <a href="javascript:;" className="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" aria-label="Peterson" data-bs-original-title="Peterson">
                  <img alt="Image placeholder" src="./src/assets/img/team-4.jpg" />
                </a>
                <a href="javascript:;" className="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" aria-label="Nick Daniel" data-bs-original-title="Nick Daniel">
                  <img alt="Image placeholder" src="./src/assets/img/team-3.jpg" />
                </a>
                <a href="javascript:;" className="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" aria-label="Ryan Milly" data-bs-original-title="Ryan Milly">
                  <img alt="Image placeholder" src="./src/assets/img/team-2.jpg" />
                </a>
                <a href="javascript:;" className="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" aria-label="Elena Morison" data-bs-original-title="Elena Morison">
                  <img alt="Image placeholder" src="./src/assets/img/team-1.jpg" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
        <div className="card h-100 card-plain border">
          <div className="card-body d-flex flex-column justify-content-center text-center">
            <a href="javascript:;">
              <i className="fa fa-plus text-secondary mb-3" aria-hidden="true" />
              <h5 className=" text-secondary"> New project </h5>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
  )
}

export default RoomsClients