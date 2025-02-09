import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Error404 from './components/layout/Error404';
import Login from './components/users/login';
import Signup from './components/users/Signup';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import getUserbyId from './components/users/getMyUser';
import LogOut from './components/users/LogOut';
import Rooms from './components/rooms/Rooms';
import SeePictures from './components/gallery/SeePictures';
import CheckIn from './components/dashboard/CheckIn';
import ScrollToHash from './utils/ScrollToHash';
import AllChats from './components/users/AllChats';
import Admin from './components/administrator/adminUtils/Admin';
import ProtectedAdmin from './components/administrator/adminUtils/ProtectedAdmin';
import PuntoDeVenta from './components/PuntoDeVenta/PuntoDeVenta';

function App() {
  const navigate = useNavigate();
  // Obtener los datos del usuario al cargar la app
  const dispatch = useDispatch();
  useEffect(() => {
    getUserbyId(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault();
      navigate(-1); // Navegar hacia atrás
    };

    document.addEventListener('contextmenu', handleRightClick);

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
    };
  }, [navigate]);

  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<LogOut />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={<Error404 />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<AppLayout />} />
          <Route path='/dashboard' element={<AppLayout />} />
          <Route path='/room/:id' element={<Rooms />} />
          <Route path='/support' element={<AllChats />} />
          <Route path='/support/:id' element={<AllChats />} />
          <Route path='/gallerys' element={<SeePictures />} />
          <Route path='/prepare-checking/:id' element={<CheckIn />} />
          <Route path='/ventas' element={<PuntoDeVenta />} />
        </Route>

        <Route element={<ProtectedAdmin />}>
          <Route path='/admin' element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;