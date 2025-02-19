import React from "react";
import { toggleFavorito } from "./logicaFavoritos";
import { agregarAlCarrito, restarAlCarrito } from "./logicaDelCarrito";

const ListaProductosPOS = ({ carrito, setCarrito, busqueda, productos, favoritos, setFavoritos} ) => {

    const productosAMostrar = busqueda.length > 3 ? productos?.filter((producto) =>
        producto.name.toLowerCase().includes(busqueda.toLowerCase()) || producto.barcode?.includes(busqueda)
    ) : favoritos;

    return (
        <div className="col-xl-12">
            <div className="row ps--scrolling-y scroll scrollHistory" style={{ maxHeight: "53vh", overflow: "scroll" }}>
                {productosAMostrar?.map((producto, indx) => (
                    <div key={indx} className="col-md-3 col-xl-3 p-2 cursor-pointer" onClick={() => agregarAlCarrito(carrito, setCarrito, producto)}>
                        <div className="card">
                            <div className={`card-header hover p-1 text-center ${carrito.find((item) => item.id === producto.id) ? "bg-dark" : ""}`}>
                                {carrito.find((item) => item.id === producto.id) && (
                                    <span
                                        className="badge badge-danger pl-3 pr-3"
                                        style={{ position: "absolute", top: "9px", left: "5px" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            restarAlCarrito(carrito, setCarrito, producto);
                                        }}
                                    >
                                        <i className="fas fa-minus" />
                                    </span>
                                )}
                                <div
                                    className="icon icon-shape icon-lg bg-primary shadow text-center border-radius-lg"
                                    style={{
                                        backgroundImage: producto.foto ? `url(${producto.foto})` : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    {!producto.foto && <i className="fas fa-question-circle" />}
                                </div>
                                {carrito.find((item) => item.id === producto.id) && (
                                    <span className="badge badge-success navbar-badge pl-3 pr-3">
                                        {carrito.find((item) => item.id === producto.id).cantidad}
                                    </span>
                                )}
                            </div>
                            <div className="card-body pt-0 p-1 text-center">
                                <h6 className="text-center mb-0" style={{ fontSize: "14px", minHeight:43 }}>
                                    {producto.name}
                                </h6>
                                <hr className="horizontal dark my-3" />
                                <h5 className="mb-0">
                                    ${Number(producto.salePrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    <span
                                        className="p-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorito(producto.id, favoritos, setFavoritos);
                                        }}
                                    >
                                        <i className={`fas fa-heart ${favoritos.some((fav) => fav.id === producto.id) ? "text-warning" : "text-secondary"}`} />
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