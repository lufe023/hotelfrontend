import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Notifications } from "../Navbar/Notifications";
import FechaHora from "./utils/FechaHora";
import PuntoDeVentaMenu from "./PuntoDeVentaMenu";
import { findItem } from "./findProducts";
const PMenu = ({
    busqueda,
    setBusqueda,
    favoritos,
    setProductos,
    carrito,
    setCarrito,
    handleChangeDepartment,
}) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice);
    const [lastInputTime, setLastInputTime] = useState(null);
    const [inputMethod, setInputMethod] = useState("manual"); // "manual" o "scanner"
    const inputRef = useRef(null); // Referencia al input
    const selectionTimeout = useRef(null); // Referencia para el timeout
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    let debounceTimeout;

    useEffect(() => {
        if (busqueda.length > 2 && inputMethod === "manual") {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                if (busqueda.trim() !== "") {
                    // Validar que la búsqueda no esté vacía
                    findItem(busqueda, setProductos, 0);
                }
            }, 300); // Espera 300ms antes de ejecutar la búsqueda
        } else if (inputMethod !== "manual") {
            if (busqueda.trim() !== "") {
                // Validar que la búsqueda no esté vacía
                findItem(busqueda, setProductos, 1, carrito, setCarrito);
            }
        } else {
            setProductos(favoritos);
        }
    }, [busqueda]);

    const LogGoutConfirm = () => {
        Swal.fire({
            title: "¿Está seguro que quiere cerrar la sesión?",
            showDenyButton: true,
            confirmButtonText: "Sí, quiero salir",
            denyButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Adiós!", "", "success");
                navigate("/logout");
            } else {
                Swal.fire("Bien! Permanecerás en el sistema", "", "info");
            }
        });
    };

    const handleClearInput = () => {
        setBusqueda("");
    };
    const handleInputChange = (e) => {
        const value = e.target.value.trimStart();
        const now = Date.now();

        if (lastInputTime) {
            const timeDiff = now - lastInputTime;
            const inputLengthDiff = value.length - busqueda.length; // Diferencia en caracteres

            // Condición mejorada: si el tiempo entre teclas es menor a 80ms o ingresó más de 3 caracteres de golpe, es un escáner
            if (timeDiff < 50 || inputLengthDiff > 3) {
                setInputMethod("scanner");
                if (selectionTimeout.current) {
                    clearTimeout(selectionTimeout.current);
                }
                selectionTimeout.current = setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.select();
                    }
                }, 100);
            } else {
                setInputMethod("manual");
            }
        }

        setLastInputTime(now);
        setBusqueda(value);
    };

    useEffect(() => {
        // Detectar si es un dispositivo móvil o tablet
        const checkDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            setIsMobile(
                /iphone|ipod|ipad|android/.test(userAgent) ||
                    window.innerWidth <= 800
            );
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);

        return () => {
            window.removeEventListener("resize", checkDevice);
        };
    }, []);

    const handleFocusOut = () => {
        setTimeout(() => {
            const swalPopup = Swal.getPopup();
            const activeElement = document.activeElement;
            if (
                !swalPopup &&
                activeElement.tagName !== "INPUT" &&
                activeElement.tagName !== "TEXTAREA" &&
                activeElement.tagName !== "SELECT" &&
                !activeElement.classList.contains("form-control")
            ) {
                // Aquí ya no es necesario el check !isMobile, porque no se ejecutará si es móvil
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        }, 100);
    };

    useEffect(() => {
        // Solo agregar el event listener si no estamos en un móvil
        if (!isMobile) {
            document.addEventListener("focusout", handleFocusOut);

            return () => {
                document.removeEventListener("focusout", handleFocusOut);
            };
        }
    }, [isMobile]);

    useEffect(() => {
        if (!isMobile && inputRef.current) {
            inputRef.current.focus(); // Solo enfocar si NO es móvil
        }
    }, [isMobile]); // Dependencia de isMobile

    return (
        <div>
            <nav
                className="navbar navbar-main px-0 bg-white shadow-sm"
                style={{ width: "100vw", top: 0 }}
                id="navbarBlur"
            >
                <div className="container-fluid">
                    <nav
                        aria-label="breadcrumb"
                        className="d-none d-md-block"
                        style={{ width: 200 }}
                    >
                        <FechaHora />
                    </nav>
                    <div
                        className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4 align-items-left"
                        id="navbar"
                        style={{
                            minHeight: 50,
                            display: "flex",
                            justifyContent: "space-between",
                            width: "80%",
                        }}
                    >
                        <div
                            className="ms-md-3 col-8"
                            style={{ width: "100%", position: "relative" }}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control w-100"
                                placeholder="Buscar por nombre o código de barras"
                                style={{
                                    borderColor:
                                        inputMethod === "scanner"
                                            ? "green"
                                            : "",
                                }}
                                value={busqueda}
                                onKeyDown={(e) => {
                                    if (e.key === "Delete") {
                                        handleClearInput();
                                    }
                                }}
                                onChange={(e) => {
                                    handleInputChange(e);
                                }}
                                onBlur={() => {
                                    setTimeout(() => {
                                        if (
                                            !isMobile &&
                                            document.activeElement.tagName !==
                                                "INPUT" &&
                                            document.activeElement.tagName !==
                                                "SELECT" &&
                                            document.activeElement.tagName !==
                                                "TEXTAREA"
                                        ) {
                                            inputRef.current?.focus(); // Solo reenfocar si no hay otro input activo
                                        }
                                    }, 100);
                                }}
                            />
                            {busqueda && (
                                <button
                                    onClick={handleClearInput}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#ccc",
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <ul className="navbar-nav justify-content-end gap-2">
                            <li className="nav-item d-flex align-items-center text-nowrap pl-2 d-sm-inline d-none">
                                <Link className="nav-link text-body font-weight-bold px-0">
                                    <i className="fa fa-user me-sm-1" />
                                    <span className="d-sm-inline d-none">
                                        {user?.firstName}
                                    </span>
                                </Link>
                            </li>

                            <li className="nav-item px-3 d-flex align-items-center">
                                <Link
                                    onClick={() => LogGoutConfirm()}
                                    className="nav-link text-body p-0"
                                >
                                    <i className="fas fa-window-close text-danger" />
                                </Link>
                            </li>

                            <li className="nav-item dropdown pe-2 d-flex align-items-center">
                                <PuntoDeVentaMenu
                                    handleChangeDepartment={
                                        handleChangeDepartment
                                    }
                                />
                            </li>
                            {user && (
                                <li className="nav-item dropdown pe-2 d-flex align-items-center">
                                    <Notifications user={user} />
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default PMenu;
