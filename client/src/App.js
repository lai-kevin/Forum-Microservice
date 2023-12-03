// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/pages/welcome-page.jsx';
import FakeStackOverflow from './components/fakestackoverflow.js';

function App() {
  return (
    <Router>
      <section className="fakeso">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/fakestackoverflow" element={<FakeStackOverflow />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
