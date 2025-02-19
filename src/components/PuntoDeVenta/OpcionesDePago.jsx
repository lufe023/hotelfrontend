import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import FirmaCliente from "./FirmaCliente";

const OpcionesPOS = ({ total, cliente, setCliente,  metodoPago, setMetodoPago }) => {
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
            placeholder="Buscar persona por Nombre, Apellido o Teléfono" 
          />
        </div>
        <ul id="buscar-cliente-list" class="list-group mt-3" style="min-height: 330px; overflow-y: auto;"></ul>
        <button id="agregar-usuario-btn" class="btn btn-success w-100" style="display: block;">Agregar Usuario</button>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        const input = document.getElementById("buscar-cliente-input");
        const list = document.getElementById("buscar-cliente-list");
        const addUserButton = document.getElementById("agregar-usuario-btn");
        const now = new Date();
  
        const updateList = (users) => {
          list.innerHTML = ""; 
  
          users.forEach((user) => {
            const reservation = user.reservations?.find(
              (res) =>
                res.status === "Approved" &&
                new Date(res.checkIn) <= now &&
                new Date(res.checkOut) >= now
            );
  
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
  
            item.addEventListener("click", () => {
              setCliente({ ...user });
              Swal.close();
            });
  
            list.appendChild(item);
          });
        };
  
        input.addEventListener("input", (e) => {
          const searchWord = e.target.value.trim();
          if (searchWord) {
            findPeople(searchWord, updateList);
          } else {
            updateList([]);
          }
        });
  
        addUserButton.addEventListener("click", () => {
          const searchWord = input.value.trim();
          Swal.close();
          agregarUsuario(searchWord); // Llamar la función para agregar usuario con el nombre de búsqueda
        });
      },
    });
  };
  
  const agregarUsuario = (preFilledName = "") => {
    Swal.fire({
      title: 'Agregar Nuevo Usuario',
      html: `
        <input type="text" id="firstName" class="swal2-input" placeholder="Nombre" required value="${preFilledName}">
        <input type="email" id="email" class="swal2-input" placeholder="Correo Electrónico">
        <input type="tel" id="phone" class="swal2-input" placeholder="Teléfono" required>
        <input type="date" id="birthday" class="swal2-input" placeholder="Fecha de Nacimiento">
        <select id="gender" class="swal2-input">
          <option value="">Seleccionar Género</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const firstName = Swal.getPopup().querySelector('#firstName').value;
        const email = Swal.getPopup().querySelector('#email').value;
        const phone = Swal.getPopup().querySelector('#phone').value;
        const birthday = Swal.getPopup().querySelector('#birthday').value;
        const gender = Swal.getPopup().querySelector('#gender').value;
  
        if (!firstName || !phone) {
          Swal.showValidationMessage(`Por favor ingresa el nombre y el teléfono`);
          return;
        }
  
        return { firstName, email, phone, birthday, gender };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { firstName, email, phone, birthday, gender } = result.value;  
        axios.post(`${import.meta.env.VITE_API_SERVER}/api/v1/users/createClient`, {
          firstName, email, phone, birthday, gender
        }, getConfig())
        .then(response => {
          const data = response.data;
  
          if (data.user) {
            Swal.fire({
              title: 'Cliente Existente',
              html: `
                <p>El cliente ya existe con los siguientes datos:</p>
                <ul>
                  <li class="list-group-item d-flex text-left">Nombre: ${data.user.firstName} ${data.user.lastName || ''}</li>
                  <li class="list-group-item d-flex text-left">Email: ${data.user.email}</li>
                  <li class="list-group-item d-flex text-left">Teléfono: ${data.user.phone}</li>
                </ul>
                <p>¿Quieres usar estos datos de cliente?</p>
              `,
              showCancelButton: true,
              confirmButtonText: 'Si, usar',
              cancelButtonText: 'Cancelar',
            })
            .then((result) => {
              if (result.isConfirmed) {
                setCliente(data.user);
              }
            });
          } else {
            setCliente({ firstName: data.user.firstName, telefono:data.user.phone, email: "" });
            Swal.fire('Usuario Creado', 'El usuario ha sido creado con éxito.', 'success');
          }
        })
        .catch(error => {
          Swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
          console.error('Error:', error);
        });
      }
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
        inputValue: Math.ceil(total),
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
    } 
    else if (metodoPago === "Factura") {
      Swal.fire({
        title: "Facturas Pendientes",
        html: `
          <div class="form-group" style="max-height: 300px; overflow-y: auto;">
            <label for="facturas-select">Selecciona una factura:</label>
            <div class="form-check">
              <input type="radio" class="form-check-input" id="factura-nueva" name="factura-pago" value="" checked>
              <label class="form-check-label" for="factura-nueva">
                Nueva Factura
              </label>
            </div>
            ${facturasPendientes
              .map((factura) => `
                <div class="form-check">
                  <input type="radio" class="form-check-input" id="factura-${factura.id}" name="factura-pago" value="${factura.id}">
                  <label class="form-check-label" for="factura-${factura.id}">
                    Factura #${factura.id} - Total: $${factura.total}
                  </label>
                </div>
              `)
              .join("")}
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Agregar Total",
        preConfirm: () => {
          const radios = document.querySelectorAll("input[name='factura-pago']");
          let selectedFactura = "";
          radios.forEach((radio) => {
            if (radio.checked) {
              selectedFactura = radio.value;
            }
          });
          return selectedFactura;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const facturaSeleccionada = result.value;
          if (facturaSeleccionada === "") {
            Swal.fire("Nueva Factura", `Se ha creado una nueva factura por $${total.toFixed(2)}`, "success");
          } else {
            const factura = facturasPendientes.find((f) => f.id.toString() === facturaSeleccionada);
            Swal.fire("Factura Actualizada", `Total agregado a la factura #${factura.id}`, "success");
          }
        }
      });
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
        <div className="col-12 gap-2 d-flex ">
          
     <a className="btn btn-primary w-50" onClick={handleBuscarCliente}>
    Buscar Cliente
      </a>
  <a className="btn btn-primary w-50" onClick={()=>agregarUsuario("")}>Registrar CLiente</a>
 
  </div>
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
        <FirmaCliente/>
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
