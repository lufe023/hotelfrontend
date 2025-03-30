import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import getConfig from "../../utils/getConfig";

const EditItemForm = ({ product, onClose, getItem, barcode, searchType }) => {
    const [formData, setFormData] = useState({
        name: product.name,
        categoryId: product.categoryId,
        costPrice: product.costPrice,
        description: product.description,
        measurementUnit: product.measurementUnit,
        minStock: product.minStock,
        salePrice: product.salePrice,
        status: product.status,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/items/${
            product.id
        }`;

        axios
            .put(URL, formData, getConfig())
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: `Item actualizado exitosamente`,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                onClose();
                getItem(barcode, searchType);
            })
            .catch((err) => {
                console.log(err);
                alert("Error al actualizar el producto");
            });
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Producto</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={onClose}
                        >
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Categoría</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="categoryId"
                                    value={formData.categoryId || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Precio de adquisición</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="costPrice"
                                    value={formData.costPrice}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Unidad de medida</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="measurementUnit"
                                    value={formData.measurementUnit || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Stock mínimo</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minStock"
                                    value={formData.minStock}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Precio de venta</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="salePrice"
                                    value={formData.salePrice}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    className="form-control"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary mt-3"
                            >
                                Guardar Cambios
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger mt-3 ml-3"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditItemForm;
