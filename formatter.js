const form = document.querySelector("#csvForm");
const csvFileInput = document.querySelector("#csvInput");
const textArea = document.querySelector("#csvResult");

// defines the type of file the user wants converted
let type;
// defines where useable data starts in the CSV provided by rakefet for each type 
let csvStart;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = csvFileInput.files[0];
  typeOfFile = document.querySelector('input[name="type"]:checked').value;
  //console.log(typeOfFile);

  if (typeOfFile == "birthdays") {
    type = formatBirthday;
    csvStart = 17;
  } else if (typeOfFile == "anniversaries") {
    type = formatAnniversary;
    csvStart = 22;
  } else if (typeOfFile == "yahrzeit") {
    console.log("formatYarhzeit() has not been programmed");
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    var csv = e.target.result;
    csv = cleanCSV(csv, csvStart);

    const csvArray = format(csv, ",", type);
    download("formatted.txt", csvArray);
   // console.log("textarea: ", textArea);
   // textArea.value = JSON.stringify(csvArray, null, 4);
  };
  reader.readAsText(file);
});


// remove top two lines from csv

function cleanCSV(string, start){
  //var CSVstart = string.match(",,");
  var cleanedCSV = string.slice(start);
  console.log(cleanedCSV);

  return cleanedCSV;
}
//csv -> txt 
function format(stringVal, splitter, type) {
 // var  = stringVal.match(",,\n,,")
  //console.log(cleanString);
  //console.log(stringVal);
  const theArray = csvToArray(stringVal, splitter);
  

  //formatBirthday(formedArr[0]);
 // return formedArr;
    return fileText = arrToTxt(theArray, type);
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

//Takes a single csv and turns into array of objects
function csvToArray(stringVal, splitter){
  const [keys, ...rest] = stringVal
  .trim()
  .split("\n")
  .map((item) => item.split(splitter));

  //renames anniversary key to something usable
  if (keys[3]==='Anniversary Count\r') {
    keys[4] = "Count";
  };


  console.log('CSV keys: ', keys);
  console.log('CSV values: ', rest);


const formedArr = rest.map((item) => {
  const object = {};
  keys.forEach((key, index) => (object[key] = item.at(index)));
  return object;
}) 

formedArr.sort(dynamicSort("Date"));

return formedArr;

}


//Takes entire array turns it into a single string
function arrToTxt(arr, type){

    var text  = ""
    for(var i=0; i < arr.length; i++){
        text = text + '\n' + type(arr[i]);
    }

    //console.log(text);
    return text;
}


// formats individual birthday objects
function formatBirthday(obj){
    var date = formatDate(obj.Date);
    var superscript ="";
    if(date === "21"){
        superscript = "st"
    } else if (date === "22"){
        superscript = "nd"
    } else if (date === "23"){
        superscript = "rd"
    } else if (date === "31"){
        superscript = "st"
    } else if (date === "1"){
        superscript = "st";
    } else if (date ==="2") {
        superscript = "nd";
    } else if (date==="3") {
        superscript = "rd";
    } else {
        superscript = "th";
    }
    var tempString = date + superscript + "\t" + obj.Name.substring(1, obj.Name.length-1);
    //console.log(tempString);
    return tempString;
}
// formats individual anniversary objects 
function formatAnniversary(obj) {
  var date = formatDate(obj.Date);
  var superscript ="";
    if(date === "21"){
        superscript = "st"
    } else if (date === "22"){
        superscript = "nd"
    } else if (date === "23"){
        superscript = "rd"
    } else if (date === "31"){
        superscript = "st"
    } else if (date === "1"){
        superscript = "st";
    } else if (date ==="2") {
        superscript = "nd";
    } else if (date==="3") {
        superscript = "rd";
    } else {
        superscript = "th";
    }

  var anniversaryCount = obj.Count.substring(1, obj.Count.length-4);
    if (anniversaryCount = 1){
        var tempString = date + superscript + "\t" + obj.Name.substring(1, obj.Name.length-1) + "\t\t\t" + anniversaryCount + " year";

    } else {
        var tempString = date + superscript + "\t" + obj.Name.substring(1, obj.Name.length-1) + "\t\t\t" + anniversaryCount + " years";
    }
    return tempString;
}
// formats individual yahrzeit objects 


function formatDate(string){
  //console.log(string);
  // string from -8 to -6 char
  //string = string.substring(string.length-8, string.length-6);
  string = string.substring(string.length-2);

  //console.log(string);

  //trim leading zero
  if (string[0] === "0") {
    string = string.substring(1);
  //console.log(string);

  }
  return string;
}
  // Start file download.
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  


