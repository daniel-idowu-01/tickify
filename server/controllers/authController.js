import mongoose from "mongoose";
import User from "../models/User.js";
import Organizer from "../models/Organizer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler.js";
import { emailRegex, passwordRegex } from "../utils/constants.js";
import { transporter } from "../utils/emailTransport.js";

const signUp = async (req, res, next) => {
  let url;
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
    const age = Number(today.getFullYear() - userBirth.getFullYear());

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

    const createdUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      age,
      profileImage,
      phoneNumber,
    });

    /* jwt.sign(
      {
        id: createdUser._id,
      },
      process.env.EMAIL_JWT_SECRET,
      {
        expiresIn: "1d",
      },
      (err, emailToken) => {
        url = `http://localhost:3000/api/auth/confirm-email/${emailToken}`;
        const mailOptions = {
          from: "danielidowu414@gmail.com",
          to: "jorovod391@nastyx.com", // change to dynamic email
          subject: "Welcome to Tickify!",
          html: `Welcome <b>${firstName}</b>,
              Kindly confirm your email <a href=${url} target='_blank'>here</a>
              `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return next(errorHandler(400, error));
          } else {
            return res
              .status(200)
              .json({ success: true, message: "Confirmation email sent!" });
          }
        });
      }
    ); */

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

    if (!user.emailVerified) {
      return next(errorHandler(401, "Please confirm your email to login!"));
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
  let oldPasswordMatch;
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    if (!oldPassword || !newPassword) {
      return next(errorHandler(400, "Please provide relevant details!"));
    }

    if (oldPassword === newPassword) {
      return next(
        errorHandler(400, "New password cannot be the same as the old one!")
      );
    }

    const userPassword =
      (await User.findById(id).select("password")) ||
      (await Organizer.findById(id).select("password"));

    oldPasswordMatch = await bcrypt.compare(oldPassword, userPassword.password);
    if (!oldPasswordMatch) {
      return next(errorHandler(400, "Wrong old password!"));
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.SALT)
    );

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
      return next(errorHandler(400, "Password update unsuccessful!"));
    }

    res
      .status(200)
      .json({ success: true, message: "User password successfully updated" });
  } catch (error) {
    next(error);
  }
};

const confirmEmail = async (req, res, next) => {
  const { emailToken } = req.params;
  jwt.verify(emailToken, process.env.EMAIL_JWT_SECRET, async (err, user) => {
    if (err) {
      return next(errorHandler(400, "Invalid email token!"));
    }

    await User.findByIdAndUpdate(user.id, {
      $set: { emailVerified: true },
    });

    return res
      .status(201)
      .json({ success: true, message: "Your account has been confirmed!" });
  });

  /* res.redirect(FRONTEND_URL) */
};

export { signUp, login, changePassword, confirmEmail };
