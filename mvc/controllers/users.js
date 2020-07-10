const mongoose= require('mongoose');
const passport = require('passport');
const User = mongoose.model("User");


const registerUser = function({body}, res){
  if (!body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.password ||
    !body.password_confirm
  ) {
    return res.send({ message: "All fields are must" });
  }
  if(body.password!==body.password_confirm){
    return res.send({message:'Password and confirm password field must match'})
  }
  const user = new User();
  user.name = body.first_name.trim() + " " + body.last_name.trim();
  user.email= body.email;
  console.log("this is inside users.js in route "+body.password);
  user.setPassword(body.password);
  console.log("this is below")

  user.save((err, newUser) => {
    if (err) {
      if (err.errmsg && err.errmsg.includes("duplicate key error") && err.errmsg.includes("email" )) {
        console.log(err)
        return res.json({ message: "The provided email is already registered!" , err:err});
      }
      return res.json({ message : "Something went wrong"});
    } else{
      const token = newUser.getJwt();
      res.status(201).json({ token });
    }
  });

}
/*const registerUser = function({ body }, res) {

console.log(body);

    if (!body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.password ||
        !body.password_confirm
    ) {
        return res.send({ message: "All fields are must" });
    }

    if (body.password != body.password_confirm) {
        return res.send({ message: "Passwords don't match" });
    }

    const user = new User();

    //user.firstname = body.first_name.trim();
    //user.lastname = body.last_name.trim();
    // if a person has only first name for them changes have been made to schema
    user.name = body.first_name.trim()+" "+body.last_name.trim();

    user.email = body.email;
    user.setPassword(body.password);
    console.log(user);

    //save the user in database
    user.save((err, newUser) => {
      //console.log(newUser);
        if (err) {
            if (err.errmsg && err.errmsg.includes("duplicate key error") && err.errmsg.includes("email" )) {
               console.log(err)
                return res.json({ message: "The provided email is already registered!" , err:err});

            }


            return res.json({ message: newUser });

        } else {
            const token = newUser.getJwt();
            res.status(201).json({ token });

        }

    });

}
*/
const loginUser = function(req,res){
  if(!req.body.email || !req.body.password){
    return res.status(400).json({ msg: "All fields are required"})
  }
  passport.authenticate("local", (err, user, info)=>{
    if(err){
      return res.status(400).json(err)
    }
    if(user){
      const token = user.getJwt();
      res.status(201).json({ token });
    }
    else{
      res.json(info);}
  })(req,res);
}

const generateFeed = function(req, res){
  res.status(200).json({message : " Generating posts for a users feed."});
    }

const getSearchResults = function({query}, res){
  return res.json({ messsage : "Getting Search Results", query : query.query});
}

const deleteAllUsers = function(req,res){
  User.deleteMany({}, (err, info)=> {
    if(err){ return res.send({error : err});
  }
  return res.json({message : "Deleted All Users", info:info});
 });
}

module.exports = {
  registerUser,
  loginUser,
  generateFeed,
  getSearchResults,
  deleteAllUsers
}
