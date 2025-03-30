import React from "react";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import Swal from "sweetalert2";

const DepartmentList = ({ departments, setEditingDepartment, onDeleteDepartment }) => {
  const handleDelete = (id) => {

    Swal.fire({
         title: '¿Estás seguro?',
         html: `Se Eliminará este departamento, esto no es reversible .`,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Sí, Eliminar',
         confirmButtonColor:'#ef4444',
         cancelButtonText: 'Cancelar',
       }).then((result) => {
         if (result.isConfirmed) {
          deleteDepartment(id);
         }
       });

   
  };

  const deleteDepartment = (id) => {
    const backendUrl = import.meta.env.VITE_API_SERVER;
    const url = `${backendUrl}/api/v1/departments/${id}`;

    axios
      .delete(url, getConfig())
      .then(() => onDeleteDepartment(id))
      .catch((error) => console.error("Error eliminando el departamento:", error));
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header pb-0">
        <h5 className="mb-0">Lista de Departamentos</h5>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {departments.length > 0 ? (
            departments.map((dept, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
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
