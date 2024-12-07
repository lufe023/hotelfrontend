import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getConfig from "../../utils/getConfig";

const GalleryUploader = ({ galleryId, galleryName, roomId, getRoomsInfo }) => {
    const [files, setFiles] = useState([]);
    const [descriptions, setDescriptions] = useState([]);

    // Maneja el cambio de archivos seleccionados
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles([...files, ...newFiles]);
        setDescriptions([...descriptions, ...newFiles.map(() => "")]);
    };

    // Maneja el cambio de la descripción de una imagen
    const handleDescriptionChange = (index, value) => {
        const updatedDescriptions = [...descriptions];
        updatedDescriptions[index] = value;
        setDescriptions(updatedDescriptions);
    };

    // Elimina una imagen seleccionada
    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedDescriptions = descriptions.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setDescriptions(updatedDescriptions);
    };

    // Maneja el envío del formulario con las imágenes y descripciones
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
      
        files.forEach((file) => formData.append("files", file));
        formData.append("galleryId", galleryId || ""); // Enviar `galleryId` si está disponible
        formData.append("galleryName", galleryName); // Nombre de la galería dinámico
        formData.append("roomId", roomId); // ID de la habitación
        descriptions.forEach((desc, index) => formData.append(`descriptions[${index}]`, desc));
      
        axios
          .post(`${import.meta.env.VITE_API_SERVER}/api/v1/gallery-images/upload`, formData, getConfig())
          .then((response) => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'success',
                title: 'Imagen subida con éxito'
            })
      
            // Reiniciar el estado local
            setFiles([]);
            setDescriptions([]);
            
            // Actualizar la información si es necesario
            getRoomsInfo(roomId);
          })
          .catch((error) => {
            console.error(error);
      
            // SweetAlert para error
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al subir las imágenes. Por favor, inténtalo de nuevo.",
            });
          });
      };

    return (
    <>
    <h6 className="mb-1">Subir imágenes a {galleryName}</h6>
    <form onSubmit={handleSubmit}>
        <h5></h5>
        <div className="card-body p-3">
            <div className="row">
                {files.map((file, index) => {
                    // Crear URL local para el thumbnail
                    const filePreview = URL.createObjectURL(file);

                    return (
                        <div className="col-xl-3 col-md-6 mb-xl-0 mb-4" key={index}>
                            <div className="card card-blog card-plain">
                                <div className="position-relative">
                                    <a className="d-block">
                                        <img
                                            src={filePreview}
                                            alt={`Preview ${file.name}`}
                                            className="img-fluid shadow border-radius-md"
                                        />
                                    </a>
                                    {/* Botón para eliminar la imagen */}
                                    <button
                                        type="button"
                                        className="badge border-0 bg-primary position-absolute top-0 end-0"
                                        style={{ zIndex: 1 }}
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        <i className="fa fa-times" />
                                    </button>
                                </div>
                                <div className="card-body px-1 pb-0">
                                    <div className="input-group">
                                        <textarea
                                            className="form-control"
                                            type="text"
                                            placeholder="Descripción de la imagen"
                                            value={descriptions[index]}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="col-xl-3 col-md-6 mb-xl-0 mb-4">
                    <div className="card h-100 card-plain border">
                        <div className="card-body d-flex flex-column justify-content-center text-center">
                            {/* Aquí agregamos el botón para cargar imágenes */}
                            <label htmlFor="file-upload" className="text-secondary mb-3" style={{ cursor: 'pointer' }}>
                                <i className="fa fa-plus text-secondary mb-3" />
                                <h5 className="text-secondary">Agregar Imagen</h5>
                            </label>
                            {/* Input de tipo file oculto */}
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-12 p-3">
            {
                files.length > 0?
        <button type="submit" className="btn btn-secondary btn-lg w-100 hover">Subir Imágenes</button>:""
            }
        </div>
    </form>
    </>
    );
};

export default GalleryUploader;
