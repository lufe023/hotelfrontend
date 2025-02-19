import Swal from "sweetalert2";
import errorSound from "../../../public/sounds/agotado.mp3";

// Reproducir sonido de error
export const playErrorSound = () => {
    const audio = new Audio(errorSound);
    audio.play().catch((error) => {
        console.error("Error al reproducir el sonido:", error);
    });
};

// Obtener la cantidad total de un producto en todos los carritos
export const obtenerCantidadTotalEnCarritos = (productoId) => {
    let cantidadTotal = 0;

    // Obtener todos los carritos desde localStorage
    const puntoDeVentaTabs =
        JSON.parse(localStorage.getItem("puntoDeVentaTabs")) || [];

    puntoDeVentaTabs.forEach((tab) => {
        const productoEnCarrito = tab.carrito.find(
            (item) => item.id === productoId
        );
        if (productoEnCarrito) {
            cantidadTotal += productoEnCarrito.cantidad || 0; // Evita valores incorrectos
        }
    });

    return { cantidadTotal };
};

export const generarMensajeSinStock = (producto, carritosConProducto) => {
    // Aseguramos que carritosConProducto sea un array
    const carritosArray = Array.isArray(carritosConProducto)
        ? carritosConProducto
        : [];

    // Agrupar por cliente para evitar duplicados
    const agrupadosPorCliente = carritosArray.reduce((acc, carrito) => {
        const nombreCliente = carrito.cliente.firstName || "No registrado";
        acc[nombreCliente] = (acc[nombreCliente] || 0) + carrito.cantidad;
        return acc;
    }, {});

    // Filtramos "Este carrito" y generamos la lista
    const carritosFiltrados = Object.entries(agrupadosPorCliente).filter(
        ([cliente]) => cliente !== "Este carrito"
    );

    // Calculamos el total distribuido sumando las cantidades por cliente
    const totalDistribuido = carritosFiltrados.reduce(
        (total, [, cantidad]) => total + cantidad,
        0
    );

    // Aseguramos que el total distribuido no supere el stock
    const cantidadDisponible = Math.min(producto.stock, totalDistribuido); // Nunca más de lo que hay en inventario

    // Detalle de carritos por cliente
    const detalleCarritos = carritosFiltrados
        .map(
            ([cliente, cantidad]) => `<li><b>${cliente}:</b> ${cantidad} </li>`
        )
        .join("");

    return `
    <div class='text-start'>
        No hay más unidades disponibles de <b>${producto.name}</b>. 
        en inventario hay <b>${producto.stock}</b>. Actualmente hay <b>${cantidadDisponible}</b> distribuidas en todas las comandas:
        <ul class='text-start p-2'>${detalleCarritos}</ul>
    </div>`;
};

// Validar stock considerando todos los carritos
export const validarStock = (producto) => {
    const { cantidadTotal, carritosConProducto } =
        obtenerCantidadTotalEnCarritos(producto.id);

    // Validar si la cantidad total en todos los carritos supera el stock disponible
    if (cantidadTotal >= producto.stock) {
        playErrorSound();
        document.addEventListener("keydown", bloquearEnter, true);

        Swal.fire({
            title: "Stock agotado",
            html: generarMensajeSinStock(producto, carritosConProducto),
            icon: "warning",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#22c55e",
            showCloseButton: true,
            customClass: { popup: "mi-alerta-stock" },
        });

        setTimeout(() => {
            document.removeEventListener("keydown", bloquearEnter, true);
        }, 1000);

        return false;
    }

    return true;
};

// Bloquear Enter en el modal de alerta
const bloquearEnter = (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
    }
};

// Agregar producto al carrito validando stock
export const agregarAlCarrito = (carrito, setCarrito, producto) => {
    if (localStorage.getItem("audio") === "true") {
        const utterance = new SpeechSynthesisUtterance(producto.name);
        utterance.rate = 1.15;
        utterance.lang = "es-MX";
        speechSynthesis.speak(utterance);
    }

    // Validar stock total
    if (!validarStock(producto, carrito)) return;

    const existeEnCarrito = carrito.find((item) => item.id === producto.id);
    const nuevoCarrito = existeEnCarrito
        ? carrito.map((item) =>
              item.id === producto.id
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item
          )
        : [...carrito, { ...producto, cantidad: 1 }];

    setCarrito(nuevoCarrito);

    // Guardar en localStorage para que todos los carritos lo vean
    localStorage.setItem("puntoDeVentaTabs", JSON.stringify(nuevoCarrito));
};

// Restar una unidad de un producto en el carrito
export const restarAlCarrito = (carrito, setCarrito, producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad > 1) {
            const nuevoCarrito = carrito.map((item) =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            );
            setCarrito(nuevoCarrito);
        } else {
            eliminarProducto(carrito, setCarrito, producto.id);
        }
    }
};

// Eliminar un producto del carrito
export const eliminarProducto = (carrito, setCarrito, id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
};

export const agregarCantidadAlCarrito = (
    carrito,
    setCarrito,
    producto,
    cantidad
) => {
    if (localStorage.getItem("audio") === "true") {
        const utterance = new SpeechSynthesisUtterance(producto.name);
        utterance.rate = 1.15;
        utterance.lang = "es-MX";
        speechSynthesis.speak(utterance);
    }

    // Obtener la cantidad actual en este carrito
    const existeEnCarrito = carrito.find((item) => item.id === producto.id);
    const cantidadActual = existeEnCarrito ? existeEnCarrito.cantidad : 0;

    // Obtener la cantidad total del producto en todos los carritos
    const { cantidadTotal } = obtenerCantidadTotalEnCarritos(producto.id);

    // Calculamos el nuevo total en todos los carritos, reemplazando la cantidad actual del carrito por la nueva cantidad:
    const nuevoTotal = cantidadTotal - cantidadActual + cantidad;

    // Validamos que el nuevo total no supere el stock
    if (nuevoTotal > producto.stock) {
        playErrorSound();
        Swal.fire({
            title: "Stock agotado",
            html: generarMensajeSinStock(producto, cantidadTotal),
            icon: "warning",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#22c55e",
            showCloseButton: true,
            customClass: { popup: "mi-alerta-stock" },
        });
        return;
    }

    // Actualizar o agregar el producto en el carrito
    const nuevoCarrito = existeEnCarrito
        ? carrito.map((item) =>
              item.id === producto.id ? { ...item, cantidad: cantidad } : item
          )
        : [...carrito, { ...producto, cantidad }];

    setCarrito(nuevoCarrito);
    localStorage.setItem("puntoDeVentaTabs", JSON.stringify(nuevoCarrito));
};
