import React, { useEffect, useState } from 'react'
import { useMenu } from '../../utils/MenuContext';
import Aside from '../aside';
import Navbar from '../Navbar';
import getConfig from '../../utils/getConfig';
import axios from 'axios';

const SeePictures = () => {
    
    const { isPinned } = useMenu(); // Ahora esto funcionará correctamente
    const [galleries, setGalleries] = useState([])


 const fetchGalleries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/v1/galleries",
        getConfig()
      );
      setGalleries(response.data.results);
    } catch (error) {
      console.error("Error al cargar las galerías:", error);
    }
  };

    useEffect(() => {
        fetchGalleries();
      }, []);
      
  return (
    <div className={`g-sidenav-show  ${isPinned ? 'g-sidenav-pinned' : ''}`}>
    <Aside/>
    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <Navbar />
      <div className="container-fluid py-4">
    <div className="row">
    <div className="col-lg-12 col-md-6 mb-md-0 mb-4">
        <div className="card">
            hola
        </div>
    </div>
    </div>
    </div>
    </main>
    </div>
  )
}

export default SeePictures