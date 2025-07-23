const Campaign = require("../models/campaign");

exports.createCampaign = async (req, res) => {
  const { title, description, targetAmount, image, category, location, endDate } = req.body;
  const campaign = new Campaign({
    title,
    description,
    targetAmount,
    category,
    location,
    endDate,
    image,
    creator: req.user.id,
  });
  await campaign.save();
  res.status(201).json(campaign);
};

exports.getAllCampaigns = async (req, res) => {
  const campaigns = await Campaign.find().populate("creator", "name");
  res.json(campaigns);
  console.log(campaigns);
};


exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Allow deletion only by the creator
    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Error deleting campaign' });
  }
};


exports.donate = async (req, res) => {
  const { amount } = req.body;
  const campaign = await Campaign.findById(req.params.id);
  campaign.raisedAmount += amount;
  
  
  if (campaign.raisedAmount >= campaign.targetAmount) {
    campaign.status = "ended";
  }
  
  await campaign.save();
  res.json(campaign);
};
