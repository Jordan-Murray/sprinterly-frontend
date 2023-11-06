// src/components/SprintDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function SprintDetails() {
  const [sprints, setSprints] = useState([]);
  const { teamId } = useParams();
  const navigate = useNavigate();

  const handleSprintClick = (sprintId) => {
    navigate(`/sprint/${teamId}/${sprintId}`);
  };

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch(`https://app-sprinterlyapi-dev-uksouth.azurewebsites.net/api/Streets-Heaver/31b8a614-ef73-47ad-8375-9fe47cb4a2d5/Sprints/${teamId}`);
        const data = await response.json();
        setSprints(data);
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };

    fetchSprints();
  }, [teamId]);

  return (
    <div className="flex flex-wrap justify-center items-stretch m-4">
      {sprints.map(sprint => (
        <div key={sprint.id} 
            className="cursor-pointer max-w-sm rounded overflow-hidden shadow-lg bg-blue-50 m-4 p-4 hover:bg-blue-100 transition-colors"
            onClick={() => handleSprintClick(sprint.id)}>
          <div className="font-bold text-xl mb-2 text-gray-800">{sprint.name}</div>
          <p className="text-gray-700 text-base">
            Start Date: {new Date(sprint.startDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700 text-base">
            End Date: {new Date(sprint.finishDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SprintDetails;
