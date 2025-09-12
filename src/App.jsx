import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamesPage from './components/GamePages';
import GameLoader from './components/GameLoader';
import FeedBack from './components/FeedBack';
import Contact from './components/Contact';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:gameId" element={<GameLoader />} />
        <Route path="/feedback" element={<FeedBack />} />
        <Route path='/Contact' element={<Contact/>}/>
      </Routes>
    </Router>
  );
}

export default App;
