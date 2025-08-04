const User = require('../models/User');

exports.getUserDetails = async (req, res) => {
  try {
    const { uniqueid } = req.params;

    if (!uniqueid) {
      return res.status(400).json({ success: false, error: 'Missing uniqueid in URL' });
    }

    // Fetch only user data
    const user = await User.findOne({ uniqueid });

    return res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
