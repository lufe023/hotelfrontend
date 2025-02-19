import Swal from "sweetalert2";
import getConfig from "../../utils/getConfig";
import axios from "axios";

export const toggleFavorito = async (productoId, favoritos, setFavoritos) => {
    try {
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/favorites`; // Ajusta la URL según tu backend

        // Verificar si el producto ya está en favoritos
        const esFavorito = favoritos.some((fav) => fav.id === productoId);

        if (esFavorito) {
            // Eliminar de favoritos
            await axios.delete(`${URL}?itemId=${productoId}`, getConfig());
            cargarFavoritos(setFavoritos);
            Swal.fire({
                icon: "error",
                title: `Eliminado de favoritos`,
                toast: true,
                position: "top-end",
                showCloseButton: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            // Agregar a favoritos
            await axios.post(URL, { itemId: productoId }, getConfig());
            cargarFavoritos(setFavoritos);
            Swal.fire({
                icon: "success",
                title: `Agregado a favoritos`,
                toast: true,
                position: "top-end",
                showCloseButton: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    } catch (error) {
        console.error("Error al manejar favoritos:", error);
        Swal.fire("Error", "No se pudo actualizar favoritos", "error");
    }
};

export const cargarFavoritos = async (setFavoritos) => {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/favorites`;
    axios
        .get(URL, getConfig())
        .then((response) => {
            const itemsOnly = response.data.map((fav) => fav.item); // Extraer solo `item`
            setFavoritos(itemsOnly);
        })
        .catch((err) => console.log(err));
};
