import React, { useRef } from 'react';

const ErrorSimulator = () => {
  const inputRef = useRef(null);

  const triggerError = () => {
    // This will throw InvalidStateError because the input type is number
    if (inputRef.current) {
      inputRef.current.setSelectionRange(0, 2);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Simulador de Error</h3>
      <input type="number" ref={inputRef} placeholder="Número" />
      <button onClick={triggerError} style={{ marginLeft: '10px' }}>
        Simular error
      </button>
    </div>
  );
};

export default ErrorSimulator;
