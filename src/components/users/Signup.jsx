import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import FooterNoProtected from '../NotProtected/FooterNoProtected';
import { Link } from 'react-router-dom';
import NavbarNoProtected from '../NotProtected/NavbarNoProtected';

const RegisterUser = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loader, setLoader] = useState(false);

  const onSubmit = async (data) => {
    if (!data.firstName || !data.email || !data.password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Por favor completa al menos el nombre, email y contraseña.'
      });
      return;
    }

    setLoader(true);

   axios.post(`${import.meta.env.VITE_API_SERVER}/api/v1/auth/register`, data)
        .then(res => {
            setLoader(false);
            Swal.fire({
            icon: 'success',
            title: 'Usuario registrado',
            text: 'Usuario registrado con éxito. Inicia sesión para continuar.'
            });
            reset();
        })
        .catch(err => {
            console.log(err)
            setLoader(false);
            Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: 'Ocurrió un error al registrar el usuario. Por favor intenta de nuevo.'
            });
        });
  };

  const startWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_SERVER}/api/v1/auth/google`;
  };
  return (
    <>
      <div className='bg-white'>
  <div className="container position-sticky z-index-sticky top-0">
    <div className="row">
      <div className="col-12">
    <NavbarNoProtected/>
      </div>
    </div>
  </div>
  <main className="main-content  mt-0">
    <section>
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12 d-flex flex-column mx-auto">
              <div className="card card-plain mt-8">
                <div className="card-header pb-0 text-left bg-transparent">
                  <h3 className="font-weight-bolder text-info text-gradient">Bienvenido</h3>
                  <p className="mb-0">Sistema de Administración de Hoteles</p>
                </div>
                <div className="card-body">
                 
                <div className="container mt-5">
      <h2 className="text-center mb-4">Registrar Usuario</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Nombre:</label>
          <input className="form-control" {...register('firstName', { required: true })} />
          {errors.firstName && <span className="text-danger">Este campo es obligatorio</span>}
        </div>

        <div className="mb-3">
          <label>Apellido:</label>
          <input className="form-control" {...register('lastName')} />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input className="form-control" type="email" {...register('email', { required: true })} />
          {errors.email && <span className="text-danger">Este campo es obligatorio</span>}
        </div>

        <div className="mb-3">
          <label>Contraseña:</label>
          <input className="form-control" type="password" {...register('password', { required: true })} />
          {errors.password && <span className="text-danger">Este campo es obligatorio</span>}
        </div>

        <div className="mb-3">
          <label>Teléfono:</label>
          <input className="form-control" type="tel" {...register('phone')} />
        </div>

        <div className="mb-3">
          <label>Fecha de nacimiento:</label>
          <input className="form-control" type="date" {...register('birthday')} />
        </div>

        <div className="mb-3">
          <label>Género:</label>
          <select className="form-control" {...register('gender')}>
            <option value="">Seleccionar</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div className="mb-3">
          <label>País:</label>
          <input className="form-control" {...register('country')} />
        </div>

        <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0" disabled={loader}>
          {loader ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>
    </div>
                </div>
                <div className="card-footer text-center pt-0 px-lg-2 px-1">

                <p>Iniciar con </p>
                <div className="row px-xl-5 px-sm-4 px-3">

  <div className="col-12 me-auto px-1">
    <a className="btn btn-outline-light w-100" onClick={startWithGoogle}>
      <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Artboard" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
          <g id="google-icon" transform="translate(3.000000, 2.000000)" fillRule="nonzero">
            <path d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267" id="Path" fill="#4285F4" />
            <path d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667" id="Path" fill="#34A853" />
            <path d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782" id="Path" fill="#FBBC05" />
            <path d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769" id="Path" fill="#EB4335" />
          </g>
        </g>
      </svg>
    </a>
  </div>
  <div className="mt-2 position-relative text-center">
    <p className="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3">
      
    </p>
  </div>
</div>
                  <p className="mb-4 text-sm mx-auto">
                    ¿Ya tienes una cuenta?
                    <Link to={'/login'} className="text-info text-gradient font-weight-bold"> Iniciar con mi usuario</Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" style={{backgroundImage: 'url("./src/assets/img/curved-images/curved6.jpg")'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  {/* -------- START FOOTER 3 w/ COMPANY DESCRIPTION WITH LINKS & SOCIAL ICONS & COPYRIGHT ------- */}
<FooterNoProtected/>
  {/* -------- END FOOTER 3 w/ COMPANY DESCRIPTION WITH LINKS & SOCIAL ICONS & COPYRIGHT ------- */}
  {/*   Core JS Files   */}
  {/* Github buttons */}
  {/* Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc */}
</div>
    
    </>
  );
};

export default RegisterUser;
