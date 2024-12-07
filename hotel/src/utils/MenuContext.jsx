import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
const MenuContext = createContext();

// Creamos el proveedor del contexto
export const MenuProvider = ({ children }) => {
  const [isPinned, setIsPinned] = useState(false);

  // Función para alternar el estado
  const toggleMenu = () => {
    setIsPinned(prevState => !prevState);
  };

  return (
    <MenuContext.Provider value={{ isPinned, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook para usar el contexto fácilmente
export const useMenu = () => useContext(MenuContext);
