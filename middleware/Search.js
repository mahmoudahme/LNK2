import stringSimailaty from "string-similarity";
import { sort } from "./sorting.js";
export const Search = async (minR,maxR,minA,maxA,keyWords,lists,model1) => {
  if (minR !== "" && maxR !== "") {
    var listFilter = lists.filter(
      (list) => list.price > minR && list.price < maxR
    );
    if (minA !== "" && maxA !== "") {
      var lastFilter = listFilter.filter(
        (list) => list.area > minA && list.area < maxA
      );
      sort(lastFilter);
      if (keyWords !== "") {
        var arr1 = [];
        for (var i = 0; i < lastFilter.length; i++) {
          const arabicText1 = lastFilter[i].title;
          const arabicText2 = keyWords;
          const similarity = stringSimailaty.compareTwoStrings(
            arabicText1,
            arabicText2
          );
          if (similarity * 100 > 10) {
            arr1.push(lastFilter[i]);
          }
        }
        for (var i = 0; i < arr1.length; i++) {
          await model1.findByIdAndUpdate(arr1[i].id, {
            view: arr1[i].view + 1,
          });
        }
        return arr1;
      } else {
        for (var i = 0; i < lastFilter.length; i++) {
          await model1.findByIdAndUpdate(lastFilter[i].id, {
            view: lastFilter[i].view + 1,
          });
        }
        return lastFilter;
      }
    } else {
      sort(listFilter);
      if (keyWords !== "") {
        var arr1 = [];
        for (var i = 0; i < listFilter.length; i++) {
          const arabicText1 = listFilter[i].title;
          const arabicText2 = keyWords;
          const similarity = stringSimailaty.compareTwoStrings(
            arabicText1,
            arabicText2
          );
          if (similarity * 100 > 10) {
            arr1.push(listFilter[i]);
          }
        }
        for (var i = 0; i < arr1.length; i++) {
          await model1.findByIdAndUpdate(arr1[i].id, {
            view: arr1[i].view + 1,
          });
        }
        return arr1;
      } else {
        for (var i = 0; i < listFilter.length; i++) {
          await model1.findByIdAndUpdate(listFilter[i].id, {
            view: listFilter[i].view + 1,
          });
        }
        return listFilter;
      }
    }
  } else {
    if (minA !== "" && maxA !== "") {
      var lastFilter = lists.filter(
        (list) => list.area > minA && list.area < maxA
      );
      sort(lastFilter);
      if (keyWords !== "") {
        var arr1 = [];
        for (var i = 0; i < lastFilter.length; i++) {
          const arabicText1 = lastFilter[i].title;
          const arabicText2 = keyWords;
          const similarity = stringSimailaty.compareTwoStrings(
            arabicText1,
            arabicText2
          );
          if (similarity * 100 > 10) {
            arr1.push(lastFilter[i]);
          }
        }
        for (var i = 0; i < arr1.length; i++) {
          await model1.findByIdAndUpdate(arr1[i].id, {
            view: arr1[i].view + 1,
          });
        }
        return arr1;
      } else {
        for (var i = 0; i < lastFilter.length; i++) {
          await model1.findByIdAndUpdate(lastFilter[i].id, {
            view: lastFilter[i].view + 1,
          });
        }
        return lastFilter;
      }
    } else {
      sort(lists);
      for (var i = 0; i < lists.length; i++) {
        await model1.findByIdAndUpdate(lists[i].id, {
          view: lists[i].view + 1,
        });
      }
      return lists;
    }
  }
};