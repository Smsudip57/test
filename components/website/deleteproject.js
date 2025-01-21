'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DeleteProject() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch projects on component mount
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/project/get', { withCredentials: true });
        if (response.data.success) {
          console.log(response.data.data);
          setProjects(response.data.data);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        setError('Error fetching projects');
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/project/delete',
        { _id: projectId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setSuccess('Project deleted successfully!');
        setProjects(projects.filter((project) => project._id !== projectId));
      } else {
        setError('Error deleting project');
      }
    } catch (err) {
      setError('Error deleting project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Delete Project</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project._id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{project.Title}</h2>
              <p className="text-gray-600">{project.detail}</p>
            </div>
            <button
              onClick={() => handleDelete(project._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
