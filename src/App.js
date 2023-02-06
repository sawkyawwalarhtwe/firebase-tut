import * as React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewInvoice from './newinvoice';
import UpdateInvoice from './updateInvoice';
function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Routes>
        <Route >
        <Route path="/" element={<NewInvoice />} />
        <Route path="/update" element={<UpdateInvoice />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
