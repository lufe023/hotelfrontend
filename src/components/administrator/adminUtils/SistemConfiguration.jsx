import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const SistemConfiguration = () => {

    const [config, setConfig] = useState({
        defaultCheckInTime: "",
        defaultCheckOutTime: "",
        businessName: "",
        slogan: "",
        logoUrl: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
      });
    
      const [isEditing, setIsEditing] = useState(false);
    
      const CONFIG_ID = "0dcbb872-ac34-413d-aa63-ed6bc40e750e";
    
      const fetchConfiguration = async () => {
        axios.get(`${import.meta.env.VITE_API_SERVER}/api/v1/configurations/${CONFIG_ID}`)
          .then((response) => {
            setConfig(response.data);
          })
          .catch((error) => {
            console.error("Error fetching configuration:", error);
            alert("No se pudo cargar la configuración.");
          });
      };
    
      useEffect(() => {
        fetchConfiguration();
      }, []);
    
      const handleInputChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
      };
    
      const handleSaveConfig = async () => {
        try {
          await axios.put(`${import.meta.env.VITE_API_SERVER}/api/v1/configurations/${CONFIG_ID}`, config);
          Swal.fire({
            icon: "success",
            title: "Cambios Guardados",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          setIsEditing(false);
        } catch (error) {
          console.error("Error updating configuration:", error);
          alert("Error al actualizar la configuración.");
        }
      };

      
  return (
    <div className="card" onDoubleClick={()=>setIsEditing(true)}>
    <div className="card-header">
      <h5>Configuración del Sistema</h5>
    </div>
    <div className="card-body">
      <div className="mb-3">
        <label className="form-label">Hora de Check-In (por defecto)</label>
        <input
          type="time"
          name="defaultCheckInTime"
          value={config.defaultCheckInTime}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Hora de Check-Out (por defecto)</label>
        <input
          type="time"
          name="defaultCheckOutTime"
          value={config.defaultCheckOutTime}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Nombre del Negocio</label>
        <input
          type="text"
          name="businessName"
          value={config.businessName}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Eslogan</label>
        <input
          type="text"
          name="slogan"
          value={config.slogan}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">URL del Logo</label>
        <input
          type="url"
          name="logoUrl"
          value={config.logoUrl}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Correo de Contacto</label>
        <input
          type="email"
          name="contactEmail"
          value={config.contactEmail}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Teléfono de Contacto</label>
        <input
          type="tel"
          name="contactPhone"
          value={config.contactPhone}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Dirección</label>
        <textarea
          name="address"
          value={config.address}
          onChange={handleInputChange}
          className="form-control"
          disabled={!isEditing}
        />
      </div>
      <button
        className="btn btn-primary mt-3 me-2"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? "Cancelar" : "Editar"}
      </button>
      {isEditing && (
        <button className="btn btn-success mt-3" onClick={handleSaveConfig}>
          Guardar
        </button>
      )}
    </div>
  </div>
  )
}

export default SistemConfiguration