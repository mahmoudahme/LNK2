import { configDotenv } from "dotenv";
import commercialRent from "../model/Rent/commercialRent.js";
import costalRent from "../model/Rent/costalRent.js";
import residentialRent from "../model/Rent/residentialRent.js";
import User from "../model/User/User.js";
import { ApiError } from "../Utils/apiError.js";
import { verifyToken } from "../Utils/verifyToken.js";
import { shuffleArray } from "../middleware/shuffleArray.js";
import { sort } from "../middleware/sorting.js";
import { incrementView } from "../middleware/View.js";

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
            const imageNames = req.files.map((file) => file.filename);
            if (req.body.typeOfList == "residential") {
              const createdListing = new residentialRent({
                typeOfList: req.body.typeOfList,
                location: req.body.location,
                city: req.body.city,
                apartment: req.body.apartment,
                title: req.body.title,
                description: req.body.description,
                floor: req.body.floor,
                area: req.body.area,
                rooms: req.body.rooms,
                bathRooms: req.body.bathRooms,
                reseptionPieces: req.body.reseptionPieces,
                furnising: req.body.furnising,
                balcona: req.body.balcona,
                finishing: req.body.finishing,
                additional: req.body.additional,
                typeOfRent: req.body.typeOfRent,
                price: req.body.price,
                advanceRent: req.body.advanceRent,
                insurance: req.body.insurance,
                typeOfPublish: req.body.typeOfPublish,
                images: imageNames,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdListing.save();
            } else if (req.body.typeOfList == "costal") {
              const createdListing = new costalRent({
                typeOfList: req.body.typeOfList,
                location: req.body.location,
                city: req.body.city,
                apartment: req.body.apartment,
                title: req.body.title,
                description: req.body.description,
                floor: req.body.floor,
                area: req.body.area,
                rooms: req.body.rooms,
                bathRooms: req.body.bathRooms,
                reseptionPieces: req.body.reseptionPieces,
                furnising: req.body.furnising,
                balcona: req.body.balcona,
                finishing: req.body.finishing,
                additional: req.body.additional,
                typeOfRent: req.body.typeOfRent,
                price: req.body.price,
                advanceRent: req.body.advanceRent,
                insurance: req.body.insurance,
                typeOfPublish: req.body.typeOfPublish,
                images: imageNames,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdListing.save();
            } else if (req.body.typeOfList == "commercial") {
              const createdListing = new commercialRent({
                typeOfList: req.body.typeOfList,
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
                images: imageNames,
                whatsApp: req.body.whatsApp,
                phoneNumber: req.body.phoneNumber,
                userId: req.user.id,
                AgencyId: user.UserId,
              });
              await createdListing.save();
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
/////////////////////////////////////GET ALL LISTING////////////////////////////////////////////////////////
export const getAllListing = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const residentialRents = await residentialRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });
        const costalRents = await costalRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });
        const commercialRents = await commercialRent
          .find()
          .populate({ path: "userId", select: "name-_id" })
          .populate({ path: "AgencyId", select: "name-_id" });

        let Rents = residentialRents.concat(costalRents);
        let AllRents = Rents.concat(commercialRents);
        let AllRent = shuffleArray(AllRents);
        sort(AllRent);
        await incrementView(
          AllRent,
          residentialRent,
          commercialRent,
          costalRent
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

export const getAllMyListing = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user.typeofUser == "freelancer") {
          const residentialRents = await residentialRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRents = await costalRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRents = await commercialRent
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
          const residentialRents = await residentialRent
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRents = await costalRent
            .find({ AgencyId: user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRents = await commercialRent
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
          const residentialRents = await residentialRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRents = await costalRent
            .find({ userId: req.user.id })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRents = await commercialRent
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
//////////////////////////////////////UPDATE LISTING////////////////////////////////////////////////////////
export const updateListing = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const listId = req.params.id;
        const residentail = await residentialRent.findById(listId);
        const costal = await costalRent.findById(listId);
        const commercial = await commercialRent.findById(listId);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId ||
            req.user.isAdmin 
          ) {
            const newRent = await residentialRent
              .findByIdAndUpdate(listId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Listing: newRent });
          } else {
            return next(new ApiError(`You Can't Update This List `, 400));
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId || req.user.isAdmin) {
            const newRent = await costalRent
              .findByIdAndUpdate(listId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Listing: newRent });
          } else {
            return next(new ApiError(`You Can't Update This List `, 400));
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId || req.user.isAdmin
          ) {
            const newRent = await commercialRent
              .findByIdAndUpdate(listId, { $set: req.body }, { new: true })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ Listing: newRent });
          } else {
            return next(new ApiError(`You Can't Update This List `, 400));
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
//////////////////////////////////////DELETE LISTING////////////////////////////////////////////////////////
export const deleteListing = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const listId = req.params.id;
        const residentail = await residentialRent.findById(listId);
        const costal = await costalRent.findById(listId);
        const commercial = await commercialRent.findById(listId);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId || req.user.isAdmin
          ) {
            await residentialRent.findByIdAndDelete(listId);
            res.status(200).json({ Message: " Your list is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This List `, 400));
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId || req.user.isAdmin) {
            await costalRent.findByIdAndDelete(listId);
            res.status(200).json({ Message: " Your list is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This List `, 400));
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId || req.user.isAdmin
          ) {
            await commercialRent.findByIdAndDelete(listId);
            res.status(200).json({ Message: " Your list is Deleted ! " });
          } else {
            return next(new ApiError(`You Can't Delete This List `, 400));
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

export const oneListFromMyListing = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const listID = req.params.listid;
        const residentail = await residentialRent.findById(listID);
        const costal = await costalRent.findById(listID);
        const commercial = await commercialRent.findById(listID);
        if (residentail) {
          if (
            req.user.id == residentail.userId ||
            req.user.id == residentail.AgencyId || req.user.isAdmin
          ) {
            const oneList = await residentialRent
              .find({ _id: listID })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ List: oneList });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This List As Owner`, 404)
            );
          }
        } else if (costal) {
          if (req.user.id == costal.userId || req.user.id == costal.AgencyId || req.user.isAdmin) {
            const oneList = await costalRent
              .find({ _id: listID })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ List: oneList });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This List As Owner`, 404)
            );
          }
        } else if (commercial) {
          if (
            req.user.id == commercial.userId ||
            req.user.id == commercial.AgencyId || req.user.isAdmin
          ) {
            const oneList = await commercialRent
              .find({ _id: listID })
              .populate({ path: "userId", select: "name-_id" })
              .populate({ path: "AgencyId", select: "name-_id" });
            res.status(200).json({ List: oneList });
          } else {
            return next(
              new ApiError(`Sorry You Can't view This List As Owner`, 404)
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
//////////////////////////////////////GET LIST FROM OUT LISTING ////////////////////////////////////////////
export const getListFromOut = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      if (req.user) {
        const listID = req.params.listid;
        const residentail = await residentialRent.findById(listID);
        const costal = await costalRent.findById(listID);
        const commercial = await commercialRent.findById(listID);
        if (residentail) {
          const oneList = await residentialRent
            .find({ _id: listID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await residentialRent.findByIdAndUpdate(
            oneList[0].id,
            {
              click: (oneList[0].click += 1),
            },
            { new: true }
          );
          // console.log(oneListUp.click)
          res.status(200).json({ List: oneList });
        } else if (costal) {
          const oneList = await costalRent
            .find({ _id: listID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await costalRent.findByIdAndUpdate(
            oneList[0].id,
            {
              click: (oneList[0].click += 1),
            },
            { new: true }
          );
          res.status(200).json({ List: oneList });
        } else if (commercial) {
          const oneList = await commercialRent
            .find({ _id: listID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          await commercialRent.findByIdAndUpdate(
            oneList[0].id,
            {
              click: (oneList[0].click += 1),
            },
            { new: true }
          );
          res.status(200).json({ List: oneList });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    });
  } catch (error) {
    return next(new ApiError(`System Error `, 404));
  }
};
