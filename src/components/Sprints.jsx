import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
} from "recharts";
import config from '../config';

function Sprints() {
  const [sprints, setSprints] = useState([]);
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [sprintVelocities, setSprintVelocities] = useState([]);
  const [sprintWithLoBF, setSprintWithLoBF] = useState([]);

  const handleSprintClick = (sprintId) => {
    navigate(`/sprint/${teamId}/${sprintId}`);
  };

  const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
      <Text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor="middle"
        verticalAnchor="start"
      >
        {payload.value}
      </Text>
    );
  };

  function calculateBestFitLineForVelocity(data) {
    let n = data.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    // Assuming x is the index of the sprint for simplicity
    data.forEach((item, index) => {
      let x = index;
      let y = item.velocity;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  function calculateBestFitLineForBugs(data) {
    let n_bug = data.length;
    let sumX_bug = 0,
      sumY_bug = 0,
      sumXY_bug = 0,
      sumXX_bug = 0;

    data.forEach((item, index) => {
      let x_bug = index;
      let y_bug = item.bugs;
      sumX_bug += x_bug;
      sumY_bug += y_bug;
      sumXY_bug += x_bug * y_bug;
      sumXX_bug += x_bug * x_bug;
    });

    let bug_slope =
      (n_bug * sumXY_bug - sumX_bug * sumY_bug) /
      (n_bug * sumXX_bug - sumX_bug * sumX_bug);
    let bug_intercept = (sumY_bug - bug_slope * sumX_bug) / n_bug;

    // console.log("SlopeBug2", bug_slope);
    return { bug_slope, bug_intercept };
  }

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/Sprints/${teamId}`
        );
        const sprintData = await response.json();
        setSprints(sprintData);

        // Find the index of the current sprint using the timeFrame property
        const currentIndex = sprintData.findIndex(sprint => sprint.timeFrame === 'current');

        // If there is a current sprint, slice the array from the current sprint backwards by 5 sprints
        const recentSprints = currentIndex >= 0
          ? sprintData.slice(Math.max(0, currentIndex - 4), currentIndex + 1).reverse()
          : [];

        const velocities = await Promise.all(
          recentSprints.map(async (sprint) => {
            const response = await fetch(
              `${config.API_BASE_URL}/Teams/${teamId}/sprint/${sprint.id}`
            );
            const details = await response.json();
            const totalVelocity = details.teamMembers.reduce(
              (acc, member) => acc + member.velocity,
              0
            );
            const totalBugs = details.teamMembers.reduce(
              (acc, member) => acc + member.bugsCompleted,
              0
            );
            return {
              name: sprint.name,
              velocity: totalVelocity,
              bugs: totalBugs,
            };
          })
        );

        setSprintVelocities(velocities.reverse());
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };

    fetchSprints();
  }, [teamId]);

  useEffect(() => {
    if (sprintVelocities.length) {
      const { slope, intercept } =
        calculateBestFitLineForVelocity(sprintVelocities);
      const { bug_slope, bug_intercept } =
        calculateBestFitLineForBugs(sprintVelocities);

      const combinedData = sprintVelocities.map((sprint, index) => ({
        ...sprint,
        lineOfBestFit: Math.round((slope * index + intercept) * 100) / 100,
        lineOfBestFitBugs:
          Math.round((bug_slope * index + bug_intercept) * 100) / 100,
      }));

      setSprintWithLoBF(combinedData);
    }
  },[sprintVelocities]);


  return (
    <>
      <div className="w-full flex flex-col items-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Sprint Metrics</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ width: "50%" }}>
            <h3 className="text-center text-xl font-bold text-white mb-4">
              Sprint Velocities
            </h3>
            <div className="w-full max-w-4xl">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={sprintWithLoBF}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    height={60}
                    tick={<CustomizedAxisTick />}
                  />
                  <YAxis
                    label={{
                      value: "Velocity",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="velocity" fill="#8884d8" />
                  <Line
                    type="monotone"
                    dataKey="lineOfBestFit"
                    stroke="red"
                    strokeWidth={3}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>


        <div style={{ width: "50%" }}>
            <h3 className="text-center text-xl font-bold text-white mb-4">
              Sprint Bugs
            </h3>
            <div className="w-full max-w-4xl">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={sprintWithLoBF}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  height={60}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis
                  label={{ value: "Bugs", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Bar dataKey="bugs" fill="#8884d8" />
                <Line
                  type="monotone"
                  dataKey="lineOfBestFitBugs"
                  stroke="red"
                  strokeWidth={3}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap justify-center items-stretch">
        {sprints.map((sprint) => (
          <div
            key={sprint.id}
            className="cursor-pointer max-w-sm flex flex-col rounded overflow-hidden shadow-lg bg-blue-50 m-4 p-4 hover:bg-blue-100 transition-colors"
            onClick={() => handleSprintClick(sprint.id)}
            style={{ minHeight: "200px" }}
          >
            <div className="font-bold text-xl mb-2 text-gray-800">
              {sprint.name}
            </div>
            <p className="text-gray-700 text-base">
              Start Date: {new Date(sprint.startDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700 text-base">
              End Date: {new Date(sprint.finishDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Sprints;
