import React from 'react'
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LogOutQuestion = () => {
    const Confirm = ()=>{
    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        <Navigate to='/logout' />;
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  return (
    <div onLoad={Confirm()}>LogOutQuestion
  
    </div>
  )
}

export default LogOutQuestion