// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamList from './components/TeamList';
import SprintDetails from './components/SprintDetails';
import SprintDetailPage from './components/SprintDetailPage'; // New component for sprint details

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeamList />} />
        <Route path="/sprints/:teamId" element={<SprintDetails />} />
        <Route path="/sprint/:teamId/:sprintId" element={<SprintDetailPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
