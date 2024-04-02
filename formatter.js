const form = document.querySelector("#csvForm");
const csvFileInput = document.querySelector("#csvInput");
const textArea = document.querySelector("#csvResult");


form.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = csvFileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const csvArray = csvToArr(e.target.result, ",");
    download("bday.txt", csvArray);
   // console.log("textarea: ", textArea);
   // textArea.value = JSON.stringify(csvArray, null, 4);
  };

  reader.readAsText(file);
});

function csvToArr(stringVal, splitter) {
  const [keys, ...rest] = stringVal
    .trim()
    .split("\n")
    .map((item) => item.split(splitter));

    //console.log('CSV keys: ', keys);
    //console.log('CSV values: ', rest);

  const formedArr = rest.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = item.at(index)));
    return object;
  });

  formatBirthday(formedArr[0]);
 // return formedArr;
    return fileText = arrToTxt(formedArr);
}

function arrToTxt(arr){
    var text  = ""
    for(var i=0; i < arr.length; i++){
        text = text + '\n' + formatBirthday(arr[i]);
    }

    //console.log(text);
    return text;
}
function formatBirthday(obj){
    var date = obj.Date.substring(0,1);
    var superscript ="";
    if(date === "1"){
        superscript = "st";
    } else if (date ==="2") {
        superscript = "nd";
    } else if (date==="3") {
        superscript = "rd";
    } else {
        superscript = "th";
    }
    var tempString = date + superscript + "\t" + obj.Name;
    //console.log(tempString);
    return tempString;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  
  // Start file download.

