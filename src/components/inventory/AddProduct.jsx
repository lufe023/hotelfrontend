import React, { useState } from "react";
import axios from "axios";
import getConfig from "../../utils/getConfig";

const AddProduct = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        barcode: "",
        costPrice: "",
        salePrice: "",
        stock: "",
        status: "active",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/items`;
            await axios.post(URL, formData, getConfig());
            setFormData({
                name: "",
                barcode: "",
                costPrice: "",
                salePrice: "",
                stock: "",
                status: "active",
            });
            onProductAdded(); // Notificar al componente padre
        } catch (err) {
            setError("Error al agregar el producto. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header pb-0">
                <h5 className="mb-3">Agregar Nuevo Producto</h5>
            </div>
            <div className="card-body">
                {error && <p className="text-danger">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Código de Barras</label>
                        <input
                            type="text"
                            className="form-control"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio de Adquisición</label>
                        <input
                            type="number"
                            className="form-control"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio de Venta</label>
                        <input
                            type="number"
                            className="form-control"
                            name="salePrice"
                            value={formData.salePrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            className="form-control"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
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
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Agregar Producto"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
