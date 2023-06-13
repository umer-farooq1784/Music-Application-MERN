const router = require("express").Router();
const admin = require("../config/firebase.config");
const user = require("../models/user");

router.get("/login", async (req, res) =>
{
    //return res.json("Login")
    //return res.send(req.headers.authorization);

    if(!req.headers.authorization)
    {
        return res.status(500).send({message : "Invalid Token"});
    }

    const token =req.headers.authorization.split(" ")[1];
    //return res.send(token);

    try{
        const decodeValue = await(admin.auth().verifyIdToken(token));
        if(!decodeValue)
        {
            return res.status(505).json({message : "Unautherized"});
        }
        
        //return res.status(200).json(value);
        const userExists = await user.findOne({"user_id" : decodeValue.user_id});
        if(!userExists) //checking if user already exist in our database
        {
            //res.send("Need to create");
            newUserData(decodeValue, req, res);
        }
        else //checking if user is not in our database
        {
            //res.send("Need tO update");
            updateUserData(decodeValue, req, res);
        }
        
    }
    catch(error)
    {
        return res.status(505).json({message : error});
    }

});

const updateUserData = async (decodeValue, req, res) => {
    const filter = { user_id: decodeValue.user_id }; 
    const options = {
      upsert: true, //creates new document if not found otherwise return particular document
      new: true,
    };
  
    try {
        //using bilt in findone function of mongoodb
      const result = await user.findOneAndUpdate(
        filter,
        { auth_time: decodeValue.auth_time },
        options
      );
      res.status(200).send({ user: result });
    } 
    catch (err) {
      res.status(400).send({ success: false, msg: err });
    }
  };
  

const newUserData = async (decodeValue, req, res) => {
    const newUser = new user({
      name: decodeValue.name,
      email: decodeValue.email,
      imageURL: decodeValue.picture,
      user_id: decodeValue.user_id,
      email_verified: decodeValue.email_verified,
      role: "member",
      auth_time: decodeValue.auth_time,
    });
    try {
      const savedUser = await newUser.save();
      res.status(200).send({ user: savedUser });
    } catch (err) {
      res.status(400).send({ success: false, msg: err });
    }
};

router.get("/getUsers", async (req, res) => {

  const cursor = await user.find();
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

router.put("/updateRole/:userId", async (req, res) => {
  const filter = { _id : req.params.userId};
  const role = req.body.data.role;

  // const options ={
  //   upsert : true,
  //   new: true,
  // };

  
  try {
    const result = await user.findOneAndUpdate(filter, { role: role });
    res.status(200).send({user : result});
  }catch (error){
    res.status(200).send({ success: true, msg: "error" });
  }
})

router.delete("/delete/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };

  const result = await user.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "User Deleted" });
  } else {
    res.status(500).send({ success: false, msg: "User Not Found" });
  }
});
module.exports = router;