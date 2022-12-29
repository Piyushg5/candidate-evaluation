const addMoreFields = () => {
  const arr = [0];
  arr.push(arr.length);
  console.log('add more fileds', arr);
  return arr;
};

module.exports = addMoreFields;
