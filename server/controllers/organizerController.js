import Organizer from "../models/Organizer.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../middleware/errorHandler.js";
import { emailRegex, passwordRegex } from "../utils/constants.js";

const createOrganizer = async (req, res, next) => {
  try {
    const { name, email, password, profileImage, phoneNumber } = req.body;
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

const getOrganizerById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const organizer = await Organizer.findById(id);
    if (!organizer || organizer.isDeleted) {
      return next(errorHandler(400, "Organizer not found!"));
    }

    const { password, __v, createdAt, deletedAt, isDeleted, ...newOrganizer } =
      organizer._doc;

    res.status(200).json({ success: true, message: newOrganizer });
  } catch (error) {
    next(error);
  }
};

const getAllOrganizers = async (req, res, next) => {
  try {
    const organizers = await Organizer.find({});
    if (!organizers || organizers.isDeleted) {
      return next(errorHandler(400, "Organizers not found!"));
    }

    res.status(200).json({ success: true, message: organizers });
  } catch (error) {
    next(error);
  }
};

const updateOrganizerById = async (req, res, next) => {
  const { name, bio, profileImage, backgroundImage } = req.body;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    if (!name && !bio && !profileImage && !backgroundImage) {
      return next(errorHandler(400, "Please provide relevant details!"));
    }

    const organizer = await Organizer.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          bio,
          profileImage,
          backgroundImage,
        },
      },
      { new: true }
    );

    if (!organizer) {
      return next(errorHandler(400, "Organizer not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Organizer successfully updated" });
  } catch (error) {
    next(error);
  }
};

const deleteOrganizerById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const organizer = await Organizer.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );

    if (!organizer) {
      return next(errorHandler(400, "Organizer not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Organizer successfully deleted" });
  } catch (error) {
    next(error);
  }
};

export {
  createOrganizer,
  getOrganizerById,
  getAllOrganizers,
  updateOrganizerById,
  deleteOrganizerById,
};
