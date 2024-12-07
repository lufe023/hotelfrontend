import React from 'react'

const Bookin = () => {
  return (
    <div className="col-lg-12 col-md-6 mb-md-0 mb-4">
 <div className="card mb-4">
  <div className="card-header pb-0">
    <h6>Tabla de Clientes</h6>
  </div>
  <div className="card-body px-0 pt-0 pb-2">
    <div className="table-responsive p-0">
      <table className="table align-items-center mb-0">
        <thead>
          <tr>
            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Huesped</th>
            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Tipo</th>
            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estadía</th>
           
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="d-flex px-2 py-1">
                <div>
                  <img src="./src/assets/img/team-2.jpg" className="avatar avatar-sm me-3" alt="user1" />
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">John Michael</h6>
                  <p className="text-xs text-secondary mb-0">john@creative-tim.com</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">Estándar</p>
              <p className="text-xs text-secondary mb-0">2 personas</p>
            </td>
            <td className="align-middle text-center text-sm">
              <span className="badge badge-sm bg-success">Completado</span>
            </td>
            <td className="align-middle text-center">
              <span className="text-secondary text-xxs">11/08/24</span>
                -  
              <span className="text-secondary text-xxs">13/08/24</span>
            </td>
          </tr>
          <tr>
            <td>
              <div className="d-flex px-2 py-1">
                <div>
                  <img src="./src/assets/img/team-3.jpg" className="avatar avatar-sm me-3" alt="user2" />
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">Alexa Liras</h6>
                  <p className="text-xs text-secondary mb-0">alexa@creative-tim.com</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">Doble</p>
              <p className="text-xs text-secondary mb-0">2 personas</p>
            </td>
            <td className="align-middle text-center text-sm">
              <span className="badge badge-sm bg-warning">Pendiente</span>
            </td>
            <td className="align-middle text-center">
            <span className="text-secondary text-xxs">11/08/24</span>
                -  
              <span className="text-secondary text-xxs">13/08/24</span>
            </td>
       
          </tr>
          <tr>
            <td>
              <div className="d-flex px-2 py-1">
                <div>
                  <img src="./src/assets/img/team-4.jpg" className="avatar avatar-sm me-3" alt="user3" />
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">Laurent Perrier</h6>
                  <p className="text-xs text-secondary mb-0">laurent@creative-tim.com</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">Executive</p>
              <p className="text-xs text-secondary mb-0">Projects</p>
            </td>
            <td className="align-middle text-center text-sm">
              <span className="badge badge-sm bg-gradient-success">Online</span>
            </td>
            <td className="align-middle text-center">
              <span className="text-secondary text-xs font-weight-bold">19/09/17</span>
            </td>
       
          </tr>
          <tr>
            <td>
              <div className="d-flex px-2 py-1">
                <div>
                  <img src="./src/assets/img/team-3.jpg" className="avatar avatar-sm me-3" alt="user4" />
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">Michael Levi</h6>
                  <p className="text-xs text-secondary mb-0">michael@creative-tim.com</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">Programator</p>
              <p className="text-xs text-secondary mb-0">Developer</p>
            </td>
            <td className="align-middle text-center text-sm">
              <span className="badge badge-sm bg-gradient-success">Online</span>
            </td>
            <td className="align-middle text-center">
              <span className="text-secondary text-xs">24/12/08</span>
            </td>
       
          </tr>
          <tr>
            <td>
              <div className="d-flex px-2 py-1">
                <div>
                  <img src="./src/assets/img/team-2.jpg" className="avatar avatar-sm me-3" alt="user5" />
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">Richard Gran</h6>
                  <p className="text-xs text-secondary mb-0">richard@creative-tim.com</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">Manager</p>
              <p className="text-xs text-secondary mb-0">Executive</p>
            </td>
            <td className="align-middle text-center text-sm">
              <span className="badge badge-sm bg-gradient-secondary">Offline</span>
            </td>
            <td className="align-middle text-center">
              <span className="text-secondary text-xs">04/10/21</span>
            </td>
       
          </tr>
          <tr>
            <td>
              <div className="d-flex px-2 py-1">
                <div>
                  <img src="./src/assets/img/team-4.jpg" className="avatar avatar-sm me-3" alt="user6" />
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">Miriam Eric</h6>
                  <p className="text-xs text-secondary mb-0">miriam@creative-tim.com</p>
                </div>
              </div>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">Programtor</p>
              <p className="text-xs text-secondary mb-0">Developer</p>
            </td>
            <td className="align-middle text-center text-sm">
              <span className="badge badge-sm bg-gradient-secondary">Offline</span>
            </td>
            <td className="align-middle text-center">
              <span className="text-secondary text-xs font-weight-bold">14/09/20</span>
            </td>
       
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

  </div>
  )
}

export default Bookin