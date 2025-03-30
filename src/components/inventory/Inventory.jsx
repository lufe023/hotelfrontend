import React, { useEffect, useState } from "react";

import Aside from "../aside/";
import Navbar from "../Navbar";
import { useMenu } from "../../utils/MenuContext"; // Asegúrate de que la ruta sea correcta
import DepartmentForm from "./DepartmentForm";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import Item from "./Item";
import AddProduct from "./AddProduct";

const Inventory = () => {
    const [departments, setDepartments] = useState([]);

    const { isPinned } = useMenu();
    // Cargar la lista de departamentos cuando el componente se monte
    const getDepartments = () => {
        axios
            .get(
                `${import.meta.env.VITE_API_SERVER}/api/v1/departments`,
                getConfig()
            )
            .then((response) => setDepartments(response.data))
            .catch((error) =>
                console.error("Error cargando los departamentos:", error)
            );
    };

    useEffect(() => {
        getDepartments();
    }, []);

    return (
        <div className={`g-sidenav-show ${isPinned ? "g-sidenav-pinned" : ""}`}>
            <Aside />
            <Navbar />
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">
                <div className="container-fluid">
                    <h2 className="mb-4 p-3">Agregar Productos y Servicios</h2>

                    <Item departments={departments} />

                    <div className="row">
                        <div className="col-12">
                            <AddProduct />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Inventory;
