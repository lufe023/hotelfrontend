import React, { useState } from "react";
import {
    Button,
    Modal,
    Box,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Grid,
} from "@mui/material";
import axios from "axios";
import facturaPrinter from "./FacturaPrinter";
import getConfig from "../../utils/getConfig";
import Swal from "sweetalert2";
import { cerrarTabConfirmation, eliminarTab } from "./EliminarTab";
import { deleteTab } from "./tabsUtils";
import { useNavigate } from "react-router-dom";

const denominaciones = [2000, 1000, 500, 200, 100, 50];
const primaryColor = "#f97316";

const SeleccionMetodoPago = ({ total, tabActivo, setActiveTab }) => {
    const Navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [montoRecibido, setMontoRecibido] = useState(total);
    const [cambio, setCambio] = useState(0);
    const [denominacionSeleccionada, setDenominacionSeleccionada] =
        useState(null);
    const LOCAL_STORAGE_KEY = "puntoDeVentaTabs";
    const [tabs, setTabs] = useState(() => {
        const storedTabs = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedTabs
            ? JSON.parse(storedTabs)
            : [
                  {
                      id: 1,
                      cliente: {
                          firstName: "No registrado",
                          telefono: "1",
                          email: "",
                      },
                      carrito: [],
                      total: 0,
                  },
              ];
    });
    const handleOpen = () => {
        setMontoRecibido(total);
        setCambio(0);
        setDenominacionSeleccionada(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleMetodoPagoChange = (event) => {
        setMetodoPago(event.target.value);
        if (event.target.value === "Efectivo") {
            setMontoRecibido(total);
            setCambio(0);
            setDenominacionSeleccionada(null);
        }
    };

    const handleMontoRecibidoChange = (event) => {
        const value = event.target.value.replace(/,/g, "");
        const monto = parseFloat(value) || 0;
        setMontoRecibido(monto);
        setCambio(monto - total);
        setDenominacionSeleccionada(null);
    };

    const handleDenominacionChange = (event) => {
        const denominacion = parseInt(event.target.value);
        setDenominacionSeleccionada(denominacion);
        setMontoRecibido(denominacion);
        setCambio(denominacion - total);
    };
    const handleConfirmarPago = async () => {
        try {
            const { carrito, cliente } = tabActivo;

            // Validar que todos los productos tengan departmentId
            const productosSinDepto = carrito.filter((p) => !p.departmentId);
            if (productosSinDepto.length > 0) {
                Swal.fire({
                    title: "Error",
                    text: `Los siguientes productos no tienen departamento asignado: ${productosSinDepto
                        .map((p) => p.name)
                        .join(", ")}`,
                    icon: "error",
                });
                return;
            }

            // Preparar datos para la factura
            const facturaData = {
                cliente: {
                    firstName: cliente?.firstName || "Consumidor Final",
                    telefono: cliente?.telefono || "",
                    email: cliente?.email || "",
                    id: cliente?.id || null,
                },
                total,
                paymentMethod:
                    metodoPago === "Efectivo"
                        ? "cash"
                        : metodoPago === "Tarjeta"
                        ? "credit_card"
                        : "invoice",
                invoiceDetails: carrito.map((producto) => ({
                    itemId: producto.id,
                    itemName: producto.name,
                    itemDescription: producto.description || "",
                    quantity: producto.cantidad,
                    unitPrice: producto.salePrice,
                    totalPrice: producto.cantidad * producto.salePrice,
                    departmentId: producto.departmentId,
                    orderType: producto.orderType || "product", // Asegúrate que esto viene del carrito
                })),
            };

            // Enviar al backend
            const response = await axios.post(
                `${import.meta.env.VITE_API_SERVER}/api/v1/invoice`,
                facturaData,
                getConfig()
            );

            // Éxito
            Swal.fire({
                title: "Venta exitosa",
                text: `Factura #${response.data.invoiceNumber} creada`,
                icon: "success",
            });
            facturaPrinter(facturaData);
            // Cerrar modal y limpiar
            handleClose();

            //id, tabs, setTabs, setActiveTab

            deleteTab(tabActivo.id);
            Navigate(0);

            //eliminarTab(tabActivo.id, tabs, setTabs, setActiveTab);
        } catch (error) {
            handleClose();
            const errorMsg =
                error.response?.data?.errors?.join("\n") ||
                error.response?.data?.error ||
                error.message;

            Swal.fire({
                title: "Error",
                text: errorMsg || "Error al procesar la factura",
                icon: "error",
            });
        }
    };

    const denominacionesFiltradas = denominaciones.filter(
        (denominacion) => denominacion >= total
    );

    return (
        <div>
            <button className="btn btn-success w-100" onClick={handleOpen}>
                Finalizar Venta
            </button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: 400 }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                        Seleccionar Método de Pago
                    </Typography>

                    <FormControl component="fieldset" fullWidth>
                        <FormLabel
                            component="legend"
                            sx={{
                                fontWeight: "bold",
                                color: "text.primary",
                                mb: 1,
                            }}
                        >
                            Método de Pago
                        </FormLabel>
                        <RadioGroup
                            value={metodoPago}
                            onChange={handleMetodoPagoChange}
                        >
                            <FormControlLabel
                                value="Efectivo"
                                control={
                                    <Radio
                                        sx={{
                                            color: primaryColor,
                                            "&.Mui-checked": {
                                                color: primaryColor,
                                            },
                                        }}
                                    />
                                }
                                label="Efectivo"
                            />
                            <FormControlLabel
                                value="Tarjeta"
                                control={
                                    <Radio
                                        sx={{
                                            color: primaryColor,
                                            "&.Mui-checked": {
                                                color: primaryColor,
                                            },
                                        }}
                                    />
                                }
                                label="Tarjeta"
                            />
                            <FormControlLabel
                                value="Factura"
                                control={
                                    <Radio
                                        sx={{
                                            color: primaryColor,
                                            "&.Mui-checked": {
                                                color: primaryColor,
                                            },
                                        }}
                                    />
                                }
                                label="Factura"
                            />
                        </RadioGroup>
                    </FormControl>

                    {metodoPago === "Efectivo" && (
                        <>
                            <TextField
                                label="Monto Recibido"
                                type="text"
                                fullWidth
                                value={montoRecibido.toLocaleString("en-US")}
                                onChange={handleMontoRecibidoChange}
                                sx={{ mt: 2 }}
                            />
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mt: 1 }}
                            >
                                Cambio: RD$
                                {Number(cambio).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </Typography>

                            <FormControl
                                component="fieldset"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                <FormLabel
                                    component="legend"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "text.primary",
                                        mb: 1,
                                    }}
                                >
                                    Billete
                                </FormLabel>
                                <RadioGroup
                                    value={denominacionSeleccionada}
                                    onChange={handleDenominacionChange}
                                >
                                    <Grid container spacing={1}>
                                        {denominacionesFiltradas.map(
                                            (denominacion) => (
                                                <Grid
                                                    item
                                                    xs={4}
                                                    key={denominacion}
                                                >
                                                    <FormControlLabel
                                                        value={denominacion}
                                                        control={
                                                            <Radio
                                                                sx={{
                                                                    color: primaryColor,
                                                                    "&.Mui-checked":
                                                                        {
                                                                            color: primaryColor,
                                                                        },
                                                                }}
                                                            />
                                                        }
                                                        label={`RD$${Number(
                                                            denominacion
                                                        ).toLocaleString(
                                                            "en-US"
                                                        )}`}
                                                    />
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </RadioGroup>
                            </FormControl>
                        </>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px",
                            marginTop: "16px",
                        }}
                    >
                        <button
                            className="btn btn-danger w-50"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary w-50"
                            onClick={handleConfirmarPago}
                        >
                            Confirmar
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    p: 4,
    borderRadius: "10px",
};

export default SeleccionMetodoPago;
