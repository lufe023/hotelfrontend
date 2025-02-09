import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const FirmaCliente = ({ onSave, onCancel }) => {
  const sigCanvas = useRef({});

  
  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    onSave(signature);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigCanvas}
        canvasProps={{ width: 300, height: 200, className: 'sigCanvas' }}
      />
      <button onClick={clear}>Limpiar</button>
      <button onClick={save}>Guardar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default FirmaCliente;