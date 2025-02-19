// Lógica para buscar productos

import axios from "axios";
import getConfig from "../../utils/getConfig";
import { agregarAlCarrito } from "./logicaDelCarrito";

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
    axios
        .post(URL, { sWord: barcode }, getConfig())
        .then((res) => {
            setProductos(res.data.data.rows);
            if (searchType === 1 && res.data.data.rows.length > 0) {
                agregarAlCarrito(carrito, setCarrito, res.data.data.rows[0]);
            }
        })
        .catch((err) => {
            setProductos([]);
            console.log(err);
        });
};
