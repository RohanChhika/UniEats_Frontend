import './App.css';
import LoginLogoutButton from './components/buttons/LoginLogoutButton';
import Welcome from './components/Pages/welcome';
import LandingPage from './components/Pages/LandingPage';
import { useAuth0 } from "@auth0/auth0-react";
import MenuPage from './components/Pages/menu';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewForm from './components/Pages/review';
import ReservationPage from './components/Pages/Reservation';
import Profile from './components/Pages/Profile';


function App() {
  const { isAuthenticated } = useAuth0();

  
  return (
    <div className="App">
      <header className="navbar">
        <section className="navbar-logo">UNIEATS</section> 
        <ul className="navbar-links">
          <LoginLogoutButton className="login-button"/>
        </ul>
      </header>

      <main>
          <Routes>
            <Route path="/" element={isAuthenticated ? <LandingPage /> : <Welcome />} />
            <Route path="/restaurant/:name" element={<MenuPage />} />
            <Route path="/review/:name" element ={<ReviewForm/>}/>
            <Route path="/reservation/:name" element ={<ReservationPage/>}/>
            <Route path="/profile" element ={<Profile/>}/>

            {/* Add any additional routes here */}
          </Routes>
        </main>
      <footer className="App-footer">
        <p>© 2024 UNIEATS. All rights reserved.</p>
        <aside className="footer-links"> 
          <a href="#about">About Us</a>
          <a href="#features">Our Services</a>
        </aside>
      </footer>
      
    </div>
  );
}

export default App;
