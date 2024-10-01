import mongoose from "mongoose";
const costalRent = new mongoose.Schema(
  {
    typeOfList: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    bathRooms: {
      type: Number,
      required: true,
    },
    reseptionPieces:{
      type:Number,
      required: true,

    },
    furnising:{
      type:String,
      required: true

    },
    balcona:{
      type:Number ,
      required: true,

    },
    finishing: {
      type: String,
      required: true,
    },
    additional: {
      type: Array,
    },
    typeOfRent: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    advanceRent: {
      type: String,
      required: true,
    },
    insurance: {
      type: Number,
    },
    typeOfPublish: {
      type: String,
    },
    images:{
      type: [String], 
      required: true
    },
    view: {
      type: Number,
      default: 0,
    },
    click: {
      type: Number,
      default: 0,
    },
    whatsApp: {
        type: String ,
        required: true
    },
    phoneNumber: {
        type: String ,
        required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    AgencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("costalRent", costalRent);
