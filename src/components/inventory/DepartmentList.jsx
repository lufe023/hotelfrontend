import React from "react";
import axios from "axios";
import getConfig from "../../utils/getConfig";

const DepartmentList = ({ departments, setEditingDepartment, onDeleteDepartment }) => {
  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este departamento?")) return;

    const backendUrl = import.meta.env.VITE_API_SERVER;
    const url = `${backendUrl}/api/v1/departments/${id}`;

    axios
      .delete(url, getConfig())
      .then(() => onDeleteDepartment(id))
      .catch((error) => console.error("Error eliminando el departamento:", error));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-secondary text-white">
        <h5 className="mb-0">Lista de Departamentos</h5>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <li key={dept.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{dept.name}</strong><br />
                  <small>{dept.description}</small> {/* Mostrar la descripción */}
                </div>
                <div>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => setEditingDepartment(dept)}>
                    ✏️ Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dept.id)}>
                    ❌ Eliminar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center text-muted">No hay departamentos registrados</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentList;
