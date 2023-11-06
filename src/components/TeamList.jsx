// src/components/TeamList.js
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

function TeamList() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('https://app-sprinterlyapi-dev-uksouth.azurewebsites.net/api/Streets-Heaver/31b8a614-ef73-47ad-8375-9fe47cb4a2d5/Teams');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleCardClick = (teamId) => {
    navigate(`/sprints/${teamId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {teams.map(team => (
        <Card key={team.id} {...team} onClick={() => handleCardClick(team.id)} />
      ))}
    </div>
  );
}

export default TeamList;
