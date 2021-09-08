 function isEqual(str1, str2) {
 
  return str1.toLowerCase().trim() === str2.toLowerCase().trim();
}
function getTitleFormat(str1) {
  let splittedStrArray = str1.split(" ");
  let splittedStrArrayWithoutSpaces = splittedStrArray
    .map((subStr) => {
      const tempSubStr = subStr.trim().toLowerCase();
      if (tempSubStr.length > 0) {
       // console.log(tempSubStr.length, tempSubStr);
        return tempSubStr.charAt(0).toUpperCase() + tempSubStr.slice(1);
      }
    }).filter((subStr) => {
      if (subStr) return subStr;
     });
  return splittedStrArrayWithoutSpaces.join("-");
}
module.exports={isEqual,getTitleFormat};
