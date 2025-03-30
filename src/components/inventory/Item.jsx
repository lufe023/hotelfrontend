import axios from "axios";
import React, { useEffect, useState } from "react";
import getConfig from "../../utils/getConfig";
import moment from "moment";
import { set } from "date-fns";
import Swal from "sweetalert2";
import InventoryModal from "./InventoryModal";
import EditItemForm from "./EditItemForm";

const Item = ({ departments }) => {
    const [product, setProduct] = useState([]);
    const [searchType, setSearchType] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null); // Para el producto a editar
    const [showInventoryModal, setShowInventoryModal] = useState(false); // Estado para controlar el modal de iventario
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [sumStock, setSumStock] = useState({
        stock: 0,
        ItemId: "",
        serialNumber: "",
    });
    const getItem = (barcode, searchType) => {
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/items/${
            searchType ? "findBarcode" : "itemSearh"
        }`;
        axios
            .post(URL, { sWord: barcode }, getConfig())
            .then((res) => {
                setProduct(res.data.data.rows);
            })
            .catch((err) => {
                setProduct([]);
                console.log(err);
            });
    };

    useEffect(() => {
        if (barcode.length < 3) return;
        getItem(barcode, searchType);
    }, [barcode, searchType]);

    const handleEditClick = (prod) => {
        setSelectedProduct(prod);
    };

    const handleCloseEdit = () => {
        setSelectedProduct(null);
    };

    const handleSumStock = (dataToSend) => {
        if (!dataToSend.itemId) {
            Swal.fire("Error", "Falta el itemId", "error");
            return;
        }
        if (!dataToSend.departmentId) {
            Swal.fire("Error", "Seleccione un departamento", "error");
            return;
        }

        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/stock`;

        axios
            .post(URL, dataToSend, getConfig())
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Stock actualizado correctamente",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                setSumStock({
                    stock: 0,
                    ItemId: "",
                    serialNumber: "",
                    departmentId: "",
                    quantity: 0,
                    batchNumber: "",
                    expirationDate: "",
                    costPrice: 0,
                });
                closeInventoryModal();
                getItem(barcode, searchType);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const openInventoryModal = (itemId) => {
        setSelectedItemId(itemId);
        setShowInventoryModal(true);
    };

    const closeInventoryModal = () => {
        setShowInventoryModal(false); // Cerrar el modal
        setSelectedItemId(null); // Limpiar el itemId seleccionado
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            closeInventoryModal(); // Cerrar el modal de inventario
            handleCloseEdit(); // Cerrar el modal de edición
        }
    };

    useEffect(() => {
        // Agregar el event listener cuando el componente se monta
        window.addEventListener("keydown", handleKeyDown);

        // Eliminar el event listener cuando el componente se desmonta
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    return (
        <div className="row mb-4">
            <div className="col-md-12">
                <div className="card shadow-sm">
                    <div className="card-header pb-0">
                        <h5 className="mb-3">Item</h5>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label>Buscar Producto o Servicio</label>
                            <div className="input-group">
                                <div
                                    className="input-group-prepend"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setSearchType(!searchType)}
                                >
                                    <span className="input-group-text bg-gray-100 border-1">
                                        {searchType ? (
                                            <i className="fas fa-barcode" />
                                        ) : (
                                            <i className="fas fa-keyboard" />
                                        )}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control float-right pl-2"
                                    placeholder={
                                        searchType
                                            ? "Código de barras"
                                            : "Nombre del producto"
                                    }
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                />
                            </div>
                        </div>

                        <ul className="list-group">
                            {product.length > 0 ? (
                                product.map((prod, idx) => (
                                    <li
                                        key={idx}
                                        className="list-group-item border-0p-4 mb-2 bg-gray-100 border-radius-lg"
                                    >
                                        <div className="row">
                                            <div className="d-flex flex-column col-6 p-2">
                                                <h6 className="mb-3 text-sm">
                                                    Nombre:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {prod.name}
                                                    </span>
                                                </h6>
                                                <span className="mb-2 text-xs">
                                                    Código de barras:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {prod.barcode || "N/A"}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Stock disponible:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {prod.stock}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Stock Minimo :{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {prod.minStock || "N/A"}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Categoría:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {prod.categoryId ||
                                                            "N/A"}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Precio de adquisición:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        $
                                                        {parseFloat(
                                                            prod.costPrice
                                                        ).toFixed(2)}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Precio de venta:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        $
                                                        {parseFloat(
                                                            prod.salePrice
                                                        ).toFixed(2)}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Ganancia:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        $
                                                        {parseFloat(
                                                            prod.salePrice -
                                                                prod.costPrice
                                                        ).toFixed(2)}
                                                    </span>
                                                    {parseFloat(
                                                        prod.costPrice
                                                    ) > 0 ? (
                                                        <span className="text-dark font-weight-bold ms-sm-2">
                                                            (
                                                            {parseFloat(
                                                                (prod.salePrice /
                                                                    prod.costPrice -
                                                                    1) *
                                                                    100
                                                            ).toFixed(2)}
                                                            % )
                                                        </span>
                                                    ) : (
                                                        <span className="text-dark font-weight-bold ms-sm-2">
                                                            (N/A)
                                                        </span>
                                                    )}
                                                </span>

                                                <span className="mb-2 text-xs">
                                                    Estado:{" "}
                                                    <span
                                                        className={`text-dark font-weight-bold ms-sm-2 ${
                                                            prod.status ===
                                                            "active"
                                                                ? "text-success"
                                                                : "text-danger"
                                                        }`}
                                                    >
                                                        {prod.status ===
                                                        "active"
                                                            ? "Activo"
                                                            : "Inactivo"}
                                                    </span>
                                                </span>

                                                <span className="text-xs">
                                                    Creado en:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {moment(
                                                            prod.createdAt
                                                        ).format("DD/MM/YYYY")}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Unidad de Medina:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {prod.measurementUnit ||
                                                            "N/A"}
                                                    </span>
                                                </span>
                                                <span className="mb-2 text-xs">
                                                    Descripción:{" "}
                                                    <span className="text-dark font-weight-bold ms-sm-2">
                                                        {prod.description ||
                                                            "N/A"}
                                                    </span>
                                                </span>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-primary w-100"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                prod
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-pencil-alt" />{" "}
                                                        Editar
                                                    </button>

                                                    <button
                                                        className="btn btn-success w-100"
                                                        onClick={() =>
                                                            openInventoryModal(
                                                                prod.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-dolly-flatbed" />{" "}
                                                        Ingresar inventario
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="ms-auto  col-md-6 ">
                                                <div className="card">
                                                    <div className="card-header ">
                                                        <h5 className="mb-0 ">
                                                            Historial de
                                                            Ingresos{" "}
                                                        </h5>
                                                        <span className="text-sm">
                                                            {" "}
                                                            No se muestran Batch
                                                            en 0 y/o utilizados
                                                        </span>
                                                    </div>
                                                    <div className="card-body  p-0">
                                                        <ul
                                                            className="list-group mt-3 p-3 ps--scrolling-y  scrollHistory bg-gray-100"
                                                            style={{
                                                                height: 300,
                                                                overflowX:
                                                                    "hidden",
                                                                overflowY:
                                                                    "scroll",
                                                            }}
                                                        >
                                                            {prod.stocks.map(
                                                                (stock) => (
                                                                    <li className="list-group-item border-0 d-flex justify-content-between  mb-2 border-radius-lg p-3">
                                                                        <div className="d-flex flex-column">
                                                                            <h6 className="mb-1 text-dark font-weight-bold text-sm">
                                                                                {
                                                                                    stock
                                                                                        .department
                                                                                        .name
                                                                                }
                                                                            </h6>
                                                                            <span className="text-xs">
                                                                                Serie:{" "}
                                                                                {
                                                                                    stock.serialNumber
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs">
                                                                                Lote:{" "}
                                                                                {
                                                                                    stock.batchNumber
                                                                                }
                                                                            </span>

                                                                            <span className="text-xs">
                                                                                Agregado:{" "}
                                                                                {new Date(
                                                                                    stock.createdAt
                                                                                ).toLocaleDateString(
                                                                                    "es-ES",
                                                                                    {
                                                                                        year: "numeric",
                                                                                        month: "long",
                                                                                        day: "numeric",
                                                                                        hour: "2-digit",
                                                                                        minute: "2-digit",
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                            <span className="text-xs">
                                                                                Vence:{" "}
                                                                                {stock.expirationDate
                                                                                    ? new Date(
                                                                                          stock.expirationDate
                                                                                      ).toLocaleDateString(
                                                                                          "es-ES",
                                                                                          {
                                                                                              year: "numeric",
                                                                                              month: "long",
                                                                                              day: "numeric",
                                                                                              hour: "2-digit",
                                                                                              minute: "2-digit",
                                                                                          }
                                                                                      )
                                                                                    : "N/A"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center text-sm  font-weight-bold">
                                                                            Total:{" "}
                                                                            {
                                                                                stock.quantity
                                                                            }
                                                                        </div>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item text-center text-muted">
                                    No hay productos registrados
                                </li>
                            )}
                        </ul>
                        {showInventoryModal && (
                            <InventoryModal
                                onClose={closeInventoryModal}
                                departments={departments}
                                sumStock={sumStock}
                                setSumStock={setSumStock}
                                handleSumStock={handleSumStock}
                                itemId={selectedItemId} // Pasar el itemId seleccionado
                            />
                        )}
                        {selectedProduct && (
                            <EditItemForm
                                product={selectedProduct}
                                onClose={handleCloseEdit}
                                getItem={getItem}
                                barcode={barcode}
                                searchType={searchType}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Item;
