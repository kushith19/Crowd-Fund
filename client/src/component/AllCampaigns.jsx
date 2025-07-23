import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

export default function AllCampaigns() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", "Animals", "Education", "Medical", "Environment", "Technology", "Emergency"];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('https://funddaddy-backend.onrender.com/api/campaigns');
      if (response.data && response.data.length > 0) {
        setCampaigns(response.data);
      } else {
        setCampaigns(fallbackCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns. Showing sample campaigns instead.');
      setCampaigns(fallbackCampaigns);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedCategory === "All" || campaign.category === selectedCategory
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.endDate) - new Date(a.endDate);
      case "oldest":
        return new Date(a.endDate) - new Date(b.endDate);
      case "mostFunded":
        return b.raisedAmount - a.raisedAmount;
      case "endingSoon":
        return new Date(a.endDate) - new Date(b.endDate);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading campaigns...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Campaigns</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore and support innovative projects that are making a difference. From technology to education,
            find the perfect campaign to back.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${selectedCategory === category
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostFunded">Most Funded</option>
            <option value="endingSoon">Ending Soon</option>
          </select>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCampaigns.map((campaign) => (
            <Link
              key={campaign._id}
              to={`/campaign/${campaign._id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover"
                />
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.raisedAmount >= campaign.targetAmount || campaign.status === 'ended'
                      ? 'bg-red-100 text-red-800'
                      : new Date(campaign.endDate) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.raisedAmount >= campaign.targetAmount || campaign.status === 'ended'
                      ? 'Ended'
                      : new Date(campaign.endDate) > new Date()
                        ? 'Active'
                        : 'Ended'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-sky-600 transition">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{campaign.category}</span>
                  <span>{campaign.location}</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{
                        width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">
                      ${campaign.raisedAmount.toLocaleString()} raised
                    </span>
                    <span className="text-gray-600">
                      of ${campaign.targetAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sortedCampaigns.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </>
  );
} 