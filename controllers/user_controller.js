import User from "../models/User";
import bcrypt from "bcryptjs"
import Bookings from "../models/Bookings";

export const getAllUser=async(req,res,next)=>{
    let users;
    try {
        users= await User.find()
    }
    catch(err){
        return console.log(err);
    }
    if(!users){
        return res.status(500).json({message:"unexpected error occured"})
    }
    return res.status(200).json({users})
};

export const signup= async(req,res,next)=>{
    const {name,email,password}= req.body;
    if(
        !name && 
        name.trim()==="" &&
        !email &&
        email.trim()==="" &&
        !password &&
        password.trim()==="" 
        ){
            return res.status(422).json({message:"Invalid Inputs"})
        }
        const hashedPassword= bcrypt.hashSync(password);

        let user;
        try{ 
            user= new User({name,email,password:hashedPassword});
            user= await user.save()
        }
        catch(err){
            return console.log(err);
        }
        if(!user){
            return res.status(500).json({message:"Unexpected error occured"});
        }
        return res.status(201).json({id: user._id})

};
export const updateUser=async(req,res,next)=>{
    const id=req.params.id;
    const {name,email,password}= req.body;
    if(
        !name && 
        name.trim()==="" &&
        !email &&
        email.trim()==="" &&
        !password &&
        password.trim()==="" 
        ){
            return res.status(422).json({message:"Invalid Inputs"})
        }
        const hashedPassword= bcrypt.hashSync(password);
        let user;
        try{
            user= await User.findByIdAndUpdate(id,{
                name,
                email,
                password:hashedPassword,
            });
        }
        catch(err){
            return console.log(err);
        }
        if(!user){
            return res.status(500).json({message:"Something went wrong"})
        }
        res.status(200).json({message:"Updated sucessfully"})

};
export const deleteUser=async(req,res,next)=>{
    const id=req.params.id;
    let user;
    try{
        user= await User.findByIdAndRemove(id);
    }catch(err){
        return console.log(err)
    }
    if(!user){
        return res.status(500).json({message:"Something went wrong"})
    }
    return res.status(200).json({message:"deleted sucessfully"})
};
export const login=async(req,res,next)=>{
    const {email,password}= req.body;
    if(
        
        !email &&
        email.trim()==="" &&
        !password &&
        password.trim()==="" 
        ){
            return res.status(422).json({message:"Invalid Inputs"})
        }
        let existingUser;
        try{
            existingUser= await User.findOne({email});
        }catch(err){
            return console.log(err)
        }
        if(!existingUser){
            return res.status(404).json({message:"Unable to find existing user"})
        }

        const isPasswordCorrect= bcrypt.compareSync(password,existingUser.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"password Incorrect"})
        }
        return res.status(200).json({message:"Login Sucessfully",id:existingUser._id})

};

export const getBookingsOfUser= async(req,res,next)=>{
    const id= req.params.id;
    
    
    let bookings;
    try{
        bookings= await Bookings.find({user:id}).populate("movie user");
           
    }catch(err){
        return console.log(err)
    }
    if(!bookings){
        return res.status(500).json({message:"Unable to get booking"})
    }
    
    return res.status(200).json({bookings})
};

export const getUserById=async(req,res,next)=>{
    const id= req.params.id;
    let user;
    try {
        user= await User.findById(id)
    }
    catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({message:"unexpected error occured"})
    }
    return res.status(200).json({user})
};