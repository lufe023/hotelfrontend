import React from 'react'

const Amenities = ({room}) => {
  return (
    <div>
          <div>
    <h5 className="mb-3">Amenidades Disponibles</h5>
    <div className="d-flex justify-content-start gap-5" style={{ flexWrap: "wrap" }}>
      <div className="text-center">
        <i className="fas fa-bed text-primary mb-1" style={{ fontSize: "15px" }}></i>
        <p className="text-sm mb-0">{room.bedQuantity} cama{room.bedQuantity > 1 ? "s" : ""}</p>
      </div>
      <div className="text-center">
        <i className="fas fa-user-friends text-primary mb-1" style={{ fontSize: "15px" }}></i>
        <p className="text-sm mb-0">{room.maxOccupancy} persona{room.maxOccupancy > 1 ? "s" : ""}</p>
      </div>
      {room.hotWater && (
  <div className="text-center">
    <i className="fas fa-temperature-high text-primary mb-1" style={{ fontSize: "15px" }}></i>
    <p className="text-sm mb-0">Agua Caliente</p>
  </div>
)}
    {room.privateBathroom && (
    <div className="text-center">
      <i className="fas fa-bath text-primary mb-1" style={{ fontSize: "15px" }}></i>
      <p className="text-sm mb-0">Baño Privado</p>
    </div>
  )}
      {room.wifi && (
        <div className="text-center">
          <i className="fas fa-wifi text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Wifi</p>
        </div>
      )}
      {room.landscapeView && (
        <div className="text-center">
          <i className="fas fa-mountain text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Vista a Paisaje</p>
        </div>
      )}
      {room.balcony && (
        <div className="text-center">
          <i className="fas fa-hotel text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Balcón</p>
        </div>
      )}
      {room.tv && (
        <div className="text-center">
          <i className="fas fa-tv text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">TV</p>
        </div>
      )}
      {room.minibar && (
        <div className="text-center">
          <i className="fas fa-wine-bottle text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Minibar</p>
        </div>
      )}
      {room.coffeeMaker && (
        <div className="text-center"> 
          <i className="fas fa-coffee text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Cafetera</p>
        </div>
      )}
          {room.minibar && (
            <div className="text-center">
              <i className="fas fa-glass-cheers text-primary mb-1" style={{ fontSize: "15px" }}></i>
              <p className="text-sm mb-0">Minibar</p>
            </div>
          )}
      {room.airConditioning && (
        <div className="text-center">
          <i className="fas fa-snowflake text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Aire Acondicionado</p>
        </div>
      )}
      {room.safeBox && (
       <div className="text-center">
         <i className="fas fa-lock text-primary mb-1" style={{ fontSize: "15px" }}></i>
         <p className="text-sm mb-0">Caja Fuerte</p>
       </div>
     )}

      {room.breakfastIncluded && (
        <div className="text-center">
          <i className="fas fa-bread-slice text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Desayuno Incluido</p>
        </div>
      )}

    {room.parking && (
        <div className="text-center">
          <i className="fas fa-parking text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Parqueo</p>
        </div>
      )}
    {room.poolAccess && (
        <div className="text-center">
          <i className="fas fa-swimmer text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Piscina</p>
        </div>
      )}

    {room.gymAccess && (
        <div className="text-center">
          <i className="fas fa-dumbbell text-primary mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a gimnasio</p>
        </div>
      )}


    </div>
  </div>
  <hr className='bg-primary'/>
  <div>
    <h5 className="mb-3">Amenidades No Disponibles</h5>
    <div className="d-flex justify-content-start gap-5" style={{ flexWrap: "wrap" }}>
      {!room.hotWater && (
        <div className="text-center">
          <i className="fas fa-temperature-high text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Agua Caliente</p>
        </div>
      )}
      {!room.privateBathroom && (
    <div className="text-center">
      <i className="fas fa-bath text-dark mb-1" style={{ fontSize: "15px" }}></i>
      <p className="text-sm mb-0">Baño Privado</p>
    </div>
  )}
      {!room.wifi && (
        <div className="text-center">
          <i className="fas fa-wifi text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Wifi</p>
        </div>
      )}
      {!room.landscapeView && (
        <div className="text-center">
          <i className="fas fa-mountain text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Vista a Paisaje</p>
        </div>
      )}
      {!room.balcony && (
        <div className="text-center">
          <i className="fas fa-hotel text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Balcón</p>
        </div>
      )}
      {!room.tv && (
        <div className="text-center">
          <i className="fas fa-tv text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">TV</p>
        </div>
      )}
      {!room.minibar && (
        <div className="text-center">
          <i className="fas fa-glass-cheers text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Minibar</p>
        </div>
      )}
       {!room.coffeeMaker && (
        <div className="text-center"> 
          <i className="fas fa-coffee text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Cafetera</p>
        </div>
      )}
      {!room.airConditioning && (
        <div className="text-center">
          <i className="fas fa-snowflake text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Aire Acondicionado</p>
        </div>
      )}
      {!room.safeBox && (
        <div className="text-center">
          <i className="fas fa-lock text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Caja Fuerte</p>
        </div>
      )}

      {!room.breakfastIncluded && (
        <div className="text-center">
          <i className="fas fa-bread-slice text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Desayuno No inluido</p>
        </div>
      )}

    {!room.parking && (
        <div className="text-center">
          <i className="fas fa-parking text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Parqueo</p>
        </div>
      )}

    {!room.poolAccess && (
        <div className="text-center">
          <i className="fas fa-swimmer text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a Piscina</p>
        </div>
      )}

    {!room.gymAccess && (
        <div className="text-center">
          <i className="fas fa-dumbbell text-dark mb-1" style={{ fontSize: "15px" }}></i>
          <p className="text-sm mb-0">Acceso a gimnasio</p>
        </div>
      )}

    </div>
  </div>
    </div>
  )
}

export default Amenities