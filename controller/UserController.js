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
      return res.status(200).json({status: true, data: currUser.toObject()});
    }
  } catch (error) {
    console.log("Reason login fail => ", error);
    return res.status(500).json({status: false, message: error.message });
  }
};

//Register
exports.register = async (req, res) => {
  const { email, password, userName, avatar, friends } = req.body;
  try {

    const check = await userModel.findOne({ email: email });
    if(check){
      throw new Error('Email is exist')
    }

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
    return res.status(400).json({status: false, message: error.message });
  }
};

//Add friend
exports.addfriend = async(req,res) => {
  const {currUserId, friendId} = req.body;
  try {
    const user = await userModel.findOne({_id:currUserId});
    
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const friend = await userModel.findById(friendId);
    if (!friend) {
      return res.status(404).json({
        status: false,
        message: 'Friend not found'
      });
    }
    
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter(id => id !== friendId);
      await user.save();
      return res.status(200).json({
        status: true,
        message: 'Remove successfully'
      });
    }
    
    user.friends.push(friendId);
    await user.save();
    
    return res.status(200).json({
      status: true,
    });
    
  } catch (error) {
    console.log('Reason =>', error);
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
}


exports.getFriends = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }
    
    if(user.friends.length === 0) {
      return res.status(200).json({status: true, data: []})
    }

    const friends = user.friends.map(friend => {
      return userModel.findById(friend)
    }) 

    const result = await Promise.all(friends);
    
    return res.status(200).json({ status: true, data: result })
  } catch (error) {
    console.log('Reason =>', error);
    return res.status(500).json({
      status: false,
      message: "Lỗi hệ thống"
    });
  }
}


exports.findFriendByEmail = async (req,res) => {
  try {
    const {userId, friendEmail} = req.body
    const friend = await userModel.findOne({ email: friendEmail})
    if(!friend) {
      return res.status(404).json({status: false, message: "Friend not found", data: []})
    }
    const user = await userModel.findById(userId)
    if(!user) {
      return res.status(404).json({status: false, message: "User not found", data: []})
    }
    if(user.friends.includes(friend._id)) {
      return res.status(200).json({status: true, data: [{
        ...friend._doc,
        isFriend: true
      }]})
    } else {
      return res.status(200).json({status: true, message: "User is not friend", data: [{
        ...friend._doc,
        isFriend: false
      }]})
    }
  } catch (error) {
    console.log('Reason =>', error);
    return res.status(500).json({
      status: false,
      message: "Lỗi hệ thống"
    });
    
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const infomation = req.body
    const user = await userModel.findById(infomation.userId)
    if(!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    user.userName = infomation.userName
    user.avatar = infomation.avatar
    const savedUser = await user.save()
    return res.status(200).json({ status: true, message: "Update profile successfully", data: savedUser });
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: false, message: "Error updating profile" });
  }
}


exports.updatePassword = async (req, res) => {
  try {
    const infomation = req.body
    const user = await userModel.findById(infomation.userId)
    if(!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    if(user.password.toString()!== infomation.oldPassword.toString()) {
      return res.status(400).json({ status: false, message: "Old password is incorrect" });
    }

    user.password = infomation.newPassword
    const savedUser = await user.save()
    return res.status(200).json({ status: true, message: "Update password successfully", data: savedUser });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: false, message: "Error updating password" });
    
  }
}
 
exports.test = (req, res) => {
  res.status(200).json({ status: false, message: "Test success" });
};
