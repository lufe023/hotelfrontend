import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PuntoDeVentaMenu = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(localStorage.getItem('audio') === 'true');

  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-toggle')) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setOpenDropdown(openDropdown === 'menu' ? null : 'menu');
  };

  const toggleAudioGuide = () => {
    const currentAudioSetting = localStorage.getItem('audio') === 'true';
    localStorage.setItem('audio', !currentAudioSetting);
    setAudioEnabled(!currentAudioSetting); // Actualizar el estado para forzar la re-renderización
  };

  return (
    <div className="dropdown">
      <button className=" nav-link text-body p-0" type="button" onClick={toggleDropdown}>
      <i className="fas fa-bars" />
      </button>
      <div className={`dropdown-menu dropdown-menu-end ${openDropdown === 'menu' ? 'show' : ''}`}>
      <Link to={'/invoices'} className="dropdown-item cursor-pointer" >
      <i className="fas fa-file-invoice-dollar" /> Cuentas
       </Link>
        <a className="dropdown-item cursor-pointer" >
       <i className="fas fa-cog" /> Configuración del POS
       </a>

        <a className="dropdown-item cursor-pointer" onClick={toggleAudioGuide}> 
            {localStorage.getItem('audio') === 'true' ? <span><i className="fas fa-volume-up" /> Con </span>: <span><i className="fas fa-volume-mute" /> Sin </span>}     Guía de Audio 
        
       
        </a>
        <a className="dropdown-item cursor-pointer">
        <i className="fas fa-file-alt" /> Reportes</a>
        <a className="dropdown-item cursor-pointer" > 
        <i className="fas fa-angle-double-right" /> Otra Opción</a>
      </div>
    </div>
  );
};

export default PuntoDeVentaMenu;