import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function ChartView({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  // Count frequency of job titles
  const jobCount = {};
  data.forEach(row => {
    const job = row['Job Title'];
    if (job) {
      jobCount[job] = (jobCount[job] || 0) + 1;
    }
  });

  // Convert to array and take top 10
  const chartData = Object.entries(jobCount)
    .map(([job, count]) => ({ job, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div style={{ width: '100%', height: 400, marginTop: 50 }}>
      <h3 style={{ textAlign: 'center' }}>Top 10 Job Titles</h3>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="job" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#0077cc" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartView;
