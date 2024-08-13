import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Header from './Header';

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.API_BASE_URL}/Teams`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeams(data);
        setFilteredTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter(team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  const handleCardClick = (teamId) => {
    navigate(`/sprints/${teamId}`);
  };

  const handleSort = (order) => {
    const sortedTeams = [...filteredTeams].sort((a, b) => {
      if (order === 'asc') {
        return a.numberOfMembers - b.numberOfMembers;
      } else {
        return b.numberOfMembers - a.numberOfMembers;
      }
    });
    setFilteredTeams(sortedTeams);
  };

  const content = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="loader"></div>
        </div>
      );
    } else if (filteredTeams.length === 0 && !loading) {
      return <p>No teams found. Please try again later.</p>;
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeams.map(team => (
            <Card key={team.id} {...team} onClick={() => handleCardClick(team.id)} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="pt-20">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          {content()}
        </div>
      </section>
    </div>
  );
}

export default TeamList;
