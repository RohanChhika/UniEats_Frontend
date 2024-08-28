import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginLogoutButton = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  if (isAuthenticated){
    return (
      <>
      <button className="button">Cart</button>
      <button className="button">View my Profile</button> 
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