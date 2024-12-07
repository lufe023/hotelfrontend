import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getConfig from "../../utils/getConfig";

const AmenitiesUpdate = ({ room, getRoomsInfo }) => {
  // Estado para las amenidades y otras configuraciones de la habitación
  const [amenities, setAmenities] = useState({});
  const [bedQuantity, setBedQuantity] = useState(0);
  const [maxOccupancy, setMaxOccupancy] = useState(0);

  // Cargar las amenidades y configuraciones de la habitación cuando el componente se monta
  useEffect(() => {
    if (room) {
      // Cargar las amenidades
      setAmenities({
        hotWater: room.hotWater || false,
        wifi: room.wifi || false,
        airConditioning: room.airConditioning || false,
        balcony: room.balcony || false,
        tv: room.tv || false,
        privateBathroom: room.privateBathroom || false,
        minibar: room.minibar || false,
        coffeeMaker: room.coffeeMaker || false,
        landscapeView: room.landscapeView || false,
        safeBox: room.safeBox || false,
        breakfastIncluded: room.breakfastIncluded || false,
        parking: room.parking || false,
        poolAccess: room.poolAccess || false,
        gymAccess: room.gymAccess || false,
      });

      // Cargar las configuraciones de la habitación
      setBedQuantity(room.bedQuantity || 0);
      setMaxOccupancy(room.maxOccupancy || 0);
    }
  }, [room]); // Solo se ejecuta cuando 'room' cambia

  // Handle amenity toggle
  const handleToggle = (amenity) => {
    const updatedAmenities = { ...amenities, [amenity]: !amenities[amenity] };
    setAmenities(updatedAmenities);  // Actualizar la UI inmediatamente

    // Realizar la actualización en el servidor
    axios
      .put(`${import.meta.env.VITE_API_SERVER}/api/v1/rooms/${room.id}`, { [amenity]: updatedAmenities[amenity] }, getConfig())
      .then((response) => {
        getRoomsInfo(room.id);
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: `${getAmenityLabel(amenity)} actualizado exitosamente`,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      })
      .catch((error) => {
        // Si ocurre un error, revertir el estado y mostrar un toast de error
        setAmenities({ ...amenities, [amenity]: !updatedAmenities[amenity] });
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: "Error al actualizar",
        });
      });
  };

  // Handle numeric updates (bedQuantity or maxOccupancy)
  const handleNumericUpdate = (field, value) => {
    const updatedValue = parseInt(value, 10);
    
    // Actualizar el valor en la UI inmediatamente
    if (field === "bedQuantity") {
      setBedQuantity(updatedValue);
    }
    if (field === "maxOccupancy") {
      setMaxOccupancy(updatedValue);
    }
  
    // Realizar la actualización en el servidor
    axios
      .put(`${import.meta.env.VITE_API_SERVER}/api/v1/rooms/${room.id}`, { [field]: updatedValue }, getConfig())
      .then((response) => {
        getRoomsInfo(room.id);
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: `${field === "bedQuantity" ? "Cantidad de camas" : "Capacidad máxima"} actualizada exitosamente`,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      })
      .catch((error) => {
        // Si ocurre un error, revertir el valor y mostrar un toast de error
        if (field === "bedQuantity") {
          setBedQuantity(room.bedQuantity);
        } else if (field === "maxOccupancy") {
          setMaxOccupancy(room.maxOccupancy);
        }
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: error.response?.data?.message || "Hubo un error al actualizar el campo",
        });
      });
  };

  return (
    <div className="col-xl-12">
      <div className="card">
        <div className="card-header pb-0 p-3">
          <h6 className="mb-0">Actualizar Amenidades</h6>
        </div>
        <div className="card-body p-3">
          <h6 className="text-uppercase text-body text-xs font-weight-bolder">Amenidades</h6>
          <ul className="list-group mb-4">
            {Object.keys(amenities).map((amenity) => (
              <li key={amenity} className="list-group-item border-0 px-0">
                <div className="form-check form-switch ps-0">
                  <input
                    className="form-check-input ms-auto"
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={amenities[amenity]}
                    onChange={() => handleToggle(amenity)}
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
          <h6 className="text-uppercase text-body text-xs font-weight-bolder">Configuraciones de la Habitación</h6>
          <div className="form-group mb-3">
            <label htmlFor="bedQuantity" className="form-label text-body">Cantidad de camas</label>
            <input
              type="number"
              id="bedQuantity"
              className="form-control"
              value={bedQuantity}
              onChange={(e) => handleNumericUpdate("bedQuantity", e.target.value)}
              min={0}
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxOccupancy" className="form-label text-body">Cantidad máxima de ocupantes</label>
            <input
              type="number"
              id="maxOccupancy"
              className="form-control"
              value={maxOccupancy}
              onChange={(e) => handleNumericUpdate("maxOccupancy", e.target.value)}
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Función para obtener etiquetas amigables para las amenidades
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

export default AmenitiesUpdate;
