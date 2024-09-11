import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

// Create a root element to render the React application
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     {/* Wrap the application in BrowserRouter for routing */}
//     <BrowserRouter>
//     {/* Wrap the application in Auth0Provider for authentication */}
//       <Auth0Provider
//       domain="dev-vd2n3gc57jtwv2md.us.auth0.com"
//       clientId="V8FJtXTfBrMCtuR1cd9sdyLcRl7rWhIs"
//       authorizationParams={{
//       redirect_uri: window.location.origin,
//       audience:"http://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/"
//         }}
//       >
//         {/* Render the main App component */}
//         <App />
//       </Auth0Provider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-vd2n3gc57jtwv2md.us.auth0.com"
      clientId="V8FJtXTfBrMCtuR1cd9sdyLcRl7rWhIs"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "http://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/"
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
