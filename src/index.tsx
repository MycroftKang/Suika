import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './test';

window.addEventListener("beforeunload", (ev) => 
{  
    ev.preventDefault();
    return ev.returnValue = 'Are you sure you want to close?';
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<Test/>);
