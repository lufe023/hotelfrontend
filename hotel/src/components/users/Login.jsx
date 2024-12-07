import React, { useState, useEffect } from 'react';
import NavbarNoProtected from '../NotProtected/NavbarNoProtected'
import FooterNoProtected from '../NotProtected/FooterNoProtected'
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import getUserbyId from './getMyUser';

const Login = () => {
  const [isLogged, setIsLogged] = useState(localStorage.getItem('token'));
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
      localStorage.setItem('token', token);
      setIsLogged(true);
      navigate('/dashboard');
    } else if (error) {
      setMessage(error);
      Swal.fire({
        icon: 'error',
        title: 'Algo anda mal',
        text: error,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }, [location, navigate]);

  const submit = data => {
    setMessage(false)
    setLoader(true);
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/auth/login`;
    axios.post(URL, data)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        getUserbyId(dispatch);
        setIsLogged(true); 
        setLoader(false);
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

      })
      .catch(err => {
        setMessage(err.response.data.message);
        setLoader(false);
        Swal.fire({
          icon: 'error',
          title: 'Algo anda mal',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
    reset({ password: '' });
  };

  const startWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_SERVER}/api/v1/auth/google`;
  };

  if (isLogged) {
    return <Navigate to='/dashboard' />;
  }
  return (
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
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="card card-plain mt-8">
                <div className="card-header pb-0 text-left bg-transparent">
                  <h3 className="font-weight-bolder text-info text-gradient">Bienvenido</h3>
                  <p className="mb-0">Sistema de Administración de Hoteles</p>
                </div>



                <div className="card-body">
                  <form role="form" onSubmit={handleSubmit(submit)}>
                    <label>Usuario o Correo</label>
                    <div className="mb-3">
                    <input 
                  {...register('email')}  type="email" className="form-control" placeholder="Usuario o correo" aria-label="Email" aria-describedby="email-addon" />
                    </div>
                    <label>Contraseña</label>
                    <div className="mb-3">
                    <input 
                  {...register('password')}  type='password' className="form-control" placeholder="Contraseña" aria-label="Password" aria-describedby="password-addon" />
                    </div>
                    <div className="mb-3 text-center">
                      <label className="form-check-label text-danger" htmlFor="rememberMe">{message}</label>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0">Iniciar</button>
                    </div>
                  </form>
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
                    ¿Aún no tienes una cuenta?
                    <Link to={'/signup'} className="text-info text-gradient font-weight-bold"> Crear usuario</Link>
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

  )
}

export default Login