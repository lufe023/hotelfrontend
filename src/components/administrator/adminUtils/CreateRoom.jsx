import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import getConfig from '../../../utils/getConfig';

const CreateRoom = ({areas}) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    pricePerNight: '',
    description: '',
    ubication: '',
    bedQuantity: '',
    maxOccupancy:'',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/rooms`;

    axios
      .post(URL, formData, getConfig())
      .then((res) => {
        alert('Habitación creada exitosamente');
        navigate(`/rooms/${res.data.id}`);
      })
      .catch((err) => {
        alert(`Error: ${err.response?.data?.message || err.message}`);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container mt-5">
      <h5>Crear una nueva habitación</h5>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Número de Habitación</label>
          <input
            type="text"
            name="roomNumber"
            className="form-control"
            defaultValue={formData.roomNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Habitación</label>
          <input
            type="text"
            name="roomType"
            className="form-control"
            defaultValue={formData.roomType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
            <label className="form-label">Cantidad de camas</label>
            <input
              type="number"
              className="form-control"
              name="bedQuantity"
              defaultValue={1}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Capacidad máxima</label>
            <input
              type="number"
              className="form-control"
              name="maxOccupancy"
              defaultValue={2}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
        <div className="mb-3">
          <label className="form-label">Precio por Noche</label>
          <input
            type="number"
            name="pricePerNight"
            className="form-control"
            defaultValue={formData.pricePerNight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
            <label className="form-label">Área</label>
            <select
              className="form-select"
              name="ubication"
              required
            >
              <option>Selecciona un área</option>
              {areas?.rows?.map((area) => (
                <option key={area.id} defaultValue={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            defaultValue={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Habitación'}
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
