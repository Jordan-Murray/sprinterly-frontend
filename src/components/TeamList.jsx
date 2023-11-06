// src/components/TeamList.js
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

function TeamList() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
        setLoading(true);
      try {
        const response = await fetch('https://app-sprinterlyapi-dev-uksouth.azurewebsites.net/api/Streets-Heaver/31b8a614-ef73-47ad-8375-9fe47cb4a2d5/Teams');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }finally {
        setLoading(false); 
      }
    };

    fetchTeams();
  }, []);

  const handleCardClick = (teamId) => {
    navigate(`/sprints/${teamId}`);
  };

  const content = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen"> {/* Full screen height */}
          <div className="loader"></div> {/* Replace with your preferred loading indicator */}
        </div>
      );
    } else if (teams.length === 0 && !loading) {
      return <p>No teams found. Please try again later.</p>;
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teams.map(team => (
            <Card key={team.id} {...team} onClick={() => handleCardClick(team.id)} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      {content()}
    </div>
  );
}

export default TeamList;
