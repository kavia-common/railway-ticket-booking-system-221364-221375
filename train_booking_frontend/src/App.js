import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RoutesContainer from './routes';
import Navbar from './components/Navbar.jsx';
import { AuthProvider } from './context/AuthContext';

// PUBLIC_INTERFACE
function App() {
  /** Root app sets theme, provides Auth, and renders navbar + routed views */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <header className="navbar-wrapper">
            <Navbar theme={theme} onToggleTheme={toggleTheme} />
          </header>
          <main className="container" role="main" aria-live="polite">
            <RoutesContainer />
          </main>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
