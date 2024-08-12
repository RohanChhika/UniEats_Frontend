import logo from './logo.svg';
import './App.css';
import LoginButton from './components/buttons/LoginButton';
import LogoutButton from './components/buttons/LogoutButton';
import Profile from './components/Pages/Profile';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          <LoginButton/>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p> <Profile/> </p>
        <LogoutButton/>
      </header>
    </div>
  );
}

export default App;
