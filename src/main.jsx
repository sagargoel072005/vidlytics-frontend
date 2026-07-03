import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provider store={appStore}>
      <App />
       <Toaster position="top-right" />
    </Provider>
  </StrictMode>,
)
