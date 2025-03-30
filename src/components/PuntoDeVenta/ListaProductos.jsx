import React, { useRef, useEffect, useState } from "react";
import { toggleFavorito } from "./logicaFavoritos";
import { agregarAlCarrito, restarAlCarrito } from "./logicaDelCarrito";

const ListaProductosPOS = ({
    carrito,
    setCarrito,
    busqueda,
    productos,
    favoritos,
    setFavoritos,
    departments,
}) => {
    const [defaultDepartment, setDefaultDepartment] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState({});

    // Obtener el departamento predeterminado del localStorage al cargar el componente
    useEffect(() => {
        const storedDepartment = JSON.parse(
            localStorage.getItem("defaultDepartment")
        );
        if (storedDepartment) {
            setDefaultDepartment(storedDepartment);

            // Inicializar selectedDepartments con el defaultDepartment para cada producto
            const initialSelectedDepartments = {};
            if (Array.isArray(productos)) {
                productos.forEach((producto) => {
                    // Asignar el departamento predeterminado si está disponible
                    initialSelectedDepartments[producto.id] =
                        storedDepartment.id;
                });
                setSelectedDepartments(initialSelectedDepartments);
            }
        }
    }, [productos]); // Dependencia de productos para asegurar que se ejecute cuando productos cambie

    // Manejar el cambio de departamento para un producto específico
    const handleDepartmentChange = (productoId, departmentId) => {
        setSelectedDepartments((prev) => ({
            ...prev,
            [productoId]: departmentId,
        }));
    };

    const productosAMostrar =
        busqueda.length > 3
            ? productos?.filter(
                  (producto) =>
                      producto.name
                          .toLowerCase()
                          .includes(busqueda.toLowerCase()) ||
                      producto.barcode?.includes(busqueda)
              )
            : favoritos;

    const agruparStocksPorDepartamento = (stocks) => {
        const agrupado = {};

        stocks.forEach((stock) => {
            const { departmentId, quantity, department } = stock;

            if (!agrupado[departmentId]) {
                agrupado[departmentId] = {
                    departmentId,
                    departmentName: department.name,
                    totalQuantity: 0,
                };
            }

            agrupado[departmentId].totalQuantity += quantity;
        });

        return Object.values(agrupado);
    };

    const hayStockDisponible = (stocks) => {
        return stocks.some((stock) => stock.quantity > 0);
    };

    return (
        <div className="col-xl-12">
            <div
                className="row ps--scrolling-y scroll scrollHistory"
                style={{ maxHeight: "53vh", overflow: "scroll" }}
            >
                {productosAMostrar?.map((producto, indx) => (
                    <div
                        key={indx}
                        className="col-md-3 col-xl-3 p-2 cursor-pointer"
                        onClick={() => {
                            const selectedDepartment =
                                selectedDepartments[producto.id] ||
                                (defaultDepartment
                                    ? defaultDepartment.id
                                    : producto.stocks[0]?.departmentId);

                            if (selectedDepartment) {
                                agregarAlCarrito(
                                    carrito,
                                    setCarrito,
                                    producto,
                                    selectedDepartment // Pasamos directamente el departmentId
                                );
                            } else {
                                console.error(
                                    "No se ha seleccionado un departamento para este producto."
                                );
                            }
                        }}
                    >
                        <div className="card">
                            <div
                                className={`card-header hover p-1 text-center ${
                                    carrito.find(
                                        (item) => item.id === producto.id
                                    )
                                        ? "bg-dark"
                                        : ""
                                }`}
                            >
                                {carrito.find(
                                    (item) => item.id === producto.id
                                ) && (
                                    <span
                                        className="badge badge-danger pl-3 pr-3"
                                        style={{
                                            position: "absolute",
                                            top: "9px",
                                            left: "5px",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            restarAlCarrito(
                                                carrito,
                                                setCarrito,
                                                producto
                                            );
                                        }}
                                    >
                                        <i className="fas fa-minus" />
                                    </span>
                                )}
                                <div
                                    className="icon icon-shape icon-lg bg-primary shadow text-center border-radius-lg"
                                    style={{
                                        backgroundImage: producto.foto
                                            ? `url(${producto.foto})`
                                            : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    {!producto.foto && (
                                        <i className="fas fa-question-circle" />
                                    )}
                                </div>
                                {carrito.find(
                                    (item) => item.id === producto.id
                                ) && (
                                    <span className="badge badge-success navbar-badge pl-3 pr-3">
                                        {
                                            carrito.find(
                                                (item) =>
                                                    item.id === producto.id
                                            ).cantidad
                                        }
                                    </span>
                                )}
                            </div>
                            <div className="card-body pt-0 p-1 text-center">
                                <h6
                                    className="text-center mb-0"
                                    style={{ fontSize: "14px", minHeight: 20 }}
                                >
                                    {producto.name}
                                </h6>

                                {hayStockDisponible(producto.stocks || []) ? (
                                    <select
                                        className="form-control no-focus-reset border-0 bg-gradient-light"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evita que otros eventos interfieran
                                        }}
                                        onChange={(e) => {
                                            handleDepartmentChange(
                                                producto.id,
                                                e.target.value
                                            );
                                            e.target.blur(); // Reenfoca el input después de seleccionar
                                        }}
                                        value={
                                            selectedDepartments[producto.id] || // Usar el departamento seleccionado
                                            (defaultDepartment
                                                ? defaultDepartment.id
                                                : producto.stocks[0]
                                                      ?.departmentId || "") // Usar el departamento predeterminado o el primer departamento disponible
                                        }
                                        name="departmentId"
                                    >
                                        {agruparStocksPorDepartamento(
                                            producto.stocks || []
                                        ).map((department) => (
                                            <option
                                                key={department.departmentId}
                                                value={department.departmentId}
                                            >
                                                {department.departmentName} (
                                                {department.totalQuantity})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-danger">Agotado</span>
                                )}

                                <hr className="horizontal dark my-2" />
                                <h5 className="mb-0">
                                    $
                                    {Number(producto.salePrice).toLocaleString(
                                        "en-US",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                    <span
                                        className="p-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorito(
                                                producto.id,
                                                favoritos,
                                                setFavoritos
                                            );
                                        }}
                                    >
                                        <i
                                            className={`fas fa-heart ${
                                                favoritos.some(
                                                    (fav) =>
                                                        fav.id === producto.id
                                                )
                                                    ? "text-warning"
                                                    : "text-secondary"
                                            }`}
                                        />
                                    </span>
                                </h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaProductosPOS;
