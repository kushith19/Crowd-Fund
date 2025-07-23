import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: '',
    endDate: '',
    location: '',
    image: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Prepare the campaign data
      const campaignData = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        raisedAmount: 0 // Initialize with 0
      };

      // Make the API call
      const response = await axios.post(
        'https://funddaddy-backend.onrender.com/api/campaigns',
        campaignData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Campaign created:', response.data);
      navigate('/campaigns'); // Redirect to campaigns page after successful creation
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError(error.response?.data?.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Create Your Campaign</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a compelling title for your campaign"
                />
              </div>

              {/* Campaign Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Campaign Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your campaign and its impact"
                />
              </div>

              {/* Goal Amount */}
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                  Goal Amount ($)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  id="targetAmount"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="Enter your funding goal"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="Education">Education</option>
                  <option value="Animals">Animals</option>
                  <option value="Environment">Environment</option>
                  <option value="Medical">Medical</option>
                  <option value="Technology">Technology</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where will this campaign take place?"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  Campaign End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Campaign Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter the URL of your campaign image"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    loading ? 'bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500`}
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 