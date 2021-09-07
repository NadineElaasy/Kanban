 function isEqual(str1, str2) {
   //convert to lower case and remove white spaces

   console.log("IS Equal 1:", str1 , str2)
   console.log("IS Equal 2:", str1.toLowerCase().trim() === str2.toLowerCase().trim())

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
//console.log(getTitleFormat("NAdine  Moustafa    ElAssy"));
module.exports={isEqual,getTitleFormat};