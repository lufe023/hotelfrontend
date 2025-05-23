import React, { useEffect, useState } from 'react'
import {useMenu} from '../../utils/MenuContext'

import './aside.css'
import Swal from 'sweetalert2';
import {Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Aside = () => {
  const { isPinned, toggleMenu, setIsPinned } = useMenu();
  const navigate = useNavigate();
  const [siteInformation, setSiteInformation] = useState('')

  useEffect(() => {
    if (!siteInformation) {
      fetchSiteInformation();
    }
  }, [siteInformation]);
  const fetchSiteInformation = async () => {
    try {
      const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/configurations/siteInformation/${import.meta.env.VITE_CONFIG_ID}`;
      const { data } = await axios.get(URL);
      setSiteInformation(data);
    } catch (error) {
      console.error("Error fetching site information:", error);
    }
  };

  const LogGoutConfirm = ()=>{
    Swal.fire({
        title: "¿Está seguro que quiere cerrar la sesión?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Si, quiero salir",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Adios!", "", "success");
          navigate('/logout');
        } else if (result.isDenied) {
          Swal.fire("Bien! Permanecerás en el sistema", "", "info");
        }
      });
    }

      const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-toggle')) {
          setIsPinned(null);
        }
      };

      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

  return (

<aside
  style={{ overflow: 'hidden' }}
  className={`scroll sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start h-100 ms-3 ps--scrolling-y ${isPinned ? 'bg-white' : ''}`}
  id="sidenav-main"
>
  <div className="sidenav-header">
    <i onClick={toggleMenu} className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-xl-none" aria-hidden="true" id="iconSidenav" />
    <Link className="navbar-brand m-0" to={'/'}>
      <img src={siteInformation?.logoUrl} className="navbar-brand-img h-100" alt="main_logo" />
      <span className="ms-1 font-weight-bold">{siteInformation?.businessName}</span>
      <span className="ms-1 d-block font-weight-light">{siteInformation?.slogan}</span>
    </Link>
  </div>
  <hr className="horizontal dark mt-4" />
{/* 
  display: block;
    overflow: auto;
    height: calc(100vh); */}
  <div className="collapse  w-auto scroll " id="sidenav-collapse-main" style={{ overflow: 'auto', height: 'calc(100vh - 100px)', display: 'block' }}>

    <ul className="navbar-nav">
      <li className="nav-item">
        <NavLink className="nav-link hover " to={'/'}>
          <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
            <svg width="12px" height="12px" viewBox="0 0 45 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <title>shop </title>
              <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                <g transform="translate(-1716.000000, -439.000000)" fill="#FFFFFF" fillRule="nonzero">
                  <g transform="translate(1716.000000, 291.000000)">
                    <g transform="translate(0.000000, 148.000000)">
                      <path className="color-background opacity-6" d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z" />
                      <path className="color-background" d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z" />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <span className="nav-link-text ms-1">Dashboard</span>
        </NavLink>
      </li>

      <li className="nav-item ">
        <NavLink className="nav-link hover " to={'/support'}>
          <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">

          <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1 .9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9 .7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"/>
          </svg>
          </div>
          <span className="nav-link-text ms-1">Asistencia</span>
        </NavLink>
      </li>
      <li className="nav-item ">
        <NavLink className="nav-link hover " to={'/guest'}>
          <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
            {/* <svg width="12px" height="12px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <title>office</title>
              <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                <g transform="translate(-1869.000000, -293.000000)" fill="#FFFFFF" fillRule="nonzero">
                  <g transform="translate(1716.000000, 291.000000)">
                    <g id="office" transform="translate(153.000000, 2.000000)">
                      <path className="color-background opacity-6" d="M12.25,17.5 L8.75,17.5 L8.75,1.75 C8.75,0.78225 9.53225,0 10.5,0 L31.5,0 C32.46775,0 33.25,0.78225 33.25,1.75 L33.25,12.25 L29.75,12.25 L29.75,3.5 L12.25,3.5 L12.25,17.5 Z" />
                      <path className="color-background" d="M40.25,14 L24.5,14 C23.53225,14 22.75,14.78225 22.75,15.75 L22.75,38.5 L19.25,38.5 L19.25,22.75 C19.25,21.78225 18.46775,21 17.5,21 L1.75,21 C0.78225,21 0,21.78225 0,22.75 L0,40.25 C0,41.21775 0.78225,42 1.75,42 L40.25,42 C41.21775,42 42,41.21775 42,40.25 L42,15.75 C42,14.78225 41.21775,14 40.25,14 Z M12.25,36.75 L7,36.75 L7,33.25 L12.25,33.25 L12.25,36.75 Z M12.25,29.75 L7,29.75 L7,26.25 L12.25,26.25 L12.25,29.75 Z M35,36.75 L29.75,36.75 L29.75,33.25 L35,33.25 L35,36.75 Z M35,29.75 L29.75,29.75 L29.75,26.25 L35,26.25 L35,29.75 Z M35,22.75 L29.75,22.75 L29.75,19.25 L35,19.25 L35,22.75 Z" />
                    </g>
                  </g>
                </g>
              </g>
            </svg> */}
        
        <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>account-multiple</title><path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" /></svg>
          
          </div>
          <span className="nav-link-text ms-1">Huespedes</span>
        </NavLink>
      </li>
      <li className="nav-item ">
        <NavLink className="nav-link  hover" to={'/rooms'}>
        <div className='icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center '>
        <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path d="M528 224H272c-8.8 0-16 7.2-16 16v144H64V144c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v352c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48h512v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V336c0-61.9-50.1-112-112-112zM136 96h126.1l27.6 55.2c5.9 11.8 22.7 11.8 28.6 0L368 51.8 390.1 96H512c8.8 0 16-7.2 16-16s-7.2-16-16-16H409.9L382.3 8.8C376.4-3 359.6-3 353.7 8.8L304 108.2l-19.9-39.8c-1.4-2.7-4.1-4.4-7.2-4.4H136c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm24 256c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z"/>
        </svg>


       
        </div>
          <span className="nav-link-text ms-1">Habitaciones</span>
        </NavLink>
      </li>
              <hr className="horizontal dark mt-4" />
      <li className="nav-header nav-item">
        <a className='nav-link'>   Punto de Venta</a>
      </li>

      <li className="nav-item ">
        <NavLink className="nav-link  hover" to={'/ventas'}>
        <div className='icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center '>
  
        <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path d="M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-33.5 53.5-3.8 127.9 58.8 136.4 4.5 .6 9.1 .9 13.7 .9 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.8 33.1 4.7 0 9.2-.3 13.7-.9 62.8-8.4 92.6-82.8 59-136.4zM529.5 288c-10 0-19.9-1.5-29.5-3.8V384H116v-99.8c-9.6 2.2-19.5 3.8-29.5 3.8-6 0-12.1-.4-18-1.2-5.6-.8-11.1-2.1-16.4-3.6V480c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V283.2c-5.4 1.6-10.8 2.9-16.4 3.6-6.1 .8-12.1 1.2-18.2 1.2z"/></svg>
        </div>
          <span className="nav-link-text ms-1">P. Ventas</span>
        </NavLink>
      </li>

      

      <li className="nav-item ">
        <NavLink className="nav-link  hover" to={'/invoices'}>
        <div className='icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center '>

        <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8V72zm0 80v-16c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8zm144 263.9V440c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8v-24.3c-11.3-.6-22.3-4.5-31.4-11.4-3.9-2.9-4.1-8.8-.6-12.1l11.8-11.2c2.8-2.6 6.9-2.8 10.1-.7 3.9 2.4 8.3 3.7 12.8 3.7h28.1c6.5 0 11.8-5.9 11.8-13.2 0-6-3.6-11.2-8.8-12.7l-45-13.5c-18.6-5.6-31.6-23.4-31.6-43.4 0-24.5 19.1-44.4 42.7-45.1V232c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v24.3c11.3 .6 22.3 4.5 31.4 11.4 3.9 2.9 4.1 8.8 .6 12.1l-11.8 11.2c-2.8 2.6-6.9 2.8-10.1 .7-3.9-2.4-8.3-3.7-12.8-3.7h-28.1c-6.5 0-11.8 5.9-11.8 13.2 0 6 3.6 11.2 8.8 12.7l45 13.5c18.6 5.6 31.6 23.4 31.6 43.4 0 24.5-19.1 44.4-42.7 45.1z"/></svg>
        </div>
          <span className="nav-link-text ms-1">Cuentas</span>
        </NavLink>
      </li>

      <li className="nav-item ">
        <NavLink className="nav-link  hover" to={'/inventory'}>
        <div className='icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center '>


       <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">{/*!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}<path d="M0 32C0 14.3 14.3 0 32 0l72.9 0c27.5 0 52 17.6 60.7 43.8L257.7 320c30.1 .5 56.8 14.9 74 37l202.1-67.4c16.8-5.6 34.9 3.5 40.5 20.2s-3.5 34.9-20.2 40.5L352 417.7c-.9 52.2-43.5 94.3-96 94.3c-53 0-96-43-96-96c0-30.8 14.5-58.2 37-75.8L104.9 64 32 64C14.3 64 0 49.7 0 32zM244.8 134.5c-5.5-16.8 3.7-34.9 20.5-40.3L311 79.4l19.8 60.9 60.9-19.8L371.8 59.6l45.7-14.8c16.8-5.5 34.9 3.7 40.3 20.5l49.4 152.2c5.5 16.8-3.7 34.9-20.5 40.3L334.5 307.2c-16.8 5.5-34.9-3.7-40.3-20.5L244.8 134.5z" /></svg>

        </div>
          <span className="nav-link-text ms-1">Inventario</span>
        </NavLink>
      </li>
      <li className="nav-item ">
        <NavLink className="nav-link  hover" to={'/departmens'}>
        <div className='icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center '>


       <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
       {/*!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
       <path d="M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-33.5 53.5-3.8 127.9 58.8 136.4 4.5 .6 9.1 .9 13.7 .9 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.8 33.1 4.7 0 9.2-.3 13.7-.9 62.8-8.4 92.6-82.8 59-136.4zM529.5 288c-10 0-19.9-1.5-29.5-3.8V384H116v-99.8c-9.6 2.2-19.5 3.8-29.5 3.8-6 0-12.1-.4-18-1.2-5.6-.8-11.1-2.1-16.4-3.6V480c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V283.2c-5.4 1.6-10.8 2.9-16.4 3.6-6.1 .8-12.1 1.2-18.2 1.2z" /></svg>

        </div>
          <span className="nav-link-text ms-1">Departamentos</span>
        </NavLink>
      </li>
      
      <li className="nav-item ">
        <NavLink className="nav-link  hover" to={'/admin'}>
        <div className='icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center '>
        {/* <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path d="M528 224H272c-8.8 0-16 7.2-16 16v144H64V144c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v352c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48h512v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V336c0-61.9-50.1-112-112-112zM136 96h126.1l27.6 55.2c5.9 11.8 22.7 11.8 28.6 0L368 51.8 390.1 96H512c8.8 0 16-7.2 16-16s-7.2-16-16-16H409.9L382.3 8.8C376.4-3 359.6-3 353.7 8.8L304 108.2l-19.9-39.8c-1.4-2.7-4.1-4.4-7.2-4.4H136c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm24 256c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z"/>
        </svg> */}


        <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">{/*!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}<path d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm96 64a63.1 63.1 0 0 1 8.1-30.5c-4.8-.5-9.5-1.5-14.5-1.5h-16.7a174.1 174.1 0 0 1 -145.8 0h-16.7A134.4 134.4 0 0 0 0 422.4V464a48 48 0 0 0 48 48h280.9a63.5 63.5 0 0 1 -8.9-32zm288-32h-32v-80a80 80 0 0 0 -160 0v80h-32a32 32 0 0 0 -32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V320a32 32 0 0 0 -32-32zM496 432a32 32 0 1 1 32-32 32 32 0 0 1 -32 32zm32-144h-64v-80a32 32 0 0 1 64 0z" /></svg>

        </div>
          <span className="nav-link-text ms-1">Administrador</span>
        </NavLink>
      </li>
    </ul>
      </div>
  <div className="mx-3" style={{left: 10, bottom: 50, position:'absolute'}}> 
    <div className="sidenav-footer ">
    <a className="btn btn-primary mt-3 w-100" onClick={()=>LogGoutConfirm()}>Salir del Sistema</a>
  </div>
  </div>
    
  
  </aside>


  )
}

export default Aside