import React, { useState } from 'react';
import { Button, Modal, Box, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid } from '@mui/material';

const denominaciones = [2000, 1000, 500, 200, 100, 50]; // Denominaciones de billetes de R.D.

// Color primario personalizado
const primaryColor = '#f97316';

const SeleccionMetodoPago = ({ total, onPagoConfirmado }) => {
  const [open, setOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [montoRecibido, setMontoRecibido] = useState(total); // Inicializado con el total
  const [cambio, setCambio] = useState(0);
  const [denominacionSeleccionada, setDenominacionSeleccionada] = useState(null);

  const handleOpen = () => {
    setMontoRecibido(total); // Restablecer el montoRecibido al total al abrir el modal
    setCambio(0);
    setDenominacionSeleccionada(null); // Restablecer la denominación seleccionada
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
    if (event.target.value === 'Efectivo') {
      setMontoRecibido(total); // Restablecer el montoRecibido al total
      setCambio(0);
      setDenominacionSeleccionada(null); // Restablecer la denominación seleccionada
    }
  };

  const handleMontoRecibidoChange = (event) => {
    const value = event.target.value;
    // Eliminar separadores de miles y convertir a número
    const monto = parseFloat(value.replace(/,/g, '')) || 0;
    setMontoRecibido(monto);
    setCambio(monto - total);
    setDenominacionSeleccionada(null); // Deseleccionar la denominación si se ingresa un monto manual
  };

  const handleDenominacionChange = (event) => {
    const denominacion = parseInt(event.target.value);
    setDenominacionSeleccionada(denominacion);
    setMontoRecibido(denominacion); // Actualizar el montoRecibido con la denominación seleccionada
    setCambio(denominacion - total); // Calcular el cambio
  };

  const handleConfirmarPago = () => {
    if (metodoPago === 'Efectivo' && montoRecibido < total) {
      alert('El monto recibido es insuficiente.');
      return;
    }
    onPagoConfirmado(montoRecibido, cambio, denominacionSeleccionada);
    handleClose();
  };

  // Filtrar denominaciones que sean mayores o iguales al total
  const denominacionesFiltradas = denominaciones.filter(denominacion => denominacion >= total);

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: primaryColor,
          borderRadius: '12px',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#e65c0d' }, // Color más oscuro al hacer hover
        }}
        onClick={handleOpen}
      >
        Finalizar Venta
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 400, borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
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
                sx={{ color: 'text.primary' }}
              />
              <FormControlLabel
                value="Tarjeta"
                control={<Radio sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }} />}
                label="Tarjeta"
                sx={{ color: 'text.primary' }}
              />
              <FormControlLabel
                value="Factura"
                control={<Radio sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }} />}
                label="Factura"
                sx={{ color: 'text.primary' }}
              />
            </RadioGroup>
          </FormControl>
          {metodoPago === 'Efectivo' && (
            <>
              <TextField
                label="Monto Recibido"
                type="text" // Cambiado a tipo "text"
                fullWidth
                value={montoRecibido.toLocaleString("en-US")} // Formatear con separadores de miles
                onChange={handleMontoRecibidoChange}
                sx={{ mt: 2, borderRadius: '12px' }}
                autoFocus={true}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Cambio: ${Number(cambio).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                          label={`$${Number(denominacion).toLocaleString("en-US")}`}
                          sx={{ color: 'text.primary' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                mr: 1,
                backgroundColor: 'error.main',
                borderRadius: '12px',
                fontWeight: 'bold',
                borderColor: primaryColor,
              }}
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                borderRadius: '12px',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#e65c0d' }, // Color más oscuro al hacer hover
              }}
              onClick={handleConfirmarPago}
            >
              Confirmar
            </Button>
          </Box>
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
  borderRadius: '16px',
};

export default SeleccionMetodoPago;