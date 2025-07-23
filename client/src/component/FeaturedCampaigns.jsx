import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const badgeColors = {
  Tech: "bg-blue-100 text-blue-700",
  Medical: "bg-red-100 text-red-700",
  Education: "bg-yellow-100 text-yellow-700",
  Emergency: "bg-orange-100 text-orange-700",
  Animals: "bg-sky-100 text-sky-700"
};

const featuredProject = {
  title: "Tech for All: Rural Internet Access",
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  organizer: "ConnectNow Foundation",
  description: "Bringing high-speed internet to underserved rural communities.",
  targetAmount: 12000,
  goal: 20000,
  daysLeft: 15,
  fundedPercent: 60,
  tags: ["Tech", "Rural", "Internet"],
  location: "Iowa, USA"
};

export const recommendedCampaigns = [
  {
    id: 1,
    title: "Emergency Surgery for Bella",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=80",
    organizer: "Sarah Lee",
    targetAmount: 8500,
    goal: 10000,
    daysLeft: 7,
    fundedPercent: 85,
  },
  {
    id: 2,
    title: "Books for Every Child",
    category: "Education",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
    organizer: "Read2Grow",
    targetAmount: 4300,
    goal: 6000,
    daysLeft: 22,
    fundedPercent: 72,
  },
  {
    id: 3,
    title: "Wildlife Rescue Emergency Fund",
    category: "Animals",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    organizer: "WildCare",
    targetAmount: 6700,
    goal: 10000,
    daysLeft: 12,
    fundedPercent: 67,
  },
  {
    id: 4,
    title: "Disaster Relief for Flood Victims",
    category: "Emergency",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    organizer: "ReliefNow",
    targetAmount: 15000,
    goal: 25000,
    daysLeft: 5,
    fundedPercent: 60,
  },
  {
    id: 5,
    title: "STEM Kits for Girls",
    category: "Education",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
    organizer: "GirlsInTech",
    targetAmount: 3200,
    goal: 5000,
    daysLeft: 18,
    fundedPercent: 64,
  },
  {
    id: 6,
    title: "Mobile Health Clinic",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    organizer: "HealthOnWheels",
    targetAmount: 9100,
    goal: 15000,
    daysLeft: 10,
    fundedPercent: 61,
  },
  {
    id: 7,
    title: "Animal Shelter Expansion",
    category: "Animals",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80",
    organizer: "SafePaws",
    targetAmount: 5400,
    goal: 8000,
    daysLeft: 20,
    fundedPercent: 68,
  },
  {
    id: 8,
    title: "Earthquake Emergency Response",
    category: "Emergency",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    organizer: "QuakeAid",
    targetAmount: 20000,
    goal: 30000,
    daysLeft: 3,
    fundedPercent: 67,
  }
];

const CAMPAIGNS_PER_PAGE = 4;

// Fallback campaign data
const fallbackCampaigns = [
  {
    _id: "1",
    title: "Help Build a School in Rural India",
    description: "Support education for underprivileged children by helping us build a new school in rural India.",
    category: "Education",
    targetAmount: 50000,
    raisedAmount: 25000,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "2",
    title: "Save the Endangered Tigers",
    description: "Help protect endangered tigers and their natural habitat through conservation efforts.",
    category: "Animals",
    targetAmount: 75000,
    raisedAmount: 45000,
    image: "https://images.unsplash.com/photo-1534567110353-1f46f72192e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "3",
    title: "Clean Ocean Initiative",
    description: "Join our mission to clean up ocean pollution and protect marine life.",
    category: "Environment",
    targetAmount: 100000,
    raisedAmount: 60000,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

export default function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('https://funddaddy-backend.onrender.com/api/campaigns');
      if (response.data && response.data.length > 0) {
        // Get the 3 most funded campaigns
        const sortedCampaigns = response.data
          .sort((a, b) => b.raisedAmount - a.raisedAmount)
          .slice(0, 3);
        setCampaigns(sortedCampaigns);
      } else {
        setCampaigns(fallbackCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load featured campaigns. Showing sample campaigns instead.');
      setCampaigns(fallbackCampaigns);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center text-xl text-gray-600">Loading featured campaigns...</div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Campaigns
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover and support these amazing causes making a difference in the world.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Link
              key={campaign._id}
              to={`/campaign/${campaign._id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {campaign.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-sky-500 transition">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%` }}
                    ></div>
                  </div>
                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="font-bold text-sky-500">
                        ${campaign.raisedAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-600"> raised</span>
                    </div>
                    <div className="text-gray-600">
                      of ${campaign.targetAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/campaigns"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
          >
            View All Campaigns
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
