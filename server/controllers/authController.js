import User from "../models/User.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { emailRegex, passwordRegex } from "../utils/constants.js";

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isEmail = emailRegex.test(email);
    const validPassword = passwordRegex.test(password);

    if (!isEmail) {
      return next(errorHandler(400, "Enter valid emailsss!"));
    }

    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password!"));
    }

    const user = await User.create({
      email,
      password,
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
