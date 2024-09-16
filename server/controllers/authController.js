import mongoose from "mongoose";
import User from "../models/User.js";
import Organizer from "../models/Organizer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler.js";
import { emailRegex, passwordRegex } from "../utils/constants.js";

const signUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      dateOfBirth,
      profileImage,
      phoneNumber,
    } = req.body;
    const today = new Date();
    const userBirth = new Date(dateOfBirth);
    const age = today.getFullYear() - userBirth.getFullYear();

    if (age < 18) {
      return next(errorHandler(400, "You must be 18 or older!"));
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );
    const isEmail = emailRegex.test(email);
    const validPassword = passwordRegex.test(password);

    const user = await User.findOne({ email });
    if (user) {
      return next(errorHandler(400, "User already exists!"));
    }

    if (!isEmail) {
      return next(errorHandler(400, "Enter a valid email!"));
    }

    const blacklistedDomains = [
      "tempmail.com",
      "mailinator.com",
      "yopmail.org",
      "trashmail.com",
      "maildrop.cc",
    ];
    const blacklistedEmail = email.split("@")[1];
    if (blacklistedDomains.includes(blacklistedEmail)) {
      return next(
        errorHandler(400, "Registration is not allowed for this email!")
      );
    }

    if (!validPassword) {
      return next(
        errorHandler(
          400,
          "Password must have atleast one uppercase, one lowercase, one number, one symbol and must be more than 8 characters!"
        )
      );
    }

    await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      age,
      profileImage,
      phoneNumber,
    });

    res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  let user, token, passwordMatch;
  try {
    const { identity, password } = req.body;
    if (!identity || !password) {
      return next(errorHandler(400, "Email or password is required!"));
    }

    const isEmail = emailRegex.test(identity);
    const userField = isEmail ? "email" : "username";
    const organizerField = isEmail ? "email" : "name";

    user =
      (await User.findOne({ [userField]: identity })) ||
      (await Organizer.findOne({ [organizerField]: identity }));

    if (!user) {
      const errorMessage = isEmail ? "Email not found!" : "Username not found!";
      return next(errorHandler(400, errorMessage));
    }

    passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(errorHandler(400, "Wrong credentials!"));
    }

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "You are logged in!" });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  let passwordMatch;
  const { password } = req.body;
  const { id } = req.user;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    if (!password) {
      return next(errorHandler(400, "Please provide relevant details!"));
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    const userPassword =
      (await User.findById(id).select("password")) ||
      (await Organizer.findById(id).select("password"));

    passwordMatch = await bcrypt.compare(password, userPassword.password);

    if (passwordMatch) {
      return next(
        errorHandler(400, "Old password cannot be used as new password!")
      );
    }

    const user =
      (await User.findByIdAndUpdate(
        id,
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      )) ||
      (await Organizer.findByIdAndUpdate(
        id,
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      ));

    if (!user) {
      return next(errorHandler(400, "User not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "User password successfully updated" });
  } catch (error) {
    next(error);
  }
};

export { signUp, login, changePassword };
