const userModel = require("../model/User");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email.length === 0 || password.length === 0) {
      throw new Error("Email and password are required");
    }

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const currUser = await userModel.findOne({ email: email });
    if (!currUser) {
      throw new Error("Email is not exist :)))");
    }

    const pass = currUser.password.toString() === password.toString();
    if (!pass) {
      throw new Error("Incorrect password!!!");
    } else {
      const userInf = new userModel({
        email: email,
        password: pass,
        userName: currUser.userName,
        avatar: currUser.avatar,
        friends: currUser.friends,
      });
      return res.status(200).json({
        status: true,
        data: userInf,
      });
    }
  } catch (error) {
    console.log("Reason login fail => ", error);
    return res.status(500).json({ message: error.message });
  }
};

//Register
exports.register = async (req, res) => {
  const { email, password, userName, avatar, friends } = req.body;
  try {
    if (!email || !password || !userName) {
      throw new Error("Email, password and userName are required");
    }

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 6) {
      throw new Error("Password should be at least 6 characters long");
    }

    if (userName.length < 3 || userName.length > 20) {
      throw new Error("Username should be between 3 and 20 characters");
    }
    const newUser = new userModel({
      email: email,
      password: password,
      userName: userName,
      avatar: avatar,
      friends: friends,
    });

    await newUser.save();

    return res.status(200).json({
      status: true,
      data: newUser,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(400).json({ message: error.message });
  }
};

//Add friend
exports.addFriend = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}

exports.test = (req, res) => {
  res.status(200).json({ message: "Test success" });
};
