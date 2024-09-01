import User from "../models/User.js";
import bcrypt from "bcrypt";
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
      profileImage,
      phoneNumber,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
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

const login = (req, res) => {
  console.log("Sign Up");
};

export { signUp, login };
