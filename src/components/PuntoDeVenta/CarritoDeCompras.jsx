import React, { useState, useEffect, useRef } from "react";
import {
    agregarAlCarrito,
    agregarCantidadAlCarrito,
    obtenerCantidadTotalEnCarritos,
    playErrorSound,
    restarAlCarrito,
} from "./logicaDelCarrito";
import Swal from "sweetalert2";

const CarritoPOS = ({ carrito, setCarrito, setTotal }) => {
    const [cantidadInput, setCantidadInput] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [cardHeight, setCardHeight] = useState(null);
    const cardRef = useRef(null);
    const headerRef = useRef(null);
    const bodyRef = useRef(null);
    const HEADER_HEIGHT = 60; // Altura fija del header
    const MAX_EXPANDED_HEIGHT = 480; // Altura máxima cuando está expandido

    const [isAnimating, setIsAnimating] = useState(false);

    const toggleCollapse = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        if (!isCollapsed) {
            // Al colapsar: animar a la altura del header
            setCardHeight(HEADER_HEIGHT);
        } else {
            // Al expandir: calcular altura del contenido
            const contentHeight = bodyRef.current.scrollHeight;
            const calculatedHeight = Math.min(
                HEADER_HEIGHT + contentHeight,
                MAX_EXPANDED_HEIGHT
            );
            setCardHeight(calculatedHeight);
        }

        setIsCollapsed(!isCollapsed);
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Efecto para calcular altura inicial
    useEffect(() => {
        if (bodyRef.current) {
            const contentHeight = bodyRef.current.scrollHeight;
            const calculatedHeight = Math.min(
                HEADER_HEIGHT + contentHeight,
                MAX_EXPANDED_HEIGHT
            );
            setCardHeight(calculatedHeight);
        }
    }, [carrito]);

    useEffect(() => {
        // Inicializar los valores del input con las cantidades actuales
        const cantidadesIniciales = carrito.reduce((acc, item) => {
            acc[item.id] = item.cantidad;
            return acc;
        }, {});
        setCantidadInput(cantidadesIniciales);
    }, [carrito]);

    const eliminarProducto = (id) => {
        const nuevoCarrito = carrito.filter((item) => item.id !== id);
        setCarrito(nuevoCarrito);
    };

    const calcularTotal = (nuevoCarrito) => {
        const total = nuevoCarrito.reduce(
            (acc, item) => acc + Number(item.salePrice) * item.cantidad,
            0
        );
        setTotal(total);
    };

    const actualizarCantidad = (producto, nuevaCantidad) => {
        const cantidadFinal = Math.max(1, Number(nuevaCantidad)); // Asegurar que no sea menor a 1

        // Validar y actualizar la cantidad en el carrito
        agregarCantidadAlCarrito(carrito, setCarrito, producto, cantidadFinal);

        // Actualizar el estado del input
        setCantidadInput((prev) => ({ ...prev, [producto.id]: cantidadFinal }));
    };

    // Manejar cambios en el input sin afectar inmediatamente el carrito
    const manejarCambioInput = (producto, valor) => {
        const cantidad = parseInt(valor) || "";
        setCantidadInput((prev) => ({ ...prev, [producto.id]: cantidad }));
    };

    //Aplicar el cambio real cuando el usuario salga del input
    const manejarBlur = (producto) => {
        // Obtener el departmentId del producto en el carrito
        const departmentId = producto.departmentId;
        // Obtener la cantidad total del producto en todos los carritos (incluyendo este)
        const { cantidadTotal } = obtenerCantidadTotalEnCarritos(producto.id);

        // Obtener la cantidad actual en el carrito actual (usando el prop 'carrito')
        const productoEnCarritoActual = carrito.find(
            (item) => item.id === producto.id
        );
        const cantidadActual = productoEnCarritoActual
            ? productoEnCarritoActual.cantidad
            : 0;

        // Calcular la cantidad en otros carritos
        const cantidadOtros = cantidadTotal - cantidadActual;

        // Calcular el stock disponible en el departamento seleccionado
        const stockDepartamento = producto.stocks
            .filter((stock) => stock.departmentId === departmentId) // Filtrar por departamento
            .reduce((total, stock) => total + stock.quantity, 0); // Sumar las cantidades

        // La cantidad máxima que puede haber en este carrito es:
        // stock del departamento menos lo que ya está en otros carritos
        const maxAllowedInCurrentCart = stockDepartamento - cantidadOtros;

        // La cantidad solicitada por el usuario (valor del input)
        const cantidadSolicitada = Number(cantidadInput[producto.id]) || 0;

        // Si la cantidad solicitada supera lo permitido, se ajusta
        let cantidadFinal = cantidadSolicitada;
        if (cantidadFinal > maxAllowedInCurrentCart) {
            cantidadFinal = maxAllowedInCurrentCart;
            playErrorSound();
            const alert = () => {
                Swal.fire({
                    title: "Stock insuficiente",
                    text: `Solo puedes tener hasta ${maxAllowedInCurrentCart} unidades en este carrito.`,
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#22c55e",
                    allowOutsideClick: true,
                });
            };

            setTimeout(() => {
                alert();
            }, 100);
        }

        // Actualizamos el estado local del input y el carrito actual
        setCantidadInput((prev) => ({ ...prev, [producto.id]: cantidadFinal }));
        actualizarCantidad(producto, cantidadFinal);
    };

    useEffect(() => {
        calcularTotal(carrito);
    }, [carrito]);

    return (
        <div
            ref={cardRef}
            className={`card carrito-card ${
                isCollapsed ? "collapsed-card" : ""
            }`}
            style={{
                height: `${cardHeight}px`,
                overflow: "hidden",

                transition: isAnimating
                    ? "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    : "none",
            }}
        >
            <div
                ref={headerRef}
                className="card-header p-3"
                style={{
                    height: `${HEADER_HEIGHT}px `,
                }}
            >
                <h6 className="card-title">
                    Comanda{" "}
                    {carrito.length > 0 && (
                        <span className="badge bg-primary">
                            {carrito.length}
                        </span>
                    )}
                </h6>
                <div className="card-tools">
                    <button
                        className="btn  bg-primary btn-sm mr-2"
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? (
                            <i className="fas fa-plus" />
                        ) : (
                            <i className="fas fa-minus" />
                        )}
                    </button>
                </div>
            </div>

            <div
                ref={bodyRef}
                className="carrito-body p-3"
                style={{
                    height: `calc(100% - ${HEADER_HEIGHT}px)`,
                    opacity: isCollapsed ? 0 : 1,
                    transition: "opacity 0.2s ease",
                    overflowY: "hidden",
                }}
            >
                {carrito.length === 0 ? (
                    <ul
                        className="list-group ps--scrolling-y scroll scrollHistory"
                        style={{ height: "44vh", overflow: "scroll" }}
                    >
                        <p>Vacio</p>
                    </ul>
                ) : (
                    <ul
                        className="list-group ps--scrolling-y scroll scrollHistory"
                        style={{ height: "44vh", overflow: "scroll" }}
                    >
                        {carrito.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex align-items-start pb-4 pt-4"
                            >
                                <div
                                    className="col-7 d-flex flex-column justify-content-between"
                                    style={{ minHeight: "100%" }}
                                >
                                    <div>
                                        <span className="d-block">
                                            {item.name}
                                        </span>
                                        <small style={{ fontSize: "0.8rem" }}>
                                            $
                                            {Number(
                                                item.salePrice
                                            ).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}{" "}
                                            x{item.cantidad} = $
                                            {Number(
                                                item.salePrice * item.cantidad
                                            ).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </small>
                                    </div>
                                    <button
                                        className="btn btn-danger px-3 mt-2 align-self-start"
                                        onClick={() =>
                                            eliminarProducto(item.id)
                                        }
                                    >
                                        <i className="fas fa-trash"></i>{" "}
                                        Eliminar
                                    </button>
                                </div>

                                <div className="col-5 d-flex flex-column justify-content-between align-items-center">
                                    <a
                                        className="btn btn-dark cursor-pointer w-100 mb-2"
                                        onClick={() =>
                                            agregarAlCarrito(
                                                carrito,
                                                setCarrito,
                                                item,
                                                item.departmentId
                                            )
                                        }
                                    >
                                        <i className="fas fa-plus-square" />
                                    </a>

                                    {/*Input de cantidad corregido */}
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control form-control-sm mx-2 text-center w-100 mb-2"
                                        value={cantidadInput[item.id] || ""}
                                        onChange={(e) =>
                                            manejarCambioInput(
                                                item,
                                                e.target.value
                                            )
                                        }
                                        onBlur={() => manejarBlur(item)}
                                        onKeyDown={(e) =>
                                            e.key == "Enter"
                                                ? manejarBlur(item)
                                                : ""
                                        }
                                    />

                                    {item.cantidad > 1 ? (
                                        <a
                                            className="btn btn-danger cursor-pointer w-100"
                                            onClick={() =>
                                                restarAlCarrito(
                                                    carrito,
                                                    setCarrito,
                                                    item
                                                )
                                            }
                                        >
                                            <i className="fas fa-minus-square" />
                                        </a>
                                    ) : (
                                        <a className="btn btn-dark cursor-pointer w-100 disabled">
                                            <i className="fas fa-minus-square" />
                                        </a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CarritoPOS;
