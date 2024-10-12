export const sort = (arr) => {
  arr.sort((a, b) => {
    const order = {
      turboPlus: 1,
      turbo: 2,
      normal: 3,
    };
    return order[a.typeOfPublish] - order[b.typeOfPublish];
  });
};
