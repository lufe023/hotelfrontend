import React, { useState, useEffect } from "react";
import getConfig from "../../utils/getConfig";
import axios from "axios";

const DepartmentForm = ({ onAddDepartment, onEditDepartment, editingDepartment, setEditingDepartment }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Nuevo estado para description

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name);
      setDescription(editingDepartment.description); // Cargar la descripción si estamos editando
    } else {
      setName("");
      setDescription(""); // Limpiar cuando no estamos editando
    }
  }, [editingDepartment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return;
    const backendUrl = import.meta.env.VITE_API_SERVER;
    const departmentData = { name, description }; // Incluir description en los datos
    const url = editingDepartment ? `${backendUrl}/api/v1/departments/${editingDepartment.id}` : `${backendUrl}/api/v1/departments`;
    const method = editingDepartment ? "PATCH" : "POST";
    
    method?.toLowerCase() === "patch"
        ? axios.patch(url, departmentData, getConfig())
        : axios.post(url, departmentData, getConfig())
      .then((data) => {
        editingDepartment ? onEditDepartment(data) : onAddDepartment(data);
        setName("");
        setDescription(""); // Limpiar los campos después de agregar o editar
        setEditingDepartment(null);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{editingDepartment ? "Editar Departamento" : "Agregar Departamento"}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Descripción del departamento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-2">
            {editingDepartment ? "Actualizar" : "Agregar"}
          </button>
          {editingDepartment && (
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => setEditingDepartment(null)}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
