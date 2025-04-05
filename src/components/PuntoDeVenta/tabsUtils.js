const LOCAL_STORAGE_KEY = "puntoDeVentaTabs";

// Obtener todos los tabs
export const getTabs = () => {
    const storedTabs = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTabs ? JSON.parse(storedTabs) : [createNewTab(1)];
};

// Guardar todos los tabs
export const saveTabs = (tabs) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tabs));
};

// Crear un nuevo tab
export const createNewTab = (id) => ({
    id,
    cliente: {
        firstName: `No registrado ${id}`,
        telefono: "1",
        email: "",
    },
    carrito: [],
    total: 0,
    metodoPago: "Efectivo",
});

// Obtener el próximo ID disponible
export const getNextId = (tabs) => {
    return tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
};

// Eliminar un tab
export const deleteTab = (id) => {
    const tabs = getTabs();
    const updatedTabs = tabs.filter((tab) => tab.id !== id);

    if (updatedTabs.length === 0) {
        const newTab = createNewTab(1);
        saveTabs([newTab]);
        return { updatedTabs: [newTab], newActiveTabId: newTab.id };
    }

    saveTabs(updatedTabs);
    return {
        updatedTabs,
        newActiveTabId: updatedTabs[updatedTabs.length - 1].id,
    };
};

// Agregar un nuevo tab
export const addNewTab = () => {
    const tabs = getTabs();
    const newId = getNextId(tabs);
    const newTab = createNewTab(newId);
    const updatedTabs = [...tabs, newTab];

    saveTabs(updatedTabs);
    return { updatedTabs, newActiveTabId: newId };
};

// Actualizar un tab específico
export const updateTab = (id, updates) => {
    const tabs = getTabs();
    const updatedTabs = tabs.map((tab) =>
        tab.id === id ? { ...tab, ...updates } : tab
    );

    saveTabs(updatedTabs);
    return updatedTabs;
};

// Obtener un tab por ID
export const getTabById = (id) => {
    return getTabs().find((tab) => tab.id === id) || createNewTab(id);
};

// Cerrar tab con confirmación
export const cerrarTabConfirmation = (id, setActiveTabId) => {
    const tabToClose = getTabById(id);

    if (tabToClose.carrito.length > 0) {
        Swal.fire({
            title: "¿Estás seguro?",
            html: `<b>${tabToClose.cliente.firstName}</b> tiene productos en la comanda.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar tab",
            confirmButtonColor: "#ef4444",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                const { newActiveTabId } = deleteTab(id);
                setActiveTabId(newActiveTabId);
            }
        });
    } else {
        const { newActiveTabId } = deleteTab(id);
        setActiveTabId(newActiveTabId);
    }
};
