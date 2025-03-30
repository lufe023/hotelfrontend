import React from "react";

const InventoryModal = ({
    onClose,
    departments,
    sumStock,
    setSumStock,
    handleSumStock,
    itemId,
}) => {
    // Función para manejar el envío del formulario
    const handleSubmit = () => {
        console.log("ItemId en handleSubmit:", itemId); // Verificar itemId
        if (!itemId) {
            Swal.fire("Error", "Falta el itemId", "error");
            return;
        }

        const dataToSend = {
            ...sumStock,
            itemId: itemId, // Asegurar que itemId esté presente
        };

        if (!sumStock.expirationDate) {
            delete dataToSend.expirationDate;
        }

        handleSumStock(dataToSend);
    };
    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sumar al Inventario</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={onClose}
                        >
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <h6 className="mb-3 text-sm">
                                Sumar al Inventario
                            </h6>
                            <span className="text-xs">
                                Departamento al que van a ir los productos
                            </span>
                            <select
                                className="form-control mt-2 mb-2"
                                name="departmentId"
                                value={sumStock.departmentId}
                                onChange={(e) =>
                                    setSumStock((prev) => ({
                                        ...prev,
                                        departmentId: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Selecciona</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.id}>
                                        {dep.name}
                                    </option>
                                ))}
                            </select>

                            <span className="text-xs mb-2">
                                Cantidad a sumar
                            </span>
                            <input
                                type="number"
                                className="form-control mt-2"
                                value={sumStock.quantity}
                                onChange={(e) =>
                                    setSumStock((prev) => ({
                                        ...prev,
                                        quantity: Number(e.target.value),
                                        ItemId: itemId,
                                    }))
                                }
                                min="1"
                                placeholder="Cantidad"
                            />

                            <span className="text-xs mb-2">
                                Número de Lote / Referencia
                            </span>
                            <input
                                type="text"
                                className="form-control mt-2"
                                value={sumStock.batchNumber}
                                onChange={(e) =>
                                    setSumStock((prev) => ({
                                        ...prev,
                                        batchNumber: e.target.value,
                                        ItemId: itemId,
                                    }))
                                }
                                placeholder="Lote"
                            />

                            <span className="text-xs mb-2">
                                Fecha de Vencimiento
                            </span>
                            <input
                                type="date"
                                className="form-control mt-2"
                                value={sumStock.expirationDate || ""} // Asegurar que esté vacío si no hay valor
                                onChange={(e) =>
                                    setSumStock((prev) => ({
                                        ...prev,
                                        expirationDate: e.target.value || null, // Guardar null si está vacío
                                    }))
                                }
                                placeholder="Lote"
                            />

                            <span className="text-xs mb-2">
                                Precio de Adquisición
                            </span>
                            <input
                                type="float"
                                className="form-control mt-2"
                                value={sumStock.costPrice}
                                onChange={(e) =>
                                    setSumStock((prev) => ({
                                        ...prev,
                                        costPrice: e.target.value,
                                        ItemId: itemId,
                                    }))
                                }
                                placeholder="Precio de Adquisición"
                            />
                            <button
                                className="btn btn-success mt-3"
                                onClick={handleSubmit} // Usar handleSubmit en lugar de handleSumStock directamente
                            >
                                Sumar Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;
