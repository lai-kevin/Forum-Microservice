// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/pages/welcome-page.jsx';
import FakeStackOverflow from './components/fakestackoverflow.js';
import LoginPage from './components/pages/login-page.jsx';
import AccountCreationPage from './components/pages/account-creation.jsx';
import UserProfilePage from './components/pages/user-profile-page.jsx';
import React, { useState } from 'react';
import { UserContext, UserProvider } from './contexts/user-context.js';
import PostCommentPage from './components/pages/post-comment-page.jsx';

function App() {
  return (
    <UserProvider>
      <Router>
        <section className="fakeso">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/fakestackoverflow" element={<FakeStackOverflow />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<AccountCreationPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/comment" element={<PostCommentPage />} />
          </Routes>
        </section>
      </Router>
    </UserProvider>
  );
}

export default App;




