import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid } from '@mui/material';
import axios from 'axios';
import facturaPrinter from './FacturaPrinter'; // 
import getConfig from '../../utils/getConfig';
import { ta } from 'date-fns/locale';
import { agregarCantidadAlCarrito } from './logicaDelCarrito';
import Swal from 'sweetalert2';

const denominaciones = [2000, 1000, 500, 200, 100, 50]; // Denominaciones de billetes de R.D.

const primaryColor = '#f97316';

const SeleccionMetodoPago = ({ total, onPagoConfirmado, tabActivo }) => {
  const [open, setOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [montoRecibido, setMontoRecibido] = useState(total);
  const [cambio, setCambio] = useState(0);
  const [denominacionSeleccionada, setDenominacionSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Obtener datos desde localStorage
    const storedData = localStorage.getItem('puntoDeVentaTabs');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProductos(parsedData[0]?.carrito || []);
      } catch (error) {
        console.error('Error al parsear los productos del localStorage:', error);
      }
    }
  }, []);

  const handleOpen = () => {
    setMontoRecibido(total);
    setCambio(0);
    setDenominacionSeleccionada(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
    if (event.target.value === 'Efectivo') {
      setMontoRecibido(total);
      setCambio(0);
      setDenominacionSeleccionada(null);
    }
  };

  const handleMontoRecibidoChange = (event) => {
    const value = event.target.value.replace(/,/g, '');
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

  const handleConfirmarPago = () => {
    if (metodoPago === 'Efectivo' && montoRecibido < total) {
      alert('El monto recibido es insuficiente.');
      return;
    }

const primeraVenta = tabActivo;

    const facturaData = {
      cliente: primeraVenta.cliente || { firstName: "", telefono: "", email: "" },
      total: primeraVenta.total || 0, // Usamos el total del localStorage directamente
      paymentMethod: 'cash',
      // userId: primeraVenta.cliente?.id,
      invoiceDetails: (primeraVenta.carrito || []).map(p => ({
        itemId: p.id,
        itemName: p.name,
        itemDescription: p.description,
        quantity: p.cantidad,
        unitPrice: p.salePrice,
        totalPrice: p.cantidad * p.salePrice,
        orderType: 'product',
        status: 'served',
    
      }))
    };

    console.log('FacturaData:', facturaData);

    axios
      .post(`${import.meta.env.VITE_API_SERVER}/api/v1/invoice`, facturaData, getConfig())
      .then((response) => {
        console.log('Factura enviada con éxito:', response);
        onPagoConfirmado(montoRecibido, cambio, denominacionSeleccionada);
        // Llamar al componente FacturaPrinter después de confirmar el pago
        facturaPrinter(facturaData);
        handleClose();
      })
      .catch((error) => {
        console.error('Error al procesar la factura:', error);
        handleClose();
      
        // Obtener el mensaje de error del backend si está disponible
        const errorMessage = error?.response?.data?.error || error.message || 'Error desconocido';
      
        if (errorMessage.includes('Stock insuficiente')) {
          const match = errorMessage.match(/id:([\w-]+)\. nombrado: (.+?)\. Disponible: (\d+), solicitado: (\d+)/);
          if (match) {
              const productId = match[1];
              const nombreProducto = match[2];
              const disponible = parseInt(match[3], 10);
              const solicitado = parseInt(match[4], 10);
      
              const mensaje = `Stock insuficiente para el producto "${nombreProducto}". Disponible: ${disponible}, solicitado: ${solicitado}.`;
      
              Swal.fire({
                  title: "Stock insuficiente",
                  text: mensaje,
                  icon: "warning"
              });
          }
      } else {
          console.log('Error desconocido:', errorMessage);
          alert('Error de conexión con el servidor.');
      }
      
      });
      
      
      
  };

  const denominacionesFiltradas = denominaciones.filter((denominacion) => denominacion >= total);

  return (
    <div>
      <button className="btn btn-success w-100" onClick={handleOpen}>
        Finalizar Venta
      </button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Seleccionar Método de Pago
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
              Método de Pago
            </FormLabel>
            <RadioGroup value={metodoPago} onChange={handleMetodoPagoChange}>
              <FormControlLabel
                value="Efectivo"
                control={<Radio sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }} />}
                label="Efectivo"
              />
              <FormControlLabel
                value="Tarjeta"
                control={<Radio sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }} />}
                label="Tarjeta"
              />
              <FormControlLabel
                value="Factura"
                control={<Radio sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }} />}
                label="Factura"
              />
            </RadioGroup>
          </FormControl>
          {metodoPago === 'Efectivo' && (
            <>
              <TextField
                label="Monto Recibido"
                type="text"
                fullWidth
                value={montoRecibido.toLocaleString('en-US')}
                onChange={handleMontoRecibidoChange}
                sx={{ mt: 2 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Cambio: ${Number(cambio).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                  Billete
                </FormLabel>
                <RadioGroup value={denominacionSeleccionada} onChange={handleDenominacionChange}>
                  <Grid container spacing={1}>
                    {denominacionesFiltradas.map((denominacion) => (
                      <Grid item xs={4} key={denominacion}>
                        <FormControlLabel
                          value={denominacion}
                          control={<Radio sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }} />}
                          label={`$${Number(denominacion).toLocaleString('en-US')}`}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button className="btn btn-danger w-50" onClick={handleClose}>
              Cancelar
            </button>
            <button className="btn btn-primary w-50" onClick={handleConfirmarPago}>
              Confirmar
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  p: 4,
  borderRadius: '10px',
};

export default SeleccionMetodoPago;
