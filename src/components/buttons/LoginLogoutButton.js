import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link,useLocation } from 'react-router-dom';

const LoginLogoutButton = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isAuthenticated){
    return (
      <>
        {!isLandingPage && (
          <button className="button" onClick={() => window.history.back()}>Back</button>
        )}

      <Link to={`/profile`}>
      <button className="button">View my Profile</button> 
       </Link>
      <button className="button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}> Log Out</button>

      </>
    );
  }
  else {
    return(
      <button className="button" onClick={() => loginWithRedirect()}>Log In</button>
    );
  } 
  }
 
export default LoginLogoutButton;