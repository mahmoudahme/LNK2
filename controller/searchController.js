import commercialList from "../model/Sales/commercialList.js";
import costalList from "../model/Sales/costalList.js";
import residentialList from "../model/Sales/residentialList.js";
import commercialRent from "../model/Rent/commercialRent.js";
import costalRent from "../model/Rent/costalRent.js";
import residentialRent from "../model/Rent/residentialRent.js";
import residentailRequest from "../model/Sale Request/residentailRequest.js";
import commercialRequest from "../model/Sale Request/commercialRequest.js";
import costalRequest from "../model/Sale Request/costalRequest.js";
import residentialRequestRent from "../model/Rent Request/residentialRequestRent.js";
import commercialRequestRent from "../model/Rent Request/commercialRequestRent.js";
import costalRequestRent from "../model/Rent Request/costalRequestRent.js";
import { ApiError } from "../Utils/apiError.js";
import { verifyToken } from "../Utils/verifyToken.js";
import { Search } from "../middleware/Search.js";

export const filteration = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user) {
        const {
          minRange,
          maxRange,
          maxArea,
          minArea,
          keyWords,
          ...otherQueryParams
        } = req.query;
        const otherQuery = Object.fromEntries(
          Object.entries(otherQueryParams).filter(
            ([key, value]) => value !== undefined && value !== ""
          )
        );
        if (otherQuery.typeOfList == "residential") {
          const lists = await residentialList.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            residentialList
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfList == "commercial") {
          const lists = await commercialList.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            commercialList
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfList == "costal") {
          const lists = await costalList.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            costalList
          );
          res.status(200).json({ Lists: Listing });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    } catch (error) {
      return next(new ApiError(`System Error `, 404));
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
export const filterationRent = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user) {
        const {
          minRange,
          maxRange,
          maxArea,
          minArea,
          keyWords,
          ...otherQueryParams
        } = req.query;
        const otherQuery = Object.fromEntries(
          Object.entries(otherQueryParams).filter(
            ([key, value]) => value !== undefined && value !== ""
          )
        );
        if (otherQuery.typeOfList == "residential") {
          const lists = await residentialRent.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            residentialRent
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfList == "commercial") {
          const lists = await commercialRent.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            commercialRent
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfList == "costal") {
          const lists = await costalRent.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            costalRent
          );
          res.status(200).json({ Lists: Listing });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    } catch (error) {
      return next(new ApiError(`System Error `, 404));
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
export const filterationRequest = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user) {
        const {
          minRange,
          maxRange,
          maxArea,
          minArea,
          keyWords,
          ...otherQueryParams
        } = req.query;
        const otherQuery = Object.fromEntries(
          Object.entries(otherQueryParams).filter(
            ([key, value]) => value !== undefined && value !== ""
          )
        );
        if (otherQuery.typeOfRequest == "residential") {
          const lists = await residentailRequest.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            residentailRequest
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfRequest == "commercial") {
          const lists = await commercialRequest.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            commercialRequest
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfRequest == "costal") {
          const lists = await costalRequest.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            costalRequest
          );
          res.status(200).json({ Lists: Listing });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    } catch (error) {
      return next(new ApiError(`System Error `, 404));
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
export const filterationRentRequest = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      if (req.user) {
        const {
          minRange,
          maxRange,
          maxArea,
          minArea,
          keyWords,
          ...otherQueryParams
        } = req.query;
        const otherQuery = Object.fromEntries(
          Object.entries(otherQueryParams).filter(
            ([key, value]) => value !== undefined && value !== ""
          )
        );
        if (otherQuery.typeOfRequest == "residential") {
          const lists = await residentialRequestRent.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            residentialRequestRent
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfRequest == "commercial") {
          const lists = await commercialRequestRent.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            commercialRequestRent
          );
          res.status(200).json({ Lists: Listing });
        } else if (otherQuery.typeOfRequest == "costal") {
          const lists = await costalRequestRent.find(otherQuery);
          const Listing = await Search(
            minRange,
            maxRange,
            minArea,
            maxArea,
            keyWords,
            lists,
            costalRequestRent
          );
          res.status(200).json({ Lists: Listing });
        }
      } else {
        return next(new ApiError(`You are not authenticated! `, 404));
      }
    } catch (error) {
      return next(new ApiError(`System Error `, 404));
    }
  });
};
