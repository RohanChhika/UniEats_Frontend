import './App.css';
import LoginButton from './components/buttons/LoginButton';
import LogoutButton from './components/buttons/LogoutButton';
import FetchDataComponent from './components/fetchtest';
import Welcome from './components/Pages/welcome';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LoginButton />
      </header>

      <main>
        <Welcome />
        <FetchDataComponent />

      </main>

      <footer className="App-footer">
        <LogoutButton />
      </footer>
    </div>
  );
}

export default App;
