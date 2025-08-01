const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt =require('jsonwebtoken')
const auth = require('../config/nodemailer');
const otpStore = new Map(); // key: email, value: { otp, expiresAt }

require('dotenv').config()

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '100h' });
    console.log(token);
    
    res.status(200).json({
      success: true,
      token: token, // 👈 frontend can access this
      user: {
        id: user._id,
        email: user.email
      }
    });


  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
    });
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const sendVerifyOtp_reset = async (req, res) => {
  try {
    console.log("dmnfsssssssssssssssssssssssssssssssssssssssss");
    

    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log(email);

    if (!user) {
      return res.status(404).json({ "message": "file not exist" })
    }

    const otpreset = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, { otpreset, expiresAt });
    console.log(otpreset);
    

    const receiver = {
      from: process.env.EMAIL_USER, // sender address
      to: email,                   // recipient address
      subject: '🌟 Welcome to JIIT Connections — Verify Your Email',
      text: `Hi 'there,

Thank you for signing up for JIIT Connections!

Your OTP is: ${otpreset}

Please enter this code on the verification page to confirm your email. It’s valid for the next 10 minutes.

Need help? Reply to this email or contact us at support@jiitconnections.com.

Warm regards,
The JIIT Connections Team
Jaypee Institute of Information Technology
support@jiitconnections.com`,
      html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
      <h2 style="color:#2c3e50;">Welcome to <strong>JIIT Connections</strong>!</h2>
      <p>Thank you for joining our community at JIIT.</p>
      <p style="font-size:18px;">
        <strong>Your OTP is:</strong>
        <span style="display:inline-block;background:#f2f2f2;padding:10px 15px;border-radius:5px;margin-top:5px;">
          <strong>${otpreset}</strong>
        </span>
      </p>
      <p>Please enter this code on the verification page to confirm your email. It’s valid for the next <strong>10 minutes</strong>.</p>
      <hr style="border:none;border-top:1px solid #eee;">
      <p>If you need help, just reply to this email or reach out to us at <a href="mailto:support@jiitconnections.com">support@jiitconnections.com</a>.</p>
      <p>Warm regards,<br><strong>The JIIT Connections Team</strong><br>Jaypee Institute of Information Technology</p>
    </div>
  `
    };


    await auth.sendMail(receiver, (error, emailResponse) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      console.log("successfully sent email to", receiver.to);
      return res.json({ success: true, message: "OTP sent successfully" });
    });



  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }

    if (record.otpreset !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email); // Clean up expired OTP
      return res.status(400).json({ message: "OTP expired" });
    }

    otpStore.delete(email); // Clean up after successful verification

    return res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



const sendVerifyOtp_1st = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log(email);

    if (user) {
      return res.status(404).json({ "message": "file alredy exist" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });
    console.log(otp);
    

    const receiver = {
      from: process.env.EMAIL_USER, // sender address
      to: email,                   // recipient address
      subject: '🌟 Welcome to JIIT Connections — Verify Your Email',
      text: `Hi 'there,

Thank you for signing up for JIIT Connections!

Your OTP is: ${otp}

Please enter this code on the verification page to confirm your email. It’s valid for the next 10 minutes.

Need help? Reply to this email or contact us at support@jiitconnections.com.

Warm regards,
The JIIT Connections Team
Jaypee Institute of Information Technology
support@jiitconnections.com`,
      html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
      <h2 style="color:#2c3e50;">Welcome to <strong>JIIT Connections</strong>!</h2>
      <p>Thank you for joining our community at JIIT.</p>
      <p style="font-size:18px;">
        <strong>Your OTP is:</strong>
        <span style="display:inline-block;background:#f2f2f2;padding:10px 15px;border-radius:5px;margin-top:5px;">
          <strong>${otp}</strong>
        </span>
      </p>
      <p>Please enter this code on the verification page to confirm your email. It’s valid for the next <strong>10 minutes</strong>.</p>
      <hr style="border:none;border-top:1px solid #eee;">
      <p>If you need help, just reply to this email or reach out to us at <a href="mailto:support@jiitconnections.com">support@jiitconnections.com</a>.</p>
      <p>Warm regards,<br><strong>The JIIT Connections Team</strong><br>Jaypee Institute of Information Technology</p>
    </div>
  `
    };


    await auth.sendMail(receiver, (error, emailResponse) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      console.log("successfully sent email to", receiver.to);
      return res.json({ success: true, message: "OTP sent successfully" });
    });



  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const verifyOtp_1st = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email);
    if (!record) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email); // Clean up expired OTP
      return res.status(400).json({ message: "OTP expired" });
    }

    otpStore.delete(email); // Clean up after successful verification

    return res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports = {
 login, logout, sendVerifyOtp_reset, verifyOtp, updatePassword, 
   sendVerifyOtp_1st, verifyOtp_1st
}
