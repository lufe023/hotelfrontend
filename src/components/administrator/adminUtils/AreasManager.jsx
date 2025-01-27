import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getConfig from "../../../utils/getConfig";


const AreasManager = () => {
  const [areas, setAreas] = useState([]); // Lista de áreas
  const [newArea, setNewArea] = useState(""); // Estado para nueva área
  const [editingArea, setEditingArea] = useState(null); // Área en edición
  const [updatedAreaName, setUpdatedAreaName] = useState(""); // Nombre actualizado para el área en edición
  const [newDescription, setNewDescription] = useState(""); // Estado para la nueva descripción
  const [updatedDescription, setUpdatedDescription] = useState(""); // Estado para descripción actualizada

  // Obtener todas las áreas al montar el componente
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = () => {
    axios
      .get(`${import.meta.env.VITE_API_SERVER}/api/v1/areas`, getConfig())
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar áreas",
          text: error.response?.data?.message || "No se pudieron cargar las áreas",
        });
      });
  };

  // Crear una nueva área
  const handleCreateArea = () => {
    if (!newArea.trim()) {
      Swal.fire({
        icon: "warning",
        title: "El nombre del área no puede estar vacío, use nombres como: Ala Este Piso 2",
      });
      return;
    }
  
    axios
      .post(
        `${import.meta.env.VITE_API_SERVER}/api/v1/areas`,
        { name: newArea, description: newDescription },
        getConfig()
      )
      .then(() => {
        fetchAreas();
        setNewArea("");
        setNewDescription("");
        Swal.fire({
          icon: "success",
          title: "Área creada exitosamente",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al crear área",
          text: error.response?.data?.message || "No se pudo crear el área",
        });
      });
  };

  // Eliminar un área
  const handleDeleteArea = (id, name) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el Área ${name}, esta acción no se puede revertir`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_API_SERVER}/api/v1/areas/${id}`, getConfig())
          .then(() => {
            fetchAreas();
            Swal.fire({
              icon: "success",
              title: "Área eliminada exitosamente",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error al eliminar área",
              text: error.response?.data?.message || "No se pudo eliminar el área",
            });
          });
      }
    });
  };

  // Actualizar un área
  const handleUpdateArea = (id) => {
    if (!updatedAreaName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "El nombre del área no puede estar vacío",
      });
      return;
    }
  
    axios
      .patch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/areas/${id}`,
        { name: updatedAreaName, description: updatedDescription },
        getConfig()
      )
      .then(() => {
        fetchAreas();
        setEditingArea(null);
        setUpdatedAreaName("");
        setUpdatedDescription("");
        Swal.fire({
          icon: "success",
          title: "Área actualizada exitosamente",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar área",
          text: error.response?.data?.message || "No se pudo actualizar el área",
        });
      });
  };

  return (
    <div className="col-xl-12">
      <div className="card">
        <div className="card-header pb-0 p-3">
          <h6 className="mb-0">Gestión de Áreas</h6>
        </div>
        <div className="card-body p-3">
          <div className="mb-2">
<h6 className=" text-body text-xs font-weight-bolder">Nueva Área</h6>
<div className="input-group mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Nombre del área"
    value={newArea}
    onChange={(e) => setNewArea(e.target.value)}
  />
</div>
<div className="input-group mb-3">
  <textarea
    className="form-control"
    placeholder="Descripción del área"
    value={newDescription}
    onChange={(e) => setNewDescription(e.target.value)}
  />
</div>
<div className="card-footer">

<button className="btn btn-primary float-right" onClick={handleCreateArea}>
  Crear
</button>
</div>
</div>
          <h6 className="text-body text-xs font-weight-bolder">Áreas</h6>
          <ul className="list-group mb-4 ">
            {areas?.rows?.map((area) => (
              <li key={area.id} className="list-group-item border-0 shadow d-flex p-2 mb-3 bg-gray-100">
                <div className="col-7">
                {editingArea === area.id ? (
  <>
    <input
      type="text"
      className="form-control me-2"
      value={updatedAreaName}
      onChange={(e) => setUpdatedAreaName(e.target.value)}
    />
    <textarea
      className="form-control mt-2"
      placeholder="Descripción del área"
      value={updatedDescription}
      onChange={(e) => setUpdatedDescription(e.target.value)}
    />
  </>
) : (
  <>
    <span>{area.name}</span>
    <p className="text-muted">{area.description}</p>
  </>
)}
                  </div>

                  <div className="col-5">
                  {editingArea === area.id ? (
                    <button
                      className="btn btn-link text-success px-3 mb-0"
                      onClick={() => handleUpdateArea(area.id)}
                    >
                     <i className="fas fa-save" /> Guardar
                    </button>
                  ) : (
                    <>
                    <button className="btn btn-link text-warning px-3 mb-0"
                     onClick={() => {
                      setEditingArea(area.id);
                      setUpdatedAreaName(area.name);
                      setUpdatedDescription(area.description)
                    }}
                    ><i className="fas fa-edit" /> Editar</button>
                    </>
                  )}

{editingArea === area.id ? (
   
    <>
    <button className="btn btn-link text-warning px-3 mb-0"
     onClick={() => {
      setEditingArea('');
      setUpdatedAreaName('');
    }}
    ><i className="fas fa-undo"/> Cancelar</button>
    </>
  ):(
                  <button
                    className="btn btn-link text-danger  px-3 mb-0"
                    onClick={() => handleDeleteArea(area.id, area.name)}
                  >
                   <i className="fas fa-trash" /> Eliminar
                  </button>
  )}
                </div>
              </li>
            ))}
          </ul>
         
        </div>
      </div>
    </div>
  );
};

export default AreasManager;
