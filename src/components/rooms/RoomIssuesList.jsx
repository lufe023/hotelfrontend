import React, { useState } from "react";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import Spinner from "../spinner/Spinner";

const RoomIssuesList = ({ roomIssues, roomId, getRoomsInfo, setTriger }) => {

  const [isLoading, setIsLoading] = useState(false)

  const [newIssue, setNewIssue] = useState({
    issueType: "",
    description: "",
  });

  // Mapeo de tipos de problemas a traducciones e íconos
  const issueTypeMap = {
    Electrical: { label: "Eléctrico", icon: "fas fa-bolt text-warning" },
    "Air Conditioning": {
      label: "Aire Acondicionado",
      icon: "fas fa-snowflake text-info",
    },
    "Hot Water": { label: "Agua Caliente", icon: "fas fa-water text-primary" },
    Leaking: { label: "Filtraciones", icon: "fas fa-tint text-blue" },
    Bathroom: { label: "Baño", icon: "fas fa-toilet text-secondary" },
    Other: { label: "Otro", icon: "fas fa-question-circle text-muted" },
  };

  // Cambiar el estado de un issue
  const handleStatusChange = async (id, newStatus) => {
    setIsLoading(true);
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/issues/${id}`;
   axios.patch(
        URL,
        { status: newStatus, resolvedAt: newStatus === "Resolved" ? new Date() : null },
        getConfig()
      )
      .then((res) => {
        setIsLoading(false);
        getRoomsInfo(roomId);
        setTriger((prev) => !prev);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error al actualizar el estado del problema:", err);
        alert("No se pudo actualizar el estado del problema.");
      });

  
  };

  // Reportar un nuevo problema
  const handleReportIssue = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER}/api/v1/issues`,
        { ...newIssue, roomId }, // Agregar roomId al cuerpo de la solicitud
        getConfig()
      );

      // Actualizar la lista de problemas localmente con el nuevo problema
      getRoomsInfo(roomId);

      // Limpiar el formulario
      setNewIssue({ issueType: "", description: "" });
      setTriger((prev) => !prev);
    } catch (error) {
      console.error("Error al reportar un nuevo problema:", error);
      alert("No se pudo reportar el problema.");
    }
  };

  return (
    <div className="card" id="issue">
      <div className="card-header pb-0 px-3">
        <h6 className="mb-0">Problemas Reportados</h6>
      </div>

      <div className="card-body pt-4 p-3">
        <ul className="list-group">
          {roomIssues?.map((issue) => {
            const issueInfo = issueTypeMap[issue.issueType] || {
              label: issue.issueType,
              icon: "fas fa-question-circle",
            };

            return (
              <li
                key={issue.id}
                className="list-group-item border-0  p-4 mb-2 bg-gray-100 border-radius-lg"
              >
                {/* Información del Issue */}
                <div className="d-flex flex-column">
                  <h6 className="mb-3 text-sm">
                    <i className={`${issueInfo.icon} me-2`}></i>
                    {issueInfo.label}
                  </h6>
                  <span className="mb-2 text-xs">
                    <strong>Descripción:</strong>{" "}
                    <span className="text-dark font-weight-bold ms-sm-2">
                      {issue.description}
                    </span>
                  </span>
                  <span className="mb-2 text-xs">
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`ms-sm-2 font-weight-bold ${
                        issue.status === "Resolved"
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      {issue.status === "Resolved" ? "Resuelto" : "Pendiente"}
                    </span>
                  </span>
                  <span className="mb-2 text-xs">
                    <strong>Reportado el:</strong>{" "}
                    <span className="text-dark font-weight-bold ms-sm-2">
                      {new Date(issue.reportedAt).toLocaleString()}
                    </span>
                  </span>
                  <span className="text-xs">
                    <strong>Resuelto el:</strong>{" "}
                    <span className="text-dark font-weight-bold ms-sm-2">
                      {issue.resolvedAt
                        ? new Date(issue.resolvedAt).toLocaleString()
                        : "Pendiente"}
                    </span>
                  </span>
                </div>

                {/* Botones de Acción */}
                <div className="ms-auto text-end mt-3 gap-2 d-flex">
                  <button
                    className="btn btn-success  text-whote  px-3 mb-2"
                    onClick={() => handleStatusChange(issue.id, "Resolved")}
                    disabled={issue.status === "Resolved"}
                  >
              {isLoading && (
            <i
              className="row"
              style={{
                justifyContent: "center",
                position: "relative",
                float: "left",
                zIndex: 1000,
                top:"0px",
                backdropFilter: "blur(115px)",
                borderRadius: "0.5rem",
              }}
            >
              <Spinner scale={"0.5"}/>
            </i>
          )}
                  {!isLoading && (<i className="fas fa-check me-2"></i>)} Resolver
                  </button>

                  <button
                 
                    className="btn btn-warning text-white px-3 mb-2"
                    onClick={() => handleStatusChange(issue.id, "Pending")}
                    disabled={issue.status === "Pending"}
                  >
                    <i className="fas fa-undo me-2"></i> Revertir
                  </button>
                </div>

              </li>
            );
          })}
        </ul>

        {/* Formulario para reportar un nuevo problema */}
        <div className="mt-4">
          <h6 className="mb-3">Reportar un nuevo problema</h6>
          <form onSubmit={handleReportIssue}>
            <div className="mb-3">
              <label htmlFor="issueType" className="form-label">
                Tipo de Problema
              </label>
              <select
                id="issueType"
                className="form-select"
                value={newIssue.issueType}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, issueType: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Selecciona el tipo de problema
                </option>
                {Object.entries(issueTypeMap).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Descripción
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="3"
                value={newIssue.description}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, description: e.target.value })
                }
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Reportar Problema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomIssuesList;
