import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getConfig from "../../utils/getConfig";

const RoomDetailsUpdate = ({ room, getRoomsInfo, setEditing }) => {
  const [areas, setAreas] = useState()
  const [details, setDetails] = useState({
    roomNumber: "",
    roomType: "",
    pricePerNight: 0,
    ubication: "",
    description: "",
  });
  const [originalDetails, setOriginalDetails] = useState({}); // Para restaurar en caso de cancelar

  const getAreas = ()=> {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/areas`;
    axios
        .get(URL, getConfig())
        .then((res) => {
          setAreas(res.data);
        })
        .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (room) {
      const roomData = {
        roomNumber: room.roomNumber || "",
        roomType: room.roomType || "",
        pricePerNight: room.pricePerNight || 0,
        ubication: room.ubication || "",
        description: room.description || "",
      };
      setDetails(roomData);
      setOriginalDetails(roomData); // Guardamos el estado original
    }
    getAreas()
  }, [room]);

  const handleInputChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    axios
      .put(`${import.meta.env.VITE_API_SERVER}/api/v1/rooms/${room.id}`, details, getConfig())
      .then((response) => {
        if (response.status === 200) {
          getRoomsInfo(room.id);
          Swal.fire({
            icon: "success",
            title: "Detalles actualizados exitosamente",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          setEditing(false)
        }
      })
      .catch((error) => {

        console.log(error)
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: error.response?.data?.message || "Hubo un error al actualizar los detalles",
        });
        setEditing(false)
      });
  };

  const handleCancel = () => {
    setDetails(originalDetails); // Restaurar valores originales
    Swal.fire({
      icon: "info",
      title: "Cambios descartados",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
    setEditing(false)
  };

  return (
    <div className="col-12">
      <div className="card h-100">
        <div className="card-header pb-0 p-3">
          <h6 className="mb-0">Actualizar Detalles de la Habitación</h6>
        </div>
        <div className="card-body p-3">
          <div className="form-group mb-3">
            <label htmlFor="roomNumber" className="form-label">Número de Habitación</label>
            <input
              type="text"
              id="roomNumber"
              className="form-control"
              value={details.roomNumber}
              onChange={(e) => handleInputChange("roomNumber", e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="roomType" className="form-label">Tipo de Habitación</label>
            <input
              type="text"
              id="roomType"
              className="form-control"
              value={details.roomType}
              onChange={(e) => handleInputChange("roomType", e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="pricePerNight" className="form-label">Precio por Noche</label>
            <input
              type="number"
              id="pricePerNight"
              className="form-control"
              value={details.pricePerNight}
              onChange={(e) => handleInputChange("pricePerNight", e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="ubication" className="form-label">Ubicación</label>
            <select className="form-control"  onChange={(e) => handleInputChange("ubication", e.target.value)}>

              <option value={''}>No Definido</option>
            {
              areas?.rows?.map((ubication)=>
              <option selected={room.ubication ==ubication.id?true:false } key={ubication.id} value={ubication.id}>{ubication.name}</option>
              )
            }
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              id="description"
              className="form-control"
              value={details.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="4"
            />
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-secondary me-2" onClick={handleCancel}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsUpdate;
