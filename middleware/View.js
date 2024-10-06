export const incrementView = async (arr, model1 , model2 , model3) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].typeOfList == "residential" || arr[i].typeOfRequest == "residential" ) {
      await model1.findByIdAndUpdate(
        arr[i].id,
        { view: arr[i].view + 1 },
        { new: true }
      );
    } else if (arr[i].typeOfList == "commercial" || arr[i].typeOfRequest == "commercial") {
      await model2.findByIdAndUpdate(
        arr[i].id,
        { view: arr[i].view + 1 },
        { new: true }
      );
    } else if (arr[i].typeOfList == "costal" || arr[i].typeOfRequest == "costal") {
      await model3.findByIdAndUpdate(
        arr[i].id, 
        {view: arr[i].view + 1,},
        {new : true}
      );
    }
  }
  return arr ;
};

export const incrementViewAll = async(arr , model1 , model2)=>{
  for (var i = 0; i < arr.length; i++) {
      await model1.findByIdAndUpdate(
        arr[i].id,
        { view: arr[i].view + 1 },
        { new: true }
      );
      await model2.findByIdAndUpdate(
        arr[i].id,
        { view: arr[i].view + 1 },
        { new: true }
      );
  }
  return arr ;
}
