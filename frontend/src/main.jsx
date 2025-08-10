import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import UserContext from './context/UserContext.jsx';
import CaptainContext from './context/CapatainContext.jsx';
import SocketProvider from './context/SocketContext.jsx';
import { PaymentProvider } from './context/PaymentContext.jsx';

createRoot(document.getElementById('root')).render(

  <CaptainContext>
    <UserContext>
      <PaymentProvider>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </PaymentProvider>
    </UserContext>
  </CaptainContext>

)
