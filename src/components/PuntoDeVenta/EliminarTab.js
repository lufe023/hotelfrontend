// Función para eliminar el tab después de la confirmación
export const eliminarTab = (id, tabs, setTabs, setActiveTab) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);

    if (updatedTabs.length === 0) {
        setTabs([
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
        ]);
        setActiveTab(1);
    } else {
        setActiveTab(updatedTabs[updatedTabs.length - 1].id);
        setTabs(updatedTabs);
    }
};
