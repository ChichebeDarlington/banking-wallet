import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/nodemailer.js";
import crypto from "crypto";

export const register = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    identityNumber,
    identityType,
    address,
    mobile,
  } = req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !identityNumber ||
    !identityType ||
    !address ||
    !mobile
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Please fill in all fields" });
  }
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(201).json({
        error: "User already exist",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      firstName,
      mobile,
      lastName,
      password: hash,
      identityNumber,
      identityType,
      address,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });
    await user.save();

    // const token = jwt.sign({ _id: user._id }, "jwt-secret", {
    //   expiresIn: "1d",
    // });

    const prodAPIUri = "https://my-wallet-app-tgwm.onrender.com";
    const from = "chichebewebdev@gmail.com";
    const to = user.email;
    const subject = "Verify your account";
    const text = "Account verification";
    const html = `<p>Hey ${user.firstName} ${user.lastName}, please verify your account by clicking the link below...</p> <a href="${prodAPIUri}/verify-email/${user._id}/${user.emailToken}">Verify your account</a>`;

    await sendEmail({ from, to, subject, text, html });

    return res.status(201).json({
      user,
      msg: `A verification email link has been sent to your email account: ${user.email}, please click on the link to verify your account`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ error: error.message, success: false });
  }
};

export const verifyEmail = async (req, res) => {
  const { emailToken } = req.body;

  if (!emailToken) {
    return res
      .status(400)
      .json({ error: "Token not found, request for a new token" });
  }

  try {
    const user = await User.findOne({ emailToken });

    if (user) {
      user.isEmailVerified = true;
      user.emailToken = null;
      await user.save();
      return res
        .status(200)
        .json({ user, msg: "Email verified", success: true });
    }
    return res.status(400).json({ error: "Email verification failed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please fill in all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(201)
        .json({ error: "User does not exist", success: false });
    }
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res
        .status(201)
        .json({ error: "Incorrect password", success: false });
    }

    const token = jwt.sign({ _id: user._id }, "jwt-secret", {
      expiresIn: "7d",
    });

    return res
      .status(201)
      .json({ success: true, token, msg: "Login successful", user });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ error: error.message, success: false });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "Please fill in email address" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(201)
        .json({ error: "User does not exist", success: false });
    }

    const token = jwt.sign({ _id: user._id }, "jwt-secret", {
      expiresIn: "10d",
    });

    // const from = `"Lion Pizza" 'Lion Wallet 👻" <lionwallet@gmail.com> '`;
    const prodAPIUri = "https://my-wallet-app-tgwm.onrender.com";
    const from = "chichebewebdev@gmail.com";
    const to = user.email;
    const subject = "Reset your password";
    const text = "Some text";
    const html = `<p>Hey ${user.firstName} ${user.lastName}, please reset your password by clicking the link below...</p> <a href="${prodAPIUri}/reset-password/${user._id}/${token}">Reset your password</a>`;

    await sendEmail({ from, to, subject, text, html });
    return res.status(201).json({
      msg: `An password recoery link was sent to your email account: ${user.email}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ error: error.message, success: false });
  }
};

export const resetPassword = async (req, res) => {
  // console.log(req.params);
  const { password } = req.body;
  const { _id, token } = req.params;

  if (!password || password === "") {
    return res
      .status(400)
      .json({ success: false, error: "password can not be empty" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(
      _id,
      { password: hash },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res
        .status(201)
        .json({ error: "User does not exist", success: false });
    }

    // const token = jwt.sign({ _id: user._id }, "jwt-secret", {
    //   expiresIn: "1d",
    // });

    return res
      .status(201)
      .json({ success: true, token, msg: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ error: error.message, success: false });
  }
};

export const userInfo = async (req, res) => {
  // console.log(req.user);
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ user, success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find({});
    return res.status(200).json({ user, success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  const { isVerified, selectedUser } = req.body;
  if (!req.body) {
    return res.status(400).json({
      success: false,
      error: "Your ID is needed for your verification",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      selectedUser,
      { isVerified: isVerified },
      { new: true }
    );

    return res.status(200).json({ user, success: true, msg: "User verified" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    identityNumber,
    identityType,
    address,
  } = req.body;

  if (!email || !lastName || !firstName || !mobile || !address) {
    return res.status(400).json({
      success: false,
      error: "Please fill in all the neccesary fields",
    });
  }

  try {
    const user = await User.findOne({ _id: req.user._id });

    (user.firstName = firstName),
      (user.lastName = lastName),
      (user.email = email),
      (user.mobile = mobile),
      (user.identityNumber = identityNumber),
      (user.identityType = identityType),
      (user.address = address),
      await user.save();

    return res
      .status(200)
      .json({ user, success: true, msg: "Profile updated" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};
