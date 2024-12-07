import axios from 'axios';
import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Swal from 'sweetalert2';
import getConfig from '../../utils/getConfig';

function Gallery({ images = [], getRoomsInfo, roomId }) {
  // Convertir las imágenes al formato requerido por ImageGallery
  const galleryItems = images?.map((image) => ({
    original: `${import.meta.env.VITE_API_SERVER}/api/v1/images/images/${image.imageUrl}`,  // Ruta de la imagen original
    thumbnail: `${import.meta.env.VITE_API_SERVER}/api/v1/images/images/${image.imageUrl}`, // Ruta de la imagen en miniatura
    altText: image.altText || '', // Descripción alternativa
    imageUrl: image.imageUrl, // Para identificar la imagen
    id: image.id, // ID de la imagen en la base de datos
  }));

  const deleteImage = (id) => {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/gallery-images/${id}`;
      Swal.fire({
          title: "¿Estas seguro que quieres Eliminar esta Imagen?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Si",
          denyButtonText: `No`
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire("Foto eliminada", "", "success");
            axios.delete(URL, getConfig())
            .then((res) => {
              getRoomsInfo(roomId)
            console.log(res)
          })
          .catch((err) => console.log(err));
          }
        })
  }
  // Renderizar cada elemento de la galería con un botón de eliminar
  const renderItem = (item) => (
    <div className="image-gallery-item">
      <img
        src={item.original}
        alt={item.altText}
        style={{ maxWidth:"600px", maxHeight: "400px" }}
      />
      <div className="image-description">
        <p>{item.altText}</p>
        <button
          className="btn btn-danger"
          onClick={() => deleteImage(item.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );

  return (
    <ImageGallery
      autoPlay={false}
      showPlayButton={false}
      items={galleryItems}
      renderItem={renderItem}
    />
  );
}

export default Gallery;
