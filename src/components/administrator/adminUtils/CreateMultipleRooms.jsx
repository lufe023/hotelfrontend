import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getConfig from "../../../utils/getConfig";

const CreateMultipleRooms = ({ areas }) => {
  const [roomData, setRoomData] = useState({
    roomType: "",
    pricePerNight: "",
    maxOccupancy: 1,
    bedQuantity: 1,
    startRoomNumber: "",
    endRoomNumber: "",
    areaId: "",
    ubication: "",
    amenities: {
      hotWater: false,
      wifi: false,
      airConditioning: false,
      balcony: false,
      tv: false,
      privateBathroom: false,
      minibar: false,
      coffeeMaker: false,
      landscapeView: false,
      safeBox: false,
      breakfastIncluded: false,
      parking: false,
      poolAccess: false,
      gymAccess: false,
    },
  });

  const handleInputChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity) => {
    setRoomData((prevData) => ({
      ...prevData,
      amenities: {
        ...prevData.amenities,
        [amenity]: !prevData.amenities[amenity],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { startRoomNumber, endRoomNumber, ...roomInfo } = roomData;

    if (parseInt(endRoomNumber) < parseInt(startRoomNumber)) {
      Swal.fire({
        icon: "error",
        title: "Error en el rango",
        text: "El número final debe ser mayor o igual al número inicial.",
      });
      return;
    }

    const count = parseInt(endRoomNumber) - parseInt(startRoomNumber) + 1;

    // Generar lista de números de habitación
    const roomNumbers = Array.from(
      { length: count },
      (_, i) => parseInt(startRoomNumber) + i
    );

    const payload = {
      roomData: roomInfo,
      roomNumbers,
    };

    axios.post(
      `${import.meta.env.VITE_API_SERVER}/api/v1/rooms/batch`,
      payload,
      getConfig()
    )
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Habitaciones creadas exitosamente",
        text: "Las habitaciones han sido creadas correctamente.",
      });

      setRoomData({
        roomType: "",
        pricePerNight: "",
        maxOccupancy: 1,
        bedQuantity: 1,
        startRoomNumber: "",
        endRoomNumber: "",
        areaId: "",
        amenities: {
          hotWater: false,
          wifi: false,
          airConditioning: false,
          balcony: false,
          tv: false,
          privateBathroom: false,
          minibar: false,
          coffeeMaker: false,
          landscapeView: false,
          safeBox: false,
          breakfastIncluded: false,
          parking: false,
          poolAccess: false,
          gymAccess: false,
        },
      });
    })
    .catch((error) => {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        console.log('Error request:', error.request);
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        console.log('Error message:', error.message);
      }
      console.log('Error config:', error.config);
    
      Swal.fire({
        icon: "error",
        title: "Error al crear habitaciones",
        text: error.response?.data?.message || "Ocurrió un error inesperado.",
      });
    });
  };

  const calculateRoomCount = () => {
    const { startRoomNumber, endRoomNumber } = roomData;
    if (startRoomNumber && endRoomNumber) {
      const start = parseInt(startRoomNumber);
      const end = parseInt(endRoomNumber);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        return end - start + 1;
      }
    }
    return 0;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Crear grupo de habitaciones</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Área</label>
            <select
              className="form-select"
              name="ubication"
              defaultValue={roomData.ubication}
              onChange={handleInputChange}
              required
            >
              <option >Selecciona un área</option>
              {areas?.rows?.map((area) => (
                <option key={area.id} defaultValue={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <input
              type="text"
              className="form-control"
              name="roomType"
              defaultValue={roomData.roomType}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Precio por noche</label>
            <input
              type="number"
              className="form-control"
              name="pricePerNight"
              defaultValue={roomData.pricePerNight}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Capacidad máxima</label>
            <input
              type="number"
              className="form-control"
              name="maxOccupancy"
              defaultValue={roomData.maxOccupancy}
              onChange={handleInputChange}
              min={1}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Cantidad de camas</label>
            <input
              type="number"
              className="form-control"
              name="bedQuantity"
              defaultValue={roomData.bedQuantity}
              onChange={handleInputChange}
              min={1}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Número de habitación inicial</label>
            <input
              type="text"
              className="form-control"
              name="startRoomNumber"
              defaultValue={roomData.startRoomNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Número de habitación final</label>
            <input
              type="text"
              className="form-control"
              name="endRoomNumber"
              defaultValue={roomData.endRoomNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            Se crearán {calculateRoomCount()} habitaciones
          </div>
          <h6 className="text-uppercase text-body text-xs font-weight-bolder">
            Amenidades
          </h6>
          <ul className="list-group mb-4">
            {Object.keys(roomData.amenities).map((amenity) => (
              <li key={amenity} className="list-group-item border-0 px-0">
                <div className="form-check form-switch ps-0">
                  <input
                    className="form-check-input ms-auto"
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={roomData.amenities[amenity]}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <label
                    className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                    htmlFor={`amenity-${amenity}`}
                  >
                    {getAmenityLabel(amenity)}
                  </label>
                </div>
              </li>
            ))}
          </ul>
          <button type="submit" className="btn btn-primary w-100">
            Crear Habitaciones
          </button>
        </form>
      </div>
    </div>
  );
};

const getAmenityLabel = (amenity) => {
  const labels = {
    hotWater: "Agua caliente",
    wifi: "Acceso a Wifi",
    airConditioning: "Aire acondicionado",
    balcony: "Balcón",
    tv: "Televisión",
    privateBathroom: "Baño privado",
    minibar: "Minibar",
    coffeeMaker: "Cafetera",
    landscapeView: "Vista al paisaje",
    safeBox: "Caja fuerte",
    breakfastIncluded: "Desayuno incluido",
    parking: "Estacionamiento",
    poolAccess: "Acceso a la piscina",
    gymAccess: "Acceso al gimnasio",
  };
  return labels[amenity] || amenity;
};

export default CreateMultipleRooms;