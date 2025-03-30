import React, { useState, useEffect } from "react";
import getConfig from "../../utils/getConfig";
import axios from "axios";

const DepartmentForm = ({
    onAddDepartment,
    onEditDepartment,
    editingDepartment,
    setEditingDepartment,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (editingDepartment) {
            setName(editingDepartment.name || "");
            setDescription(editingDepartment.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [editingDepartment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const backendUrl = import.meta.env.VITE_API_SERVER;
        const departmentData = { name, description };
        const url = editingDepartment
            ? `${backendUrl}/api/v1/departments/${editingDepartment.id}`
            : `${backendUrl}/api/v1/departments`;
        const method = editingDepartment ? "PATCH" : "POST";

        try {
            const { data } =
                method === "PATCH"
                    ? await axios.patch(url, departmentData, getConfig())
                    : await axios.post(url, departmentData, getConfig());

            editingDepartment ? onEditDepartment(data) : onAddDepartment(data);
            setName("");
            setDescription("");
            setEditingDepartment(null);
        } catch (error) {
            console.error("Error al guardar el departamento:", error);
            alert("Hubo un error al guardar el departamento.");
        }
    };

    return (
        <div className="card shadow-sm">
            <div
                className={`card-header pb-0 ${
                    editingDepartment ? "bg-primary" : ""
                }`}
            >
                <h5 className="mb-3">
                    {editingDepartment
                        ? "Editar Departamento"
                        : "Crear Departamento"}
                </h5>
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
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-2"
                    >
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
