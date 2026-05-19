const Complaint = require('../models/Complaint');

// @desc    Analyze complaint text and update the complaint with AI generated fields
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaint = async (req, res, next) => {
  try {
    const { text, complaintId } = req.body;

    if (!text || !complaintId) {
      res.status(400);
      throw new Error('Please provide text and complaintId');
    }

    const complaint = await Complaint.findById(complaintId);
    
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    // Check ownership
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }

    // --- Mock AI Logic ---
    // In a real application, you would call Gemini or OpenAI API here
    
    let urgency = 'Low';
    let department = 'General Support';
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('water') || lowerText.includes('leak')) {
      department = 'Water Supply';
      if (lowerText.includes('urgent') || lowerText.includes('flood')) urgency = 'High';
      else urgency = 'Medium';
    } else if (lowerText.includes('electric') || lowerText.includes('power') || lowerText.includes('wire')) {
      department = 'Electricity Board';
      urgency = 'High';
    } else if (lowerText.includes('garbage') || lowerText.includes('trash') || lowerText.includes('clean')) {
      department = 'Sanitation';
      urgency = 'Medium';
    } else if (lowerText.includes('road') || lowerText.includes('pothole') || lowerText.includes('traffic')) {
      department = 'Public Works';
      urgency = 'Medium';
    } else if (lowerText.includes('emergency') || lowerText.includes('danger')) {
      urgency = 'High';
    }

    const summary = `User reported an issue related to ${department}. The text indicates a ${urgency.toLowerCase()} urgency level.`;
    const autoResponse = `Thank you for your report. We have classified your issue under ${department} with ${urgency} urgency. Our team will look into it shortly.`;

    const aiResult = {
      urgency,
      department,
      summary,
      autoResponse
    };

    // Update the complaint with AI analysis
    complaint.aiAnalysis = aiResult;
    await complaint.save();

    res.status(200).json(aiResult);
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeComplaint };
