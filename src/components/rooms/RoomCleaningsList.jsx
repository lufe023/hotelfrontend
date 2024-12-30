import React, { useState } from "react";
import axios from "axios";
import getConfig from "../../utils/getConfig";

const RoomCleaningsList = ({ roomCleanings, roomId }) => {

  const [newCleaning, setNewCleaning] = useState({
    cleaningType: "",
    notes: "",
    cleaningDate: "",
  });

  // Mapeo de tipos de limpiezas a traducciones e íconos
  const cleaningTypeMap = {
    Routine: { label: "Rutinaria", icon: "fas fa-broom text-primary" },
    "Deep Cleaning": { label: "Profunda", icon: "fas fa-shower text-info" },
    Emergency: { label: "Emergencia", icon: "fas fa-exclamation-triangle text-danger" },
  };

  // Cambiar el estado de una limpieza
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/cleanings/${id}`,
        { status: newStatus },
        getConfig()
      );
      const updatedCleaning = response.data;

      // // Actualizar el estado local con la limpieza actualizada
      // setRoomCleanings((prevCleanings) =>
      //   prevCleanings.map((cleaning) =>
      //     cleaning.id === id ? { ...cleaning, status: updatedCleaning.status } : cleaning
      //   )
      // );
    } catch (error) {
      console.error("Error al actualizar el estado de la limpieza:", error);
      alert("No se pudo actualizar el estado de la limpieza.");
    }
  };

  // Programar una nueva limpieza
  const handleScheduleCleaning = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER}/api/v1/cleanings`,
        { ...newCleaning, roomId }, // Agregar roomId al cuerpo de la solicitud
        getConfig()
      );

      // Actualizar la lista de limpiezas localmente con la nueva limpieza
      setRoomCleanings((prevCleanings) => [...prevCleanings, response.data]);

      // Limpiar el formulario
      setNewCleaning({ cleaningType: "", notes: "", cleaningDate: "" });
    } catch (error) {
      console.error("Error al programar una nueva limpieza:", error);
      alert("No se pudo programar la limpieza.");
    }
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
