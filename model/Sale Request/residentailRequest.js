import mongoose from "mongoose";
const residentialRequest = new mongoose.Schema(
  {
    typeOfRequest: {
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
    furnising:{
      type:String,
      required: true
    },
    finishing: {
      type: String,
      required: true,
    },
    additional: {
      type: Array,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    typeOfPay: {
      type: String,
      required: true,
    },
    downPayment:{
      type: Number,
    },
    years: {
      type: Number,
    },
    typeOfPublish: {
      type: String,
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

export default mongoose.model("residentialRequest", residentialRequest);
