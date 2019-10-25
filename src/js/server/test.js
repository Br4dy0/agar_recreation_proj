const string = "{}";
let stringHolder = [];
const getStringCode = (s) =>{
  for(let i = 0; i <  s.length; i++){
    let code = string.charCodeAt(i);
    stringHolder.push(code);
  }
};
const convertToBinary = (array) =>{
  let binaryArray = []
  for(let j = 0; j < array.length; j++){
    let codeString = "";
    let reverseCode = [];
    let code = "";
    while(array[j] > 0){
      code = array[j] % 2;
      array[j] /= 2;
      array[j] = Math.floor(array[j]);
      reverseCode.unshift(code);
    }
    for(let k = 0; k < reverseCode.length; k++){
      codeString += reverseCode[k];
    }
    if(codeString.length < 8){
      let addZeros = "";
      let amountOfZeros = (8 - codeString.length);
      while(amountOfZeros > 0){
        addZeros += 0
        amountOfZeros--;
      }
      codeString = addZeros + codeString;
    }
    binaryArray.push(codeString);
  }
  return binaryArray;
};
let stringCode = getStringCode(string);
let stringBinary = convertToBinary(stringHolder);
console.log(stringBinary);