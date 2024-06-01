import userModel from "../../../DB/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEmailHTML, sendEmail } from "../../utils/sendEmail.js";
import { customAlphabet } from "nanoid";
import cloudinary from "../../utils/cloudinary.js";

export const getUsers = async (req, res) => {
  return res.json(req.user);
};

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("email already exists", { cause: 409 }));
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/users`,
    }
  );

  const token = jwt.sign({ email }, process.env.CONFIRMEMAILSECRET);

  const html = getEmailHTML(req.headers.host, req.protocol, token);
  await sendEmail(email, "confirm Email", html);

  const createUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
    image: { secure_url, public_id },
  });

  if (!createUser) {
    return res.json({ message: "error while creat user" });
  }

  return res
    .status(201)
    .json({ message: "User created successfully", user: createUser });
};

export const confirmEmail = async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.CONFIRMEMAILSECRET);
  if (!decoded) {
    return next(new Error("invalid token", { cause: 404 }));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmEmail: false },
    { confirmEmail: true }
  );
  if (!user) {
    return res
      .status(400)
      .json({ message: "invalid verify your email or your email is verified" });
  }

  return res.redirect(process.env.FRONTENDURL);
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "email not found" });
  }

  if (!user.confirmEmail) {
    return res.status(400).json({ message: "please confirm your email" });
  }

  if (user.status === "Inactive") {
    return res.status(400).json({ message: "Your account is inactive" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGINSECRET,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGINSECRET,
    { expiresIn: 60 * 60 * 24 * 30 }
  );

  return res.status(200).json({ token, refreshToken });
};

export const sendCode = async (req, res) => {
  const { email } = req.body;

  let code = customAlphabet("1234567890abcdzABCDZ", 4);

  await userModel.findOneAndUpdate(
    { email },
    { sendCode: code },
    { new: true }
  );

  const html = `<h2>code is : ${code} </h2> `;
  await sendEmail(email, `reset password`, html);

  return res.redirect(process.env.FORGOTPASSWORDFROM);
};

export const forgotPassword = async (req, res) => {
  const { email, password, code } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "not register account" });
  }

  if (user.sendCode != code) {
    return res.status(400).json({ message: "invalid code" });
  }

  let match = await bcrypt.compare(password, user.password);
  if (match) {
    return res.status(409).json({ message: "same password" });
  }

  user.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
  user.sendCode = null;
  user.changePasswordTime = Date.now();

  await user.save();

  return res.status(200).json({ message: "success" });
};

export const deleteInvalidConfirm = async (req, res) => {
  await userModel.deleteMany({ confirmEmail: false });

  return res.status(200).json({ message: "success" });
};
