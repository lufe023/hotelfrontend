import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import getConfig from "../../utils/getConfig";

const OpcionesPOS = ({ total, cliente, setCliente,  metodoPago, setMetodoPago }) => {
  //const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [cambio, setCambio] = useState(0);
  const [facturasPendientes, setFacturasPendientes] = useState([
    { id: 1, total: 1200 },
    { id: 2, total: 800 },
  ]); // Simulación de facturas

  const findPeople = async (findWord, updateList) => {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/users/userSearch`;
    try {
      const res = await axios.post(URL, { findUser: findWord }, getConfig());
      updateList(res.data.data.rows);
    } catch (err) {
      console.error(err);
      updateList([]);
    }
  };

  const handleBuscarCliente = () => {
    Swal.fire({
      title: "Buscar Cliente",
      html: `
        <div class="form-group">
          <input 
            type="text" 
            id="buscar-cliente-input" 
            class="form-control" 
            placeholder="Buscar persona por Nombre, apellido o teléfono" 
          />
        </div>
        <ul id="buscar-cliente-list" class="list-group mt-3" style="min-height: 330px; overflow-y: auto;">
        </ul>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        const input = document.getElementById("buscar-cliente-input");
        const list = document.getElementById("buscar-cliente-list");
        const now = new Date();
  
        const updateList = (users) => {
          list.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos
  
          users.forEach((user) => {
            // Verificar si el cliente tiene una reserva aprobada dentro de la fecha actual
            const reservation = user.reservations?.find(
              (res) =>
                res.status === "Approved" &&
                new Date(res.checkIn) <= now && // Cambié `startDate` a `checkIn`
                new Date(res.checkOut) >= now // Cambié `endDate` a `checkOut`
            );
  
            // Crear un elemento de lista para el cliente
            const item = document.createElement("li");
            item.className = `list-group-item d-flex text-left hover cursor-pointer`;
  
            item.innerHTML = `
              <div class="avatar me-3">
                <img 
                  src="${user.picture || `${import.meta.env.VITE_API_SERVER}/api/v1/images/images/nobody.jpg`}" 
                  alt="Avatar" 
                  class="border-radius-lg shadow" 
                  width="50" 
                />
              </div>
              <div>
                <h6 class="mb-0 text-sm">${user.firstName || "Sin nombre"}</h6>
                ${
                  reservation
                    ? `
                    <p class="mb-0 text-xs">Habitación: ${reservation.room?.roomNumber || "N/A"}</p>
                    <p class="mb-0 text-xs">Tipo: ${reservation.room?.roomType || "N/A"}</p>
                  `
                    : `<p class="mb-0 text-xs">Teléfono: ${user.phone || "No disponible"}</p>`
                }
              </div>
            `;
  
            // Agregar evento al hacer clic en el cliente
            item.addEventListener("click", () => {
              setCliente({ ...user }); // Seleccionar cliente y cerrar el modal
              Swal.close();
            });
  
            // Agregar el cliente a la lista
            list.appendChild(item);
          });
        };
  
        // Escuchar eventos de entrada en el input de búsqueda
        input.addEventListener("input", (e) => {
          const searchWord = e.target.value.trim();
          if (searchWord) {
            findPeople(searchWord, updateList); // Buscar personas y actualizar la lista
          } else {
            updateList([]); // Limpiar la lista si no hay búsqueda
          }
        });
      },
    });
  };
  

  const seleccionarMetodoPago = () => {
    Swal.fire({
      title: "Seleccionar Método de Pago",
      html: `
        <div class="form-group text-start">
          <div class="form-check">
            <input type="radio" class="form-check-input" id="metodo-efectivo" name="metodo-pago" value="Efectivo">
            <label class="form-check-label" for="metodo-efectivo">
              <i class="fas fa-money-bill-wave me-2 text-success" style="font-size: 2rem;"></i>Efectivo
            </label>
          </div>
          <div class="form-check mt-3">
            <input type="radio" class="form-check-input" id="metodo-tarjeta" name="metodo-pago" value="Tarjeta">
            <label class="form-check-label" for="metodo-tarjeta">
              <i class="fas fa-credit-card me-2 text-primary" style="font-size: 2rem;"></i>Tarjeta
            </label>
          </div>
          <div class="form-check mt-3">
            <input type="radio" class="form-check-input" id="metodo-factura" name="metodo-pago" value="Factura">
            <label class="form-check-label" for="metodo-factura">
              <i class="fas fa-receipt me-2 text-warning" style="font-size: 2rem;"></i>Factura
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Seleccionar",
      preConfirm: () => {
        const radios = document.querySelectorAll("input[name='metodo-pago']");
        let selectedValue = "";
        radios.forEach((radio) => {
          if (radio.checked) {
            selectedValue = radio.value;
          }
        });
        if (!selectedValue) {
          Swal.showValidationMessage("Por favor selecciona un método de pago.");
        }
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setMetodoPago(result.value);
      }
    });
  };

  const finalizarVenta = () => {
    if (!metodoPago) {
      Swal.fire("Error", "Seleccione un método de pago.", "error");
      return;
    }

    if (metodoPago === "Efectivo") {
      Swal.fire({
        title: "Pago en Efectivo",
        input: "number",
        inputLabel: "¿Cuánto pagó el cliente?",
        inputPlaceholder: "Ingrese el monto recibido",
        inputValue:  Math.ceil(total),
        inputAutoFocus: true,
        showCancelButton: true,
        confirmButtonText: "Calcular Cambio",
        preConfirm: (value) => {
          if (!value || isNaN(value) || value < total) {
            Swal.showValidationMessage("El monto ingresado es inválido o insuficiente.");
          }
          return value;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setCambio(result.value - total);
        }
      });
    } else if (metodoPago === "Factura") {
      Swal.fire({
        title: "Facturas Pendientes",
        html: `
          <div class="form-group">
            <label for="facturas-select">Selecciona una factura:</label>
            <select id="facturas-select" class="form-control">
              <option value="">Nueva Factura</option>
              ${facturasPendientes
                .map((factura) => `<option value="${factura.id}">Factura #${factura.id} - Total: $${factura.total}</option>`)
                .join("")}
            </select>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Agregar Total",
        preConfirm: () => {
          const facturaSeleccionada = document.getElementById("facturas-select").value;
          return facturaSeleccionada;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const facturaSeleccionada = result.value;
          if (facturaSeleccionada) {
            const factura = facturasPendientes.find((f) => f.id.toString() === facturaSeleccionada);
            Swal.fire("Factura Actualizada", `Total agregado a la factura #${factura.id}`, "success");
          } else {
            Swal.fire("Nueva Factura", `Se ha creado una nueva factura por $${total.toFixed(2)}`, "success");
          }
        }
      });
    } else {
      Swal.fire("Venta Finalizada", `Total: $${total.toFixed(2)}`, "success");
    }
  };

  const metodoPagoIcono = () => {
    switch (metodoPago) {
      case "Efectivo":
        return <i className="fas fa-money-bill-wave text-success me-2" style={{ fontSize: "2rem" }}></i>;
      case "Tarjeta":
        return <i className="fas fa-credit-card text-primary me-2" style={{ fontSize: "2rem" }}></i>;
      case "Factura":
        return <i className="fas fa-receipt text-warning me-2" style={{ fontSize: "2rem" }}></i>;
      default:
        return null;
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
  <a className="btn btn-primary w-100 mb-3" onClick={handleBuscarCliente}>
    Cliente
  </a>

  {cliente && (
    <div className="d-flex align-items-center mb-3 border-radius-lg p-3 border" onClick={handleBuscarCliente}>
      <div className="avatar me-3">
        <img
          src={cliente.picture || `${import.meta.env.VITE_API_SERVER}/api/v1/images/images/nobody.jpg`}
          alt="Avatar del usuario"
          className="border-radius-lg shadow"
        />
      </div>
      <div className="d-flex align-items-start flex-column justify-content-center">
        <h6 className="mb-0 text-sm">{cliente.firstName}</h6>
        {cliente.reservations?.some(
          (res) =>
            res.status === "Approved" &&
            new Date(res.checkIn) <= new Date() &&
            new Date(res.checkOut) >= new Date()
        ) ? (
          // Mostrar información de la reserva si está hospedado
          <div>
            {cliente.reservations
              .filter(
                (res) =>
                  res.status === "Approved" &&
                  new Date(res.checkIn) <= new Date() &&
                  new Date(res.checkOut) >= new Date()
              )
              .map((res, index) => (
                <div key={index}>
                  <p className="mb-0 text-xs">Habitación: {res.room?.roomNumber || "N/A"}</p>
                  <p className="mb-0 text-xs">Tipo: {res.room?.roomType || "N/A"}</p>
                </div>
              ))}
          </div>
        ) : (
          // Mostrar el teléfono si no está hospedado
          <p className="mb-0 text-xs">{cliente.phone || "Teléfono no disponible"}</p>
        )}
      </div>
    </div>
  )}
</div>
      <div className="col-md-4">
        <button className="btn btn-primary w-100 mb-3" onClick={seleccionarMetodoPago}>
           Método de Pago
        </button>
        <div className="d-flex align-items-center" onClick={seleccionarMetodoPago}>
          {metodoPagoIcono()}
          <span>{metodoPago}</span>
        </div>
      </div>
      <div className="col-md-4">
      <button className="btn btn-lg btn-success w-100" onClick={finalizarVenta}>
          Finalizar Venta - Total: ${total.toFixed(2)}
        </button>
        <h6>Total:</h6>
        <p>${total.toFixed(2)}</p>
        {cambio > 0 && metodoPago === 'Efectivo' && (
  <p>
    <strong>Cambio: $</strong>{cambio.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </p>
)}

       
      </div>
    </div>
  );
};

export default OpcionesPOS;
