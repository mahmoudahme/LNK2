import { configDotenv } from "dotenv";
import commercialRequestRent from "../model/Rent Request/commercialRequestRent.js";
import costalRequestRent from "../model/Rent Request/costalRequestRent.js";
import residentialRequestRent from "../model/Rent Request/residentialRequestRent.js";
import User from "../model/User/User.js";
import { ApiError } from "../Utils/apiError.js";
import { verifyToken } from "../Utils/verifyToken.js";
import { incrementView } from "../middleware/View.js";
import { shuffleArray } from "../middleware/shuffleArray.js";
import { sort } from "../middleware/sorting.js";

configDotenv({ path: "config/config.env" });
////////////////////////////////////////////CREATING Rent/////////////////////////////////////////////////
export const createRent = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const user = await User.findById(req.user.id);
        if (user.activation) {
          var credits;
          if (req.body.typeOfPublish == "normal") {
            credits = 10;
          } else if (req.body.typeOfPublish == "turbo") {
            credits = 50;
          } else {
            credits = 100;
          }
          if (user.credits >= credits) {
            if (req.body.typeOfRequest == "residential") {
              const createdrequesting = new residentialRequestRent({
                typeOfRequest: req.body.typeOfRequest,
                location: req.body.location,
                city: req.body.city,
                apartment: req.body.apartment,
                title: req.body.title,
                description: req.body.description,
                floor: req.body.floor,
                area: req.body.area,
                rooms: req.body.rooms,
                bathRooms: req.body.bathRooms,
                furnising: req.body.furnising,
                finishing: req.body.finishing,
                additional: req.body.additional,
                typeOfRent: req.body.typeOfRent,
                price: req.body.price,
                advanceRent: req.body.advanceRent,
                insurance: req.body.insurance,
                typeOfPublish: req.body.typeOfPublish,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdrequesting.save();
            } else if (req.body.typeOfRequest == "costal") {
              const createdrequesting = new costalRequestRent({
                typeOfRequest: req.body.typeOfRequest,
                location: req.body.location,
                city: req.body.city,
                apartment: req.body.apartment,
                title: req.body.title,
                description: req.body.description,
                floor: req.body.floor,
                area: req.body.area,
                rooms: req.body.rooms,
                bathRooms: req.body.bathRooms,
                furnising: req.body.furnising,
                finishing: req.body.finishing,
                additional: req.body.additional,
                typeOfRent: req.body.typeOfRent,
                price: req.body.price,
                advanceRent: req.body.advanceRent,
                insurance: req.body.insurance,
                typeOfPublish: req.body.typeOfPublish,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdrequesting.save();
            } else if (req.body.typeOfRequest == "commercial") {
              const createdrequesting = new commercialRequestRent({
                typeOfRequest: req.body.typeOfRequest,
                location: req.body.location,
                city: req.body.city,
                apartment: req.body.apartment,
                title: req.body.title,
                description: req.body.description,
                area: req.body.area,
                finishing: req.body.finishing,
                additional: req.body.additional,
                price: req.body.price,
                advanceRent: req.body.advanceRent,
                insurance: req.body.insurance,
                typeOfPublish: req.body.typeOfPublish,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdrequesting.save();
            }
            await User.findByIdAndUpdate(
              user.id,
              { credits: user.credits - credits },
              { new: true }
            );
          } else {
            return next(
              new ApiError(`Sorry you don't have Credids enough `, 300)
            );
          }
        } else {
          return next(new ApiError(`Your account isn't Activited ! `, 200));
        }
        res.status(200).json({ message: "your Request is Created" });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
/////////////////////////////////////GET ALL requestING////////////////////////////////////////////////////////
export const getAllrequesting = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const residentialRents = await residentialRequestRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });
        const costalRents = await costalRequestRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });
        const commercialRents = await commercialRequestRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        let Rents = residentialRents.concat(costalRents);
        let AllRents = Rents.concat(commercialRents);

        let AllRent = shuffleArray(AllRents);
        sort(AllRent);

        await incrementView(
          AllRent,
          residentialRequestRent,
          commercialRequestRent,
          costalRequestRent
        );

        res.status(200).json({ Rents: AllRent });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};

export const getAllMyrequesting = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user.typeofUser == "freelancer") {
          const residentialRents = await residentialRequestRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRents = await costalRequestRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRents = await commercialRequestRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          sort(residentialRents);
          sort(costalRents);
          sort(commercialRents);
          res.status(200).json({
            residentialRents: residentialRents,
            costalRents: costalRents,
            commercialRents: commercialRents,
          });
        } else if (user.typeofUser == "agency") {
          const residentialRents = await residentialRequestRent
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRents = await costalRequestRent
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRents = await commercialRequestRent
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          sort(residentialRents);
          sort(costalRents);
          sort(commercialRents);
          res.status(200).json({
            residentialRents: residentialRents,
            costalRents: costalRents,
            commercialRents: commercialRents,
          });
        } else {
          const residentialRents = await residentialRequestRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRents = await costalRequestRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRents = await commercialRequestRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          sort(residentialRents);
          sort(costalRents);
          sort(commercialRents);
          res.status(200).json({
            residentialRents: residentialRents,
            costalRents: costalRents,
            commercialRents: commercialRents,
          });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
//////////////////////////////////////UPDATE requestING////////////////////////////////////////////////////////
export const updaterequesting = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const requestId = req.params.id;
        const residentail = await residentialRequestRent.findById(requestId);
        const costal = await costalRequestRent.findById(requestId);
        const commercial = await commercialRequestRent.findById(requestId);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId
          ) {
            const newRent = await residentialRequestRent
              .findByIdAndUpdate(requestId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ requesting: newRent });
          } else {
            return next(new ApiError(`You Can't Update This request `, 400));
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId) {
            const newRent = await costalRequestRent
              .findByIdAndUpdate(requestId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ requesting: newRent });
          } else {
            return next(new ApiError(`You Can't Update This request `, 400));
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId
          ) {
            const newRent = await commercialRequestRent
              .findByIdAndUpdate(requestId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ requesting: newRent });
          } else {
            return next(new ApiError(`You Can't Update This request `, 400));
          }
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
//////////////////////////////////////DELETE requestING////////////////////////////////////////////////////////
export const deleterequesting = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const requestId = req.params.id;
        const residentail = await residentialRequestRent.findById(requestId);
        const costal = await costalRequestRent.findById(requestId);
        const commercial = await commercialRequestRent.findById(requestId);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId
          ) {
            await residentialRequestRent.findByIdAndDelete(requestId);
            res.status(200).json({ Message: " Your Request is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This Request `, 400));
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId) {
            await costalRequestRent.findByIdAndDelete(requestId);
            res.status(200).json({ Message: " Your Request is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This Request `, 400));
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId
          ) {
            await commercialRequestRent.findByIdAndDelete(requestId);
            res.status(200).json({ Message: " Your Request is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This Request `, 400));
          }
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};

export const oneRequestFromMyrequesting = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const requestID = req.params.requestid;
        const residentail = await residentialRequestRent.findById(requestID);
        const costal = await costalRequestRent.findById(requestID);
        const commercial = await commercialRequestRent.findById(requestID);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId
          ) {
            const oneRequest = await residentialRequestRent
              .find({ _id: requestID })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ request: oneRequest });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This request As Owner`, 404)
            );
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId) {
            const oneRequest = await costalRequestRent
              .find({ _id: requestID })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ request: oneRequest });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This request As Owner`, 404)
            );
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId
          ) {
            const oneRequest = await commercialRequestRent
              .find({ _id: requestID })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ request: oneRequest });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This request As Owner`, 404)
            );
          }
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
//////////////////////////////////////GET request FROM OUT requestING ////////////////////////////////////////////
export const getrequestFromOut = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const requestID = req.params.requestid;
        const residentail = await residentialRequestRent.findById(requestID);
        const costal = await costalRequestRent.findById(requestID);
        const commercial = await commercialRequestRent.findById(requestID);
        if (residentail) {
          const oneRequest = await residentialRequestRent
            .find({ _id: requestID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await residentialRequestRent.findByIdAndUpdate(
            oneRequest[0].id,
            {
              click: (oneRequest[0].click += 1),
            },
            { new: true }
          );
          // console.log(oneRequestUp.click)
          res.status(200).json({ request: oneRequest });
        } else if (costal) {
          const oneRequest = await costalRequestRent
            .find({ _id: requestID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await costalRequestRent.findByIdAndUpdate(
            oneRequest[0].id,
            {
              click: (oneRequest[0].click += 1),
            },
            { new: true }
          );
          res.status(200).json({ request: oneRequest });
        } else if (commercial) {
          const oneRequest = await commercialRequestRent
            .find({ _id: requestID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await commercialRequestRent.findByIdAndUpdate(
            oneRequest[0].id,
            {
              click: (oneRequest[0].click += 1),
            },
            { new: true }
          );
          res.status(200).json({ request: oneRequest });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
