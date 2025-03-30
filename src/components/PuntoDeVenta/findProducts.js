// Lógica para buscar productos
import axios from "axios";
import { agregarAlCarrito } from "./logicaDelCarrito";
import getConfig from "../../utils/getConfig";

export const findItem = (
    barcode,
    setProductos,
    searchType,
    carrito,
    setCarrito
) => {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/items/${
        searchType ? "findBarcode" : "itemSearh"
    }`;

    // Obtener el departmentId desde localStorage
    const storedDepartment = JSON.parse(
        localStorage.getItem("defaultDepartment")
    );
    const departmentId = storedDepartment ? storedDepartment.id : null;

    axios
        .post(URL, { sWord: barcode, departmentId }, getConfig())
        .then((res) => {
            setProductos(res.data.data.rows);
            if (searchType === 1 && res.data.data.rows.length > 0) {
                // Pasar departmentId a agregarAlCarrito
                agregarAlCarrito(
                    carrito,
                    setCarrito,
                    res.data.data.rows[0],
                    departmentId
                );
            }
        })
        .catch((err) => {
            setProductos([]);
            console.log(err);
        });
};
