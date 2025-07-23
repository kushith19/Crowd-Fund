import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://funddaddy-backend.onrender.com/api/campaigns/my-campaigns', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCampaigns(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      }
    };

    fetchUserCampaigns();
  }, [navigate]);

  const handleDeleteCampaign = async (campaignId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }

      const response = await axios.delete(`https://funddaddy-backend.onrender.com
/api/campaigns/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.message === "Campaign deleted successfully") {
        setCampaigns(campaigns.filter(campaign => campaign._id !== campaignId));
        setShowDeleteMenu(null);
      }
    } catch (error) {
      console.error('Error deleting campaign:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to delete campaign. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
              <p className="text-gray-600 mt-2">Manage and track your fundraising campaigns</p>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div 
                key={campaign._id} 
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                onClick={() => navigate(`/campaign/${campaign._id}`)}
              >
                <div className="relative">
                  {campaign.image ? (
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteMenu(showDeleteMenu === campaign._id ? null : campaign._id);
                      }}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    {showDeleteMenu === campaign._id && (
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleDeleteCampaign(campaign._id, e)}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Campaign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {campaign.category}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'ended' || campaign.raisedAmount >= campaign.targetAmount
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {campaign.status === 'ended' || campaign.raisedAmount >= campaign.targetAmount ? 'Ended' : 'Active'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{campaign.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                  
                  {/* Campaign Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round((campaign.raisedAmount || 0) / campaign.targetAmount * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((campaign.raisedAmount || 0) / campaign.targetAmount * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">Target: ${campaign.targetAmount}</p>
                      <p className="text-sm font-medium text-blue-600">Raised: ${campaign.raisedAmount || 0}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {campaigns.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">No Campaigns Yet</h2>
                <p className="text-gray-600 mb-8">Start your fundraising journey by creating your first campaign.</p>
                <button
                  onClick={() => navigate('/create-campaign')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Create Your First Campaign
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard; 