import { configDotenv } from "dotenv";
import commercialRequest from "../model/Sale Request/commercialRequest.js";
import costalRequest from "../model/Sale Request/costalRequest.js";
import residentailRequest from "../model/Sale Request/residentailRequest.js";
import User from "../model/User/User.js";
import { ApiError } from "../Utils/apiError.js";
import { verifyToken } from "../Utils/verifyToken.js";
import { sort } from "../middleware/sorting.js";
import { incrementView, incrementViewAll } from "../middleware/View.js";
import { shuffleArray } from "../middleware/shuffleArray.js";
import costalRequestRent from "../model/Rent Request/costalRequestRent.js";
import residentailRequestRent from "../model/Rent Request/residentialRequestRent.js";
import commercialRequestRent from "../model/Rent Request/commercialRequestRent.js";
configDotenv({ path: "config/config.env" });

////////////////////////////////////////////CREATING Request/////////////////////////////////////////////////
export const createRequest = async (req, res, next) => {
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
              const createdRequest = new residentailRequest({
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
                minPrice: req.body.minPrice,
                maxPrice: req.body.maxPrice,
                typeOfPay: req.body.typeOfPay,
                downPayment: req.body.downPayment,
                years: req.body.years,
                typeOfPublish: req.body.typeOfPublish,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdRequest.save();
            } else if (req.body.typeOfRequest == "costal") {
              const createdRequest = new costalRequest({
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
                minPrice: req.body.minPrice,
                maxPrice: req.body.maxPrice,
                typeOfPay: req.body.typeOfPay,
                downPayment: req.body.downPayment,
                years: req.body.years,
                typeOfPublish: req.body.typeOfPublish,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdRequest.save();
            } else if (req.body.typeOfRequest == "commercial") {
              const createdRequest = new commercialRequest({
                typeOfRequest: req.body.typeOfRequest,
                location: req.body.location,
                city: req.body.city,
                apartment: req.body.apartment,
                title: req.body.title,
                description: req.body.description,
                area: req.body.area,
                finishing: req.body.finishing,
                additional: req.body.additional,
                minPrice: req.body.minPrice,
                maxPrice: req.body.maxPrice,
                typeOfPay: req.body.typeOfPay,
                downPayment: req.body.downPayment,
                years: req.body.years,
                typeOfPublish: req.body.typeOfPublish,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdRequest.save();
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
        res.status(200).json({ message: "your list is Created" });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
//////////////////////////////////////////////GET ALL MY Requests //////////////////////////////////////////////
export const getAllMyRequests = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user.typeofUser == "freelancer") {
          const residentailRequests = await residentailRequest
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRequests = await costalRequest
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRequests = await commercialRequest
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });

          sort(residentailRequests);
          sort(costalRequests);
          sort(commercialRequests);

          res.status(200).json({
            residentailRequests: residentailRequests,
            costalRequests: costalRequests,
            commercialRequests: commercialRequests,
          });
        } else if (user.typeofUser == "agency") {
          const residentailRequests = await residentailRequest
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRequests = await costalRequest
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRequests = await commercialRequest
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          sort(residentailRequests);
          sort(costalRequests);
          sort(commercialRequests);
          res.status(200).json({
            residentailRequests: residentailRequests,
            costalRequests: costalRequests,
            commercialRequests: commercialRequests,
          });
        } else {
          const residentailRequests = await residentailRequest
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRequests = await costalRequest
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRequests = await commercialRequest
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });

          sort(residentailRequests);
          sort(costalRequests);
          sort(commercialRequests);
          res.status(200).json({
            residentailRequests: residentailRequests,
            costalRequests: costalRequests,
            commercialRequests: commercialRequests,
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
/////////////////////////////////////GET ALL Request////////////////////////////////////////////////////////
export const getAllRequests = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const residentailRequests = await residentailRequest
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });
        const costalRequests = await costalRequest
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });
        const commercialRequests = await commercialRequest
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        let Listing = residentailRequests.concat(costalRequests);
        let AllListtings = Listing.concat(commercialRequests);

        let AllListing = shuffleArray(AllListtings);
        sort(AllListing);

        await incrementView(
          AllListing,
          residentailRequest,
          commercialRequest,
          costalRequest
        );

        res.status(200).json({ Requests: AllListing });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
/////////////////////////////////////UPDATE Request////////////////////////////////////////////////////////
export const updateRequests = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const listId = req.params.id;
        const residentail = await residentailRequest.findById(listId);
        const costal = await costalRequest.findById(listId);
        const commercial = await commercialRequest.findById(listId);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId || req.user.isAdmin
          ) {
            const newRequest = await residentailRequest
              .findByIdAndUpdate(listId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Request: newRequest });
          } else {
            return next(new ApiError(`You Can't Update This Request `, 400));
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId || req.user.isAdmin) {
            const newRequest = await costalRequest
              .findByIdAndUpdate(listId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Request: newRequest });
          } else {
            return next(new ApiError(`You Can't Update This Request `, 400));
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId || req.user.isAdmin
          ) {
            const newRequest = await commercialRequest
              .findByIdAndUpdate(listId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Request: newRequest });
          } else {
            return next(new ApiError(`You Can't Update This Request `, 400));
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
////////////////////////GET ONE Request FROM MY Requests////////////////////////////////////////////////////////
export const oneRequestFromMyRequests = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const requestId = req.params.requestId;
        const residentail = await residentailRequest.findById(requestId);
        const costal = await costalRequest.findById(requestId);
        const commercial = await commercialRequest.findById(requestId);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId || req.user.isAdmin
          ) {
            const oneRequest = await residentailRequest
              .find({ _id: requestId })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Request: oneRequest });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This Request As Owner`, 404)
            );
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId || req.user.isAdmin) {
            const oneRequest = await costalRequest
              .find({ _id: requestId })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Request: oneRequest });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This Request As Owner`, 404)
            );
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId || req.user.isAdmin
          ) {
            const oneRequest = await commercialRequest
              .find({ _id: requestId })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Request: oneRequest });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This Request As Owner`, 404)
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
//////////////////////////////////////DELETE Request////////////////////////////////////////////////////////
export const deleteRequest = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const requestId = req.params.id;
        const residentail = await residentialList.findById(requestId);
        const costal = await costalList.findById(requestId);
        const commercial = await commercialList.findById(requestId);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId || req.user.isAdmin
          ) {
            await residentailRequest.findByIdAndDelete(requestId);
            res.status(200).json({ Message: " Your Request is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This Request `, 400));
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId || req.user.isAdmin) {
            await costalRequest.findByIdAndDelete(requestId);
            res.status(200).json({ Message: " Your Request is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This Request `, 400));
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId || req.user.isAdmin
          ) {
            await commercialRequest.findByIdAndDelete(requestId);
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
//////////////////////////////////////GET LIST FROM OUT LISTING ////////////////////////////////////////////
export const getRequestFromOut = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const requestId = req.params.requestId;
        const residentail = await residentailRequest.findById(requestId);
        const costal = await costalRequest.findById(requestId);
        const commercial = await commercialRequest.findById(requestId);
        if (residentail) {
          const oneRequest = await residentailRequest
            .find({ _id: requestId })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await residentailRequest.findByIdAndUpdate(
            oneRequest[0].id,
            {
              click: (oneRequest[0].click += 1),
            },
            { new: true }
          );
          // console.log(oneListUp.click)
          res.status(200).json({ Request: oneRequest });
        } else if (costal) {
          const oneRequest = await costalRequest
            .find({ _id: requestId })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await costalRequest.findByIdAndUpdate(
            oneRequest[0].id,
            {
              click: (oneRequest[0].click += 1),
            },
            { new: true }
          );
          res.status(200).json({ Request: oneRequest });
        } else if (commercial) {
          const oneRequest = await commercialRequest
            .find({ _id: requestId })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await commercialRequest.findByIdAndUpdate(
            oneRequest[0].id,
            {
              click: (oneRequest[0].click += 1),
            },
            { new: true }
          );
          res.status(200).json({ Request: oneRequest });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
////////////////////////////////// ////////only costalRequest/////////////////////////////////////////////////////
export const getAllcostalRequest = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const costalRequests = await costalRequest
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });
        const costalRequestRents = await costalRequestRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        let Requests = costalRequests.concat(costalRequestRents);
        let Request = shuffleArray(Requests);
        sort(Request);
        await incrementViewAll(Request, costalRequest, costalRequestRent);
        res.status(200).json({ All: Request });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
////////////////////////////////////////only residentialLists/////////////////////////////////////////////////
export const getAllresidentails = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const residentailRequests = await residentailRequest
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        const residentialRents = await residentailRequestRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        let Requests = residentailRequests.concat(residentialRents);
        let Request = shuffleArray(Requests);
        sort(Request);
        await incrementViewAll(
          Request,
          residentailRequest,
          residentailRequestRent
        );
        res.status(200).json({ All: Request });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
////////////////////////////////////////only commercialList/////////////////////////////////////////////////
export const getAllcommercial = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const commercialRequests = await commercialRequest
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        const commercialRents = await commercialRequestRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        let Requests = commercialRequests.concat(commercialRents);

        let Request = shuffleArray(Requests);
        sort(Request);
        await incrementViewAll(
          Request,
          commercialRequest,
          commercialRequestRent
        );
        res.status(200).json({ All: commercialRequests });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
