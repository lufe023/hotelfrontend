import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import DepartmentList from "./DepartmentList";
import DepartmentForm from "./DepartmentForm";
import { useMenu } from "../../utils/MenuContext";
import Aside from "../aside/";
import Navbar from "../Navbar";

const DepartmentsAdmin = () => {
  const { isPinned } = useMenu();

  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);

  // Cargar la lista de departamentos cuando el componente se monte
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_SERVER}/api/v1/departments`, getConfig())
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error("Error cargando los departamentos:", error));
  }, []);

  const handleAddDepartment = (newDepartment) => {
    setDepartments([...departments, newDepartment]);
  };

  const handleEditDepartment = (updatedDepartment) => {
    const updatedDepartments = departments.map((dept) =>
      dept.id === updatedDepartment.id ? updatedDepartment : dept
    );
    setDepartments(updatedDepartments);
  };

  const handleDeleteDepartment = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return (
    <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>
      <Aside />
      <Navbar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
        <div className="container-fluid">
          <h2 className="mb-4">Administración de Departamentos</h2>
          <div className="row">
            <div className="col-md-4">
              <DepartmentForm
                onAddDepartment={handleAddDepartment}
                onEditDepartment={handleEditDepartment}
                editingDepartment={editingDepartment}
                setEditingDepartment={setEditingDepartment}
              />
            </div>
            <div className="col-md-8">
              <DepartmentList
                departments={departments}
                setEditingDepartment={setEditingDepartment}
                onDeleteDepartment={handleDeleteDepartment}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepartmentsAdmin;
