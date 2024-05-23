//Modules
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Components
import Home from '@/pages/Home';
import AuthPage from './pages/AuthPage';
import { Providers } from './components/Providers';

//Style
import '@/styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </Router>
    </Providers>
  </React.StrictMode>
);


