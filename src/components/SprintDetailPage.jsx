import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';
import Header from './Header';

function SprintDetailPage() {
  const [sprintDetails, setSprintDetails] = useState(null);
  const { teamId, sprintId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprintDetails = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/Teams/${teamId}/sprint/${sprintId}`);
        const data = await response.json();
        setSprintDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sprint details:", error);
        setLoading(false);
      }
    };

    fetchSprintDetails();
  }, [teamId, sprintId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
              <p className="text-gray-800 text-xl">Loading...</p>
           </div>;
  }

  if (!sprintDetails) {
    return <div className="flex justify-center items-center h-screen">
              <p className="text-gray-800 text-xl">No sprint details available.</p>
           </div>;
  }

  return (
    <div className="flex flex-col items-center justify-start pt-10 h-screen text-white">
      <Header />
      <h3 className="pt-20 text-3xl font-bold mb-6">{sprintDetails.name}</h3>
      <div className="w-full max-w-4xl px-4">
        {sprintDetails.teamMembers.map(member => (
          <div key={member.displayName} className="bg-gray-800 p-6 my-4 shadow-lg rounded-lg">
            <h4 className="text-2xl font-semibold">{member.displayName}</h4>
            <p>User Stories Completed: {member.userStoriesCompleted}</p>
            <p>Bugs Completed: {member.bugsCompleted}</p>
            <p>Issues Completed: {member.issuesCompleted}</p>
            <p>Velocity: {member.velocity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SprintDetailPage;
