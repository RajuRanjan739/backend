import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin";
import Movie from "../models/Movie";

export const addMovie= async(req,res,next)=>{
    const extractedToken= req.headers.authorization.split(" ")[1]; //bearer token
    if(!extractedToken && extractedToken.trim()==""){
        return res.status(404).json({message:"Token not found"})
    }
    console.log(extractedToken)
    let adminId;
    // Verify token
    jwt.verify(extractedToken,process.env.Secret_Key,(err,decrypted)=>{
        if(err){
            return res.status(400).json({message:`${err.message}`});
        }else{
            adminId= decrypted.id;
            return;
        }
    });
    //create new Movie
    const{ title,description,releaseDate,posterUrl,actors,featured}= req.body;
    if(!title && 
        title.trim()==="" &&
        !description && 
        description.trim()==="" && 
        !posterUrl &&
        posterUrl.trim()==="" 
        ){
            return res.status(422).json({message:"Invalid Input"});
        }
        let movie;
        try{
            movie= new Movie({
                title,
                description,
                releaseDate: new Date(`${releaseDate}`),
                featured,
                actors,
                admin:adminId,
                posterUrl,
            });

        const session= await mongoose.startSession();
        const adminUser= await Admin.findById(adminId);
        session.startTransaction();
        await movie.save({session})
        adminUser.addedMovies.push(movie);
        await adminUser.save({session});
        await session.commitTransaction();

        
        }catch(err){
            return console.log(err);
        }

        if(!movie){
            return res.status(500).json({message:"Request Failed"})
        }
        return res.status(201).json({movie})
    
};

export const getAllMovies=async(req,res,next)=>{
    let movies;

    try{
        movies= await Movie.find();
    }catch(err){
        console.log(err)
    }
    if(!movies){
        return res.status(500).json({message:"Request Failed"})
    }
    return res.status(200).json({movies})
};

export const getMovieById= async(req,res,next)=>{
    const id =req.params.id;
    let movie;
    try{
        movie= await Movie.findById(id)
    }catch(err){
        return console.log(err)
    }

    if(!movie){
        return res.status(404).json({message:"Invalid Movie Id"})
    }
    return res.status(200).json({movie})
};