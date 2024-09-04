import Organizer from "../models/Organizer.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../middleware/errorHandler.js";
import { emailRegex, passwordRegex } from "../utils/constants.js";

const createOrganizer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      profileImage,
      phoneNumber,
    } = req.body;
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );
    const isEmail = emailRegex.test(email);
    const validPassword = passwordRegex.test(password);

    const organizer = await Organizer.findOne({ email });
    if (organizer) {
      return next(errorHandler(400, "Organizer already exists!"));
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

    await Organizer.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      phoneNumber,
    });

    res
      .status(201)
      .json({ success: true, message: "Organizer created successfully!" });
  } catch (error) {
    next(error);
  }
};

export { createOrganizer };
