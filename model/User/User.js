import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    typeofUser:{
      type : String ,
      required  :true
    },
    isAdmin : {
      type : Boolean ,
      default :  false
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String, 
      unique: true,
    },
    phone :{
      type : String ,
      required : true 
    },
    password: { 
      type: String,
      required: true,
    },
    city :{
      type: String,
      required: true,
    },
    address:{
      type : String,
    },
    place :{
      type: Array 
    },
    activation : {
      type : Boolean ,
      default : false 
    }, 
    credits : {
      type: Number ,
      default  : 0 
    },
    Limits :{
      type : Number ,
      default : 0 
    },
    UserId : {
      type :mongoose.Schema.Types.ObjectId ,
      ref : "User"
    } ,
    otp : {
      type : Number ,
    } ,
    received :{
      type : Number ,
      default : 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
