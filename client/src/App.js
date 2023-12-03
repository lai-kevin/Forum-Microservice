// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/pages/welcome-page.jsx';
import FakeStackOverflow from './components/fakestackoverflow.js';
import LoginPage from './components/pages/login-page.jsx';
import AccountCreationPage from './components/pages/account-creation.jsx';
import UserProfilePage from './components/pages/user-profile-page.jsx';
import React, { useContext, createContext, useState } from 'react';

// Create a new context for user information
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({username: "", email: ""});
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Router>
        <section className="fakeso">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/fakestackoverflow" element={<FakeStackOverflow />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<AccountCreationPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </section>
      </Router>
    </UserContext.Provider>
  );
}

export default App;




