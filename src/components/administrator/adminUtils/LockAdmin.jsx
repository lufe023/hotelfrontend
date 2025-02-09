import React, { useEffect } from 'react'

import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import axios from 'axios'
import getConfig from '../../../utils/getConfig'
import Navbar from '../../Navbar'
import Aside from '../../aside'
import { useMenu } from '../../../utils/MenuContext'

const LockAdmin = ({setAccess,setPasswordFail, passwordFail}) => {
      const { isPinned } = useMenu(); // Ahora esto funcionará correctamente
    const [user, setUser] = useState(useSelector(state=> state.userSlice))
    const [msg, setMsg] = useState() 
    const {register, handleSubmit, reset} = useForm()
    const getUserbyId = () => { 
      const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/users/me`
        axios.get(URL, getConfig())
        .then(res => {
          setUser(res.data)
        })
        .catch(err => {
          setPasswordFail(passwordFail+1)
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
            icon: 'error',
            title: `Contraseña erronea, intentelo de  nuevo`
          })
        })
        
    }
    useEffect(() => {
    getUserbyId()
    }, [])

if(user?.firstName=="Cargando"){
  getUserbyId()
}

    const submit = data => {
        const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/auth/login`
            axios.post(URL, {password:data.password, email: user?.email})
            .then(res =>
              {

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
                if(res.data.nivel>=999){
                  setAccess(true)
                  setMsg('Cumple permisos')
                  Toast.fire({
                    icon: 'success',
                    title: `Credenciales Correctas, permisos aceptados`
                  })
                  }
                  else{
                    setMsg('No cumple con los permisos')
                    Toast.fire({
                      icon: 'success',
                      title: `Credenciales Correctas, pero no autorizado`
                    })
                  }
                  
              
              }
            )
            .catch(err => {

              setPasswordFail(passwordFail+1)
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
                icon: 'error',
                title: `Contraseña erronea, intentelo de  nuevo`
              })
            })
            reset({
            password:''
            })
        }


  return (
        <div className={`g-sidenav-show  ${isPinned ? 'g-sidenav-pinned' : ''}`}>
    <Navbar/>
    <Aside/>
    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg pt-7">

    <section className="content">

  <div className="" style={{height:"90vh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
<div>
  <div className="lockscreen-logo">
  Hotel Las Marias
  </div>
  {/* User name */}
  <div className="lockscreen-name">{msg? <span style={{color:"red"}}>{msg} </span>: user?.censu?.firstName}</div>
  {/* START LOCK SCREEN ITEM */}
  <div className="lockscreen-item">
    {/* lockscreen image */}
    
    {
      msg=="No cumple con los permisos"?"":
<>
<div className="lockscreen-image" style={{ marginTop: "15px" }}>
  <img 
    src={`${user?.picture} || ${import.meta.env.VITE_API_SERVER}/api/v1/images/images/nobody.jpg`} 
    alt="Imagen de usuario" 
    onError={(e) => {
      e.target.src=`${import.meta.env.VITE_API_SERVER}/api/v1/images/images/nobody.jpg` 
    }}
  />
</div>

    
    <form className="lockscreen-credentials"onSubmit={handleSubmit(submit) }>
      <div className="input-group p-2">
        <input
        {...register('password')} 
        autoFocus
        id="password" 
        required
        className="form-control no-border"
        type="password" 
        placeholder="Contraseña" 
        autoComplete='new-password'
        />

     <div className='' style={{minHeight:40}}>
     <span className="input-group-append " style={{marginRight:'-3px', minHeight:"40px"}}>
  <button type="submit" className="  btn-default" style={{border:0,  minWidth:"60px"}}> <i className="fas fa-arrow-right " /></button>
    </span>
</div>
      
      </div>
    </form>
    </>
    }
    {/* /.lockscreen credentials */}
  </div>
  {/* /.lockscreen-item */}
  <div className="help-block text-center ">
    <small style={{display:"block"}}>
    Se nececita confirmar identidad para acceder a esta área
    </small>
  </div>
  <div className="text-center p-2 m-4">
    <Link className='link-primary' to='/logout'>Iniciar con otro usuario</Link>
  </div>
  </div>
  </div>
    </section>

    </main>
</div>
  )
}

export default LockAdmin