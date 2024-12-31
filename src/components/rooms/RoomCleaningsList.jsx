import React, { useEffect, useState } from "react";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import Swal from "sweetalert2";
import FindUser from "../users/FindUser";

const RoomCleaningsList = ({setTriger, roomCleanings, roomId }) => {

  const [selectedUser, setSelectedUser] = useState("");
  const [results, setResults] = useState([]);

  const [newCleaning, setNewCleaning] = useState({
    roomId,
    cleaningType: "",
    notes: "",
    cleaningDate: "",
    userId: selectedUser?.id,
  });

  useEffect(() => {

    setNewCleaning((prev) => ({ ...prev, userId: selectedUser?.id }));
  }, [selectedUser]);

  // Mapeo de tipos de limpiezas a traducciones e íconos
  const cleaningTypeMap = {
    Routine: { label: "Rutinaria", icon: "fas fa-broom text-primary" },
    "Deep Cleaning": { label: "Profunda", icon: "fas fa-shower text-info" },
    Emergency: { label: "Emergencia", icon: "fas fa-exclamation-triangle text-danger" },
  };

  // Cambiar el estado de una limpieza
  const handleStatusChange = async (id, newStatus) => {
    
      axios.patch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/cleanings/${id}`,
        { status: newStatus },
        getConfig()
      )
      .then((res) => {
        if (res.status === 200) {
                  Swal.fire({
                    icon: "success",
                    title: `Limpieza completada actualizado exitosamente`,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                  });
                }
                setTriger((prev) => !prev);
              })
      .catch((err) => { 
        console.error("Error al programar la limpieza:", err);
        Swal.fire({
          icon: "error",
          title: `Hubo un error al actualizar el estado de la limpieza`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

      });
  };

  // Programar una nueva limpieza
  const handleScheduleCleaning = async (e) => {
    e.preventDefault();
    console.log(newCleaning)
    axios.post(
        `${import.meta.env.VITE_API_SERVER}/api/v1/cleanings`,
        newCleaning, // Agregar roomId al cuerpo de la solicitud
        getConfig()
      )
      .then((res) => {
        if (res.status === 200) {
                  Swal.fire({
                    icon: "success",
                    title: `Se ha agendado una nueva limpieza`,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                  });
                }
        setTriger((prev) => !prev);
        })
        .catch((err) => { 
          console.error("Error al programar la limpieza:", err);
          Swal.fire({
            icon: "error",
            title: `Hubo un error creando la limpieza`,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

        });
  };

  return (
    <div className="card" id="cleaning">
      <div className="card-header pb-0 px-3">
        <h6 className="mb-0">Limpiezas Programadas</h6>
      </div>

      <div className="card-body pt-4 p-3">
        <ul className="list-group">
          {roomCleanings.map((cleaning) => {
            const cleaningInfo = cleaningTypeMap[cleaning.cleaningType] || {
              label: cleaning.cleaningType,
              icon: "fas fa-question-circle",
            };

            return (
              <li
                key={cleaning.id}
                className="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
              >
                {/* Información de la Limpieza */}
                <div className="d-flex flex-column">
                  <h6 className="mb-3 text-sm">
                    <i className={`${cleaningInfo.icon} me-2`}></i>
                    {cleaningInfo.label}
                  </h6>
                  <span className="mb-2 text-xs">
                    <strong>Notas:</strong>{" "}
                    <span className="text-dark font-weight-bold ms-sm-2">
                      {cleaning.notes || "Sin notas"}
                    </span>
                  </span>
                  <span className="mb-2 text-xs">
                    <strong>Fecha:</strong>{" "}
                    <span className="text-dark font-weight-bold ms-sm-2">
                      {new Date(cleaning.cleaningDate).toLocaleString()}
                    </span>
                  </span>
                  <span className="mb-2 text-xs">
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`ms-sm-2 font-weight-bold ${
                        cleaning.status === "Completed"
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      {cleaning.status === "Completed"
                        ? "Completada"
                        : "Pendiente"}
                    </span>
                  </span>
   
                  <span className="mb-2 text-xs">
                    <strong>Asignado a:</strong>{" "}
                    <span className="text-dark font-weight-bold ms-sm-2">
                      {cleaning.cleanedBy.firstName || "Sin asignar"}
                    </span>
                  </span>
                  
                </div>

                {/* Botones de Acción */}
                <div className="ms-auto text-end">
                  <button
                    className="btn btn-link text-success text-gradient px-3 mb-0"
                    onClick={() => handleStatusChange(cleaning.id, "Completed")}
                    disabled={cleaning.status === "Completed"}
                  >
                    <i className="fas fa-check me-2"></i> Completada
                  </button>
                  <button
                    className="btn btn-link text-warning px-3 mb-0"
                    onClick={() => handleStatusChange(cleaning.id, "Pending")}
                    disabled={cleaning.status === "Pending"}
                  >
                    <i className="fas fa-undo me-2"></i> Pendiente
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Formulario para programar una nueva limpieza */}
        <div className="mt-4">
          <h6 className="mb-3">Programar una nueva limpieza</h6>
          <form onSubmit={handleScheduleCleaning}>
          <div className=" mb-3">
                <FindUser setResults={setResults} selectedUser={selectedUser}/>
                <ul className="list-group shadow-sm">
                {results?.map((user)=>(
                <li key={user.id} className={`list-group-item border-0 d-flex align-items-center px-2 mb-2 ${selectedUser===user?'bg-primary':''}`}>
                <div className="avatar me-3">
                <img
  src={user.picture || `${import.meta.env.VITE_API_SERVER}/api/v1/images/images/nobody.jpg`}
  alt="Avatar del usuario"
  className="border-radius-lg shadow"
/>
                </div>
                <div className="d-flex align-items-start flex-column justify-content-center">
                  <h6 className="mb-0 text-sm">{user.firstName}</h6>
                  <p className="mb-0 text-xs">{user.phone}</p>
                </div>
              <a className="btn btn-link pe-3 ps-0 mb-0 ms-auto" onClick={()=>setSelectedUser(user)}>Seleccionar</a>
              </li>
                ))}
                </ul>
            </div>

            <div className="mb-3">
              <label htmlFor="cleaningType" className="form-label">
                Tipo de Limpieza
              </label>
              <select
                id="cleaningType"
                className="form-select"
                value={newCleaning.cleaningType}
                onChange={(e) =>
                  setNewCleaning({ ...newCleaning, cleaningType: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Selecciona el tipo de limpieza
                </option>
                {Object.entries(cleaningTypeMap).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">
                Notas
              </label>
              <textarea
                id="notes"
                className="form-control"
                rows="3"
                value={newCleaning.notes}
                onChange={(e) =>
                  setNewCleaning({ ...newCleaning, notes: e.target.value })
                }
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="cleaningDate" className="form-label">
                Fecha de Limpieza
              </label>
              <input
                type="datetime-local"
                id="cleaningDate"
                className="form-control"
                value={newCleaning.cleaningDate}
                onChange={(e) =>
                  setNewCleaning({ ...newCleaning, cleaningDate: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Programar Limpieza
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomCleaningsList;
