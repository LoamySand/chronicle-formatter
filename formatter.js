const form = document.querySelector("#csvForm");
const csvFileInput = document.querySelector("#csvInput");
const textArea = document.querySelector("#csvResult");

let type;
let csvStart;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = csvFileInput.files[0];
  const typeOfFile = document.querySelector('input[name="type"]:checked').value;
  console.log("Form submit: typeOfFile =", typeOfFile);

  if (typeOfFile === "birthdays") {
    type = formatBirthday;
    csvStart = 17;
  } else if (typeOfFile === "anniversaries") {
    type = formatAnniversary;
    csvStart = 21;
  } else if (typeOfFile === "yahrzeit") {
    console.log("formatYarhzeit() has not been programmed");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    let csv = e.target.result;
    console.log("Raw CSV data loaded:", csv.slice(0, 100) + "...");
    csv = cleanCSV(csv, csvStart);
    const csvArray = format(csv, ",", type);
    download("formatted.txt", csvArray);
  };

  reader.readAsText(file);
});

function cleanCSV(string, start) {
  console.log("cleanCSV called with start =", start);
  const cleaned = string.slice(start);
  console.log("cleanCSV result preview:", cleaned.slice(0, 100) + "...");
  return cleaned;
}

function format(stringVal, splitter, type) {
  console.log("format called with splitter =", splitter);
  const theArray = csvToArray(stringVal, splitter);
  const text = arrToTxt(theArray, type);
  console.log("format output length:", text.length);
  return text;
}
function splitCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes; // toggle quote status
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(s => s.replace(/^"|"$/g, '')); // remove quotes
}
function csvToArray(stringVal, splitter) {
console.log("csvToArray called");
  const lines = stringVal.trim().split("\n");

  const [rawKeys, ...rest] = lines.map(line => splitCSVLine(line));

  const keys = rawKeys.map(k => k.trim());
  console.log("CSV keys:", keys);

  const arr = rest.map((item) => {
    const obj = {};
    keys.forEach((key, index) => {
      obj[key] = item[index] || "";
    });
    return obj;
  });

  console.log("csvToArray parsed objects count:", arr.length);
  return arr;
}

function arrToTxt(arr, type) {
  console.log("arrToTxt called on array length:", arr.length);
  const result = arr.map(type).join('\n');
  console.log("arrToTxt output preview:", result.slice(0, 100) + "...");
  return result;
}

function formatBirthday(obj) {
  console.log("formatBirthday called with:", obj);
  const date = formatDate(obj.Date);
  const superscript = getSuperscript(date);
  const formatted = `${date}${superscript}\t${obj.Name}`;
  console.log("formatBirthday output:", formatted);
  return formatted;
}

function formatAnniversary(obj) {
  console.log("formatAnniversary called with:", obj);
  var date = formatAnniversaryDate(obj.Date);
  const formattedName = formatName(obj.Name);
  //const date = obj.Date || "";
  const count = obj["Anniversary Count"] || "";
  const formatted = `${formattedName}\t\t${date}\t\t${count} anniversary`;
  console.log("formatAnniversary output:", formatted);
  return formatted;
}

function formatName(name) {
  console.log("formatName called with:", name);

  // Split into two names by " and "
  const parts = name.split(" and ");

  if (parts.length !== 2) {
    // Single name only
    const [last, first] = parts[0].split(",").map(s => s.trim());
    const formatted = first + " " + last;
    console.log("Single name formatted as:", formatted);
    return formatted;
  }

  // First person
  const [last1, first1] = parts[0].split(",").map(s => s.trim());

  let last2, first2;

  if (parts[1].includes(",")) {
    // Second person has "Last, First" format
    [last2, first2] = parts[1].split(",").map(s => s.trim());
  } else {
    // Second person only has first name, assume same last as first person
    first2 = parts[1].trim();
    last2 = last1;
  }

  if (last1 === last2) {
    // Same last name
    const formatted = `${first1} and ${first2} ${last1}`;
    console.log("formatName shared last name result:", formatted);
    return formatted;
  } else {
    // Different last names
    const formatted = `${first1} ${last1} and ${first2} ${last2}`;
    console.log("formatName different last name result:", formatted);
    return formatted;
  }
}

function getSuperscript(date) {
  console.log("getSuperscript called with date:", date);
  if (["1", "21", "31"].includes(date)) return "st";
  if (["2", "22"].includes(date)) return "nd";
  if (["3", "23"].includes(date)) return "rd";
  return "th";
}

function formatDate(string) {
  console.log("formatDate called with:", string);
  if (!string) return "";
  const parts = string.split(", ");
  if (parts.length > 1) {
    const day = parts[0].split(" ")[1];
    const result = day.startsWith("0") ? day[1] : day;
    console.log("formatDate result:", result);
    return result;
  }
  const fallback = string.slice(-2).startsWith("0") ? string.slice(-1) : string.slice(-2);
  console.log("formatDate fallback result:", fallback);
  return fallback;
}

function formatAnniversaryDate(dateString) {
  // Parse the date string like "July 03, 2025"
  const dateObj = new Date(dateString);

  // Get month name
  const month = dateObj.toLocaleString('default', { month: 'long' });
  // Get day without leading zero
  const day = dateObj.getDate();

  return `${month} ${day}`;
}

function download(filename, text) {
  console.log("download called with filename:", filename);
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
