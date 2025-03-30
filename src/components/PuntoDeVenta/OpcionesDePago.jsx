import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import SeleccionMetodoPago from "./SeleccionMetodoPago";

const OpcionesPOS = ({
    total,
    cliente,
    setCliente,
    metodoPago,
    setMetodoPago,
    tabActivo,
}) => {
    const findPeople = async (findWord, updateList) => {
        const URL = `${
            import.meta.env.VITE_API_SERVER
        }/api/v1/users/userSearch`;
        try {
            const res = await axios.post(
                URL,
                { findUser: findWord },
                getConfig()
            );
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
          autocomplete="off"
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
                const addUserButton = document.getElementById(
                    "agregar-usuario-btn"
                );
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
                  src="${
                      user.picture ||
                      `${
                          import.meta.env.VITE_API_SERVER
                      }/api/v1/images/images/nobody.jpg`
                  }" 
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
                    <p class="mb-0 text-xs">Habitación: ${
                        reservation.room?.roomNumber || "N/A"
                    }</p>
                    <p class="mb-0 text-xs">Tipo: ${
                        reservation.room?.roomType || "N/A"
                    }</p>
                  `
                        : `<p class="mb-0 text-xs">Teléfono: ${
                              user.phone || "No disponible"
                          }</p>`
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
            title: "Agregar Nuevo Usuario",
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
                const firstName =
                    Swal.getPopup().querySelector("#firstName").value;
                const email = Swal.getPopup().querySelector("#email").value;
                const phone = Swal.getPopup().querySelector("#phone").value;
                const birthday =
                    Swal.getPopup().querySelector("#birthday").value;
                const gender = Swal.getPopup().querySelector("#gender").value;

                if (!firstName || !phone) {
                    Swal.showValidationMessage(
                        `Por favor ingresa el nombre y el teléfono`
                    );
                    return;
                }

                return { firstName, email, phone, birthday, gender };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { firstName, email, phone, birthday, gender } =
                    result.value;
                axios
                    .post(
                        `${
                            import.meta.env.VITE_API_SERVER
                        }/api/v1/users/createClient`,
                        {
                            firstName,
                            email,
                            phone,
                            birthday,
                            gender,
                        },
                        getConfig()
                    )
                    .then((response) => {
                        const data = response.data;

                        if (data.user) {
                            Swal.fire({
                                title: "Cliente Existente",
                                html: `
                <p>El cliente ya existe con los siguientes datos:</p>
                <ul>
                  <li class="list-group-item d-flex text-left">Nombre: ${
                      data.user.firstName
                  } ${data.user.lastName || ""}</li>
                  <li class="list-group-item d-flex text-left">Email: ${
                      data.user.email
                  }</li>
                  <li class="list-group-item d-flex text-left">Teléfono: ${
                      data.user.phone
                  }</li>
                </ul>
                <p>¿Quieres usar estos datos de cliente?</p>
              `,
                                showCancelButton: true,
                                confirmButtonText: "Si, usar",
                                cancelButtonText: "Cancelar",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    setCliente(data.user);
                                }
                            });
                        } else {
                            setCliente({
                                firstName: data.user.firstName,
                                telefono: data.user.phone,
                                email: "",
                            });
                            Swal.fire(
                                "Usuario Creado",
                                "El usuario ha sido creado con éxito.",
                                "success"
                            );
                        }
                    })
                    .catch((error) => {
                        Swal.fire(
                            "Error",
                            "Hubo un problema al crear el usuario.",
                            "error"
                        );
                        console.error("Error:", error);
                    });
            }
        });
    };

    const manejarPagoConfirmado = (metodo, monto, extra) => {
        console.log(
            `Pago confirmado: ${metodo}, Total: ${monto}, Extra: ${extra}`
        );
        // Aquí puedes hacer lo que necesites con la info del pago
    };

    return (
        <div className="row">
            <div className="col-md-4">
                <div className="col-12 gap-2 d-flex ">
                    <a
                        className="btn btn-primary w-50 "
                        onClick={handleBuscarCliente}
                    >
                        Buscar Cliente
                    </a>
                    <a
                        className="btn btn-primary w-50"
                        onClick={() => agregarUsuario("")}
                    >
                        Registrar CLiente
                    </a>
                </div>
                {cliente && (
                    <div
                        className="d-flex align-items-center mb-3 border-radius-lg p-3 border"
                        onClick={handleBuscarCliente}
                    >
                        <div className="avatar me-3">
                            <img
                                src={
                                    cliente.picture ||
                                    `${
                                        import.meta.env.VITE_API_SERVER
                                    }/api/v1/images/images/nobody.jpg`
                                }
                                alt="Avatar del usuario"
                                className="border-radius-lg shadow"
                            />
                        </div>
                        <div className="d-flex align-items-start flex-column justify-content-center">
                            <h6 className="mb-0 text-sm">
                                {cliente.firstName}
                            </h6>
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
                                                new Date(res.checkIn) <=
                                                    new Date() &&
                                                new Date(res.checkOut) >=
                                                    new Date()
                                        )
                                        .map((res, index) => (
                                            <div key={index}>
                                                <p className="mb-0 text-xs">
                                                    Habitación:{" "}
                                                    {res.room?.roomNumber ||
                                                        "N/A"}
                                                </p>
                                                <p className="mb-0 text-xs">
                                                    Tipo:{" "}
                                                    {res.room?.roomType ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                // Mostrar el teléfono si no está hospedado
                                <p className="mb-0 text-xs">
                                    {cliente.phone || "Teléfono no disponible"}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="col-md-4">
        <button className="btn btn-primary w-100 mb-3" onClick={seleccionarMetodoPago}>
          Método de Pago
        </button>
        <div className="d-flex align-items-center" onClick={seleccionarMetodoPago}>
          {metodoPagoIcono()}
          <span>{metodoPago}</span>
        </div>
      </div> */}
            <div className="col-md-4 p-3">
                {/* <button className="btn btn-lg btn-success w-100" onClick={finalizarVenta}>
          Finalizar Venta - Total: ${Number(total).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </button> */}

                <h6 className="p-0">Total:</h6>
                <p className="p-0" style={{ fontSize: 50 }}>
                    $
                    {Number(total).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </p>
            </div>
            <div className="col-md-4">
                <SeleccionMetodoPago
                    total={total}
                    onPagoConfirmado={manejarPagoConfirmado}
                    metodoPago={metodoPago}
                    setMetodoPago={setMetodoPago}
                    tabActivo={tabActivo}
                />
            </div>
        </div>
    );
};

export default OpcionesPOS;
