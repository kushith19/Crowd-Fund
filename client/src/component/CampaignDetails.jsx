import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await axios.get(`https://funddaddy-backend.onrender.com
/api/campaigns/${id}`);
      setCampaign(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load campaign details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donationAmount || donationAmount <= 0) {
      setError("Please enter a valid donation amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `https://funddaddy-backend.onrender.com
/api/campaigns/${id}/donate`,
        { amount: Number(donationAmount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchCampaignDetails();
      setDonationAmount("");
      setError("");
    } catch (error) {
      console.error("Error making donation:", error);
      setError(
        error.response?.data?.message ||
          "Failed to process donation. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </>
    );
  }

  if (error && !campaign) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-xl text-gray-600">Campaign not found</div>
        </div>
      </>
    );
  }

  const progress = (campaign.raisedAmount / campaign.targetAmount) * 100;
  const daysLeft = Math.ceil(
    (new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-[50vh] object-cover"
          />
          <div className="absolute inset-0 z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-indigo-600 rounded-full text-sm font-medium">
                    {campaign.category}
                  </span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      daysLeft > 0 ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : "Campaign ended"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {campaign.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Campaign Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Section */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-4xl font-bold text-indigo-600">
                      ${campaign.raisedAmount.toLocaleString()}
                    </div>
                    <div className="text-gray-500 mt-1">
                      raised of ${campaign.targetAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-indigo-600">
                      {Math.min(Math.round(progress), 100)}%
                    </div>
                    <div className="text-gray-500 mt-1">funded</div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-blue-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About this campaign
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {campaign.description}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium text-gray-900">
                        {campaign.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">End Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Organizer</div>
                      <div className="font-medium text-gray-900">
                        {campaign.creator?.name || "Anonymous"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-medium text-gray-900">
                        {daysLeft > 0 ? "Active" : "Ended"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Donation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-8 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Support this campaign
                </h3>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Donation Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        id="amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter amount"
                        min="1"
                        step="1"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!donationAmount || donationAmount <= 0) {
                        setError("Please enter a valid donation amount");
                      } else {
                        navigate("/donate", {
                          state: {
                            campaignId: campaign._id,
                            amount: Number(donationAmount),
                          },
                        });
                      }
                    }}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium text-lg"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
