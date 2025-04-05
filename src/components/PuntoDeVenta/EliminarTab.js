import Swal from "sweetalert2";

// Función para eliminar el tab después de la confirmación
export const eliminarTab = (id, tabs, setTabs, setActiveTab) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);

    if (updatedTabs.length === 0) {
        // Si no quedan tabs, crear uno nuevo
        const newTab = {
            id: 1,
            cliente: {
                firstName: "No registrado",
                telefono: "1",
                email: "",
            },
            carrito: [],
            total: 0,
        };
        setTabs([newTab]);
        setActiveTab(newTab.id);
    } else {
        // Seleccionar el último tab disponible
        const lastTab = updatedTabs[updatedTabs.length - 1];
        setTabs(updatedTabs);
        setActiveTab(lastTab.id);
    }

    // Actualizar localStorage
    localStorage.setItem(
        "puntoDeVentaTabs",
        JSON.stringify(
            updatedTabs.length > 0
                ? updatedTabs
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
                  ]
        )
    );
};

export const cerrarTabConfirmation = (id, tabs, setTabs, setActiveTab) => {
    const tabToClose = tabs.find((tab) => tab.id === id);

    // Si el tab tiene productos en el carrito, preguntar confirmación
    if (tabToClose && tabToClose.carrito.length > 0) {
        Swal.fire({
            title: "¿Estás seguro?",
            html: `<b>${tabToClose.cliente.firstName}</b> tiene productos en la comanda. Si lo cierras, se perderá la selección.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar tab",
            confirmButtonColor: "#ef4444",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTab(id, tabs, setTabs, setActiveTab);
            }
        });
    } else {
        // Si el carrito está vacío, cerrar el tab directamente
        eliminarTab(id, tabs, setTabs, setActiveTab);
    }
};
