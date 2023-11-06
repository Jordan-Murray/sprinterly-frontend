// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamList from './components/TeamList';
import Sprints from './components/Sprints';
import SprintDetailPage from './components/SprintDetailPage'; // New component for sprint details

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeamList />} />
        <Route path="/sprints/:teamId" element={<Sprints />} />
        <Route path="/sprint/:teamId/:sprintId" element={<SprintDetailPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
