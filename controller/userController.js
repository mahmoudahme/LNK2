import { ApiError } from "../Utils/apiError.js";
import { verifyToken } from "../Utils/verifyToken.js";
import { incrementView } from "../middleware/View.js";
import { shuffleArray } from "../middleware/shuffleArray.js";
import { sort } from "../middleware/sorting.js";
import bcrypt from "bcrypt";
import commercialRent from "../model/Rent/commercialRent.js";
import costalRent from "../model/Rent/costalRent.js";
import residentialRent from "../model/Rent/residentialRent.js";
import commercialList from "../model/Sales/commercialList.js";
import costalList from "../model/Sales/costalList.js";
import residentialList from "../model/Sales/residentialList.js";
import residentailRequest from "../model/Sale Request/residentailRequest.js";
import costalRequest from "../model/Sale Request/costalRequest.js";
import commercialRequest from "../model/Sale Request/commercialRequest.js";
import residentialRequestRent from "../model/Rent Request/residentialRequestRent.js";
import costalRequestRent from "../model/Rent Request/costalRequestRent.js";
import commercialRequestRent from "../model/Rent Request/commercialRequestRent.js";
import User from "../model/User/User.js";
////////////////////////////////GET ALL USERS /////////////////////////////////////////////////
export const getAllUsers = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user.isAdmin) {
        const Users = await User.find();
        res.status(200).json({ Data: Users });
      } else {
        return next(
          new ApiError("You are not authorized to perform this action", 403)
        );
      }
    } catch (error) {
      return next(new ApiError(`System Error ${error}`), 404);
    }
  });
};
///////////////////////////////GET USER BY ID /////////////////////////////////////////////////
export const getUserById = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user) {
        const userID = req.params.id;
        const user = await User.findById(userID);
        const subAccounts = await User.find({ UserId: userID }).select(
          "-password"
        );
        res.status(200).json({ user: user, subAccounts: subAccounts });
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    } catch (error) {
      return next(new ApiError(`System Error ${error}`), 404);
    }
  });
};
////////////////////////////////DELETE USER ///////////////////////////////////////////////////
export const deleteUser = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const userID = req.user.id;
      const user = await User.findById(userID);
      if (req.user.isAdmin || user.typeofUser == "agency") {
        const userID = req.params.id;
        await User.findByIdAndDelete(userID);
        res.status(200).json({ message: "This user is deleted " });
      } else {
        return next(
          new ApiError("You are not authorized to perform this action", 403)
        );
      }
    } catch (error) {
      return next(new ApiError(`System Error ${error}`), 404);
    }
  });
};
////////////////////////////////UPDATA USER ///////////////////////////////////////////////////
export const updateUser = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const userID = req.params.id;
      if (req.user.id === userID || req.user.isAdmin) {
        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
          const newDateforUser = await User.findByIdAndUpdate(userID, {
            password: hashedPassword,
          });
          res.status(200).json({
            Message: "Your Passwprd is Updated",
            UserData: newDateforUser,
          });
        } else {
          const newDataOfUser = await User.findByIdAndUpdate(
            userID,
            { $set: req.body },
            { new: true }
          );
          res.status(200).json({ user: newDataOfUser });
        }
      } else {
        return next(
          new ApiError("You are not authorized to perform this action", 403)
        );
      }
    } catch (error) {
      return next(new ApiError(`System Error ${error}`), 404);
    }
  });
};
////////////////////////////////////////Sale Listing///////////////////////////////////////////////////////
export const getAnotherUser = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user) {
        const userID = req.params.id;
        const user = await User.findById(userID);
        if (user.typeofUser == "agency") {
          const residentialLists = await residentialList
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const residentialLists2 = await residentialList
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let residentialListing = residentialLists.concat(residentialLists2);
          const costalLists = await costalList
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalLists2 = await costalList
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let costalListing = costalLists.concat(costalLists2);
          const commercialLists = await commercialList
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialLists2 = await commercialList
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let commercialListing = commercialLists.concat(commercialLists2);

          let Listing = residentialListing.concat(costalListing);
          let AllListtings = Listing.concat(commercialListing);
          let AllListing = shuffleArray(AllListtings);
          sort(AllListing);
          await incrementView(
            AllListing,
            residentialList,
            commercialList,
            costalList
          );
          // ///////////////////////////////Rent Listing///////////////////////////////////////////////
          const residentialRents = await residentialRent
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const residentialRents2 = await residentialRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let residentialrenting = residentialRents.concat(residentialRents2);
          const costalRents = await costalRent
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRents2 = await costalRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let costalrenting = costalRents.concat(costalRents2);
          const commercialRents = await commercialRent
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRents2 = await commercialRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let commercialrenting = commercialRents.concat(commercialRents2);

          let Renting = residentialrenting.concat(costalrenting);
          let AllRenting = Renting.concat(commercialrenting);
          let AllRentings = shuffleArray(AllRenting);
          sort(AllRentings);
          await incrementView(
            AllRentings,
            residentialRent,
            commercialRent,
            costalRent
          );
          /////////////////////////////////////////////////////////////////////////////////
          let all = AllListing.concat(AllRentings);
          let Alls = shuffleArray(all);
          sort(Alls);
          /////////////////////////////////////////////////////////////////////////////////////////////
          const residentialRequests = await residentailRequest
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const residentialRequests2 = await residentailRequest
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let residentialRequesting =
            residentialRequests.concat(residentialRequests2);
          const costalRequests = await costalRequest
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRequests2 = await costalRequest
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let costalRequesting = costalRequests.concat(costalRequests2);
          const commercialRequests = await commercialRequest
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRequests2 = await commercialRequest
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let commercialRequesting =
            commercialRequests.concat(commercialRequests2);

          let Requests = residentialRequesting.concat(costalRequesting);
          let AllRequests = Requests.concat(commercialRequesting);
          let AllRequest = shuffleArray(AllRequests);
          sort(AllRequest);
          await incrementView(
            AllRequest,
            residentailRequest,
            commercialRequest,
            costalRequest
          );
          // ///////////////////////////////Rent request///////////////////////////////////////////////
          const residentialRequestRents = await residentialRequestRent
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const residentialRequestRents2 = await residentialRequestRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let residentialRequestRenting = residentialRequestRents.concat(
            residentialRequestRents2
          );
          const costalRequestRents = await costalRequestRent
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalRequestRents2 = await costalRequestRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let costalRequestRenting =
            costalRequestRents.concat(costalRequestRents2);
          const commercialRequestRents = await commercialRequestRent
            .find({ AgencyId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialRequestRents2 = await commercialRequestRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          let commercialRequestRenting = commercialRequestRents.concat(
            commercialRequestRents2
          );

          let RentRequest =
            residentialRequestRenting.concat(costalRequestRenting);
          let AllRentRequest = RentRequest.concat(commercialRequestRenting);
          let AllRentRequests = shuffleArray(AllRentRequest);
          sort(AllRentRequests);
          await incrementView(
            AllRentRequests,
            residentialRequestRent,
            commercialRequestRent,
            costalRequestRent
          );
          /////////////////////////////////////////////////////////////////////////////////
          let every = AllRequest.concat(AllRentRequests);
          let everys = shuffleArray(every);
          sort(everys);
          res
            .status(200)
            .json({ user: user, Listings: Alls, requests: everys });
        } else {
          const residentialLists1 = await residentialList
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const residentialLists2 = await residentialRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const residentialLists3 = await residentailRequest
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const residentialLists4 = await residentialRequestRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });

          const costalLists1 = await costalList
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalLists2 = await costalRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });

          const costalLists3 = await costalRequest
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const costalLists4 = await costalRequestRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });

          const commercialLists1 = await commercialList
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialLists2 = await commercialRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialLists3 = await commercialRequest
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });
          const commercialLists4 = await commercialRequestRent
            .find({ userId: userID })
            .populate({ path: "userId", select: "name-_id" })
            .populate({ path: "AgencyId", select: "name-_id" });

          let Listing1 = residentialLists1
            .concat(commercialLists1)
            .concat(costalLists1);
          let Listing2 = residentialLists2
            .concat(commercialLists2)
            .concat(costalLists2);
          let Listing3 = residentialLists3
            .concat(commercialLists3)
            .concat(costalLists3);
          let Listing4 = residentialLists4
            .concat(commercialLists4)
            .concat(costalLists4);
          await incrementView(
            Listing1,
            residentialList,
            commercialList,
            costalList
          );
          await incrementView(
            Listing2,
            residentialRent,
            commercialRent,
            costalRent
          );
          await incrementView(
            Listing3,
            residentailRequest,
            costalRequest,
            costalRequest
          );
          await incrementView(
            Listing4,
            residentialRequestRent,
            commercialRequestRent,
            costalRequestRent
          );
          let AllListing = Listing1.concat(Listing2);
          let AllRequest = Listing3.concat(Listing4);
          let AllListings = shuffleArray(AllListing);
          sort(AllListings);
          let AllRequests = shuffleArray(AllRequest);
          sort(AllRequests);
          res
            .status(200)
            .json({ user: user, listings: AllListings, requests: AllRequests });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    } catch (error) {
      return next(new ApiError(`System Error ${error}`), 404);
    }
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////
export const addCredits = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user) {
        const id = req.params.id;
        const userId = req.user.id;
        const agency = await User.findById(userId);
        const subAccount = await User.findById(id);
        if (agency.typeofUser == "agency") {
          if (subAccount.UserId == userId) {
            const { Credits } = req.body;
            if (agency.credits > Credits) {
              await User.findByIdAndUpdate(
                userId,
                { credits: agency.credits - Credits },
                { new: true }
              );
              await User.findByIdAndUpdate(
                id,
                { credits: subAccount.credits + Credits },
                { new: true }
              );
              res.status(200).json({ message: "Credits added successfully!" });
            } else {
              return next(
                new ApiError(
                  `you don't have alot of Credits Upgrade your Account `,
                  404
                )
              );
            }
          } else {
            return next(
              new ApiError(`You are not the owner of this account `, 404)
            );
          }
        } else {
          return next(new ApiError(`You are not an agency! `, 404));
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    } catch (error) {
      return next(new ApiError(`System Error ${error}`), 404);
    }
  });
};
