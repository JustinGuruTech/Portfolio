// list of unsorted numbers

// set number of elements based on window width
width = window.innerWidth;
numElements = Math.floor(width / 47);
let numbers = []
for (i = 0; i < numElements; i++) {
  numbers.push(Math.floor(Math.random() * 99) + 1);
}
numbers[0] = 1;

// sort variables
let speed = 100;
let sortStep = 0;
let running = false;

// slider stuff
slider = document.getElementById("myRange");
speed = 200 - slider.value
slider.oninput = function() {
  speed = 200 - this.value
  document.getElementById("sliderValue").innerText = this.value;
};

let startButton = document.getElementById("startButton")
// start/stop sort on button press
startButton.onclick = function() {
  if (startButton.innerText == "Start Sort" || startButton.innerText == "Resume Sort") {
    running = true;
    startButton.innerText = "Pause Sort";
    document.getElementById("result").innerText = "Sorting...";
    sortSingleStep(sortStep);
    sortStep++;
  } else if (startButton.innerText == "Pause Sort") {
    running = false;
    startButton.innerText = "Pausing...";
  } else if (startButton.innerText == "Binary Search") {
    startBinarySearch();
  }
 };

// element for copying
var element = document.getElementById("placeholder");

// set elements
for (index = 0; index < numbers.length; index++) {
	var newElement = element.cloneNode(true); // copy
  newElement.innerHTML = numbers[index]; // number
  newElement.id = index; // index as id
  newElement.style.paddingTop = (Math.log(numbers[index]) * 4).toString() + "%";
	document.getElementById("elements").appendChild(newElement);
}

var button = document.getElementById("stepButton");
button.onclick = function () {
  if (sortStep <= numbers.length + 5) {
    sortSingleStep(sortStep);
    sortStep++;
  } 
};

// single step of sort
function sortSingleStep(startIndex) {
  if (running) {
    // set comparison color
    document.getElementById(startIndex).className = "element compareToElement";

    // find lowest number
    let lowestNumIndex = startIndex;
    for (let i = startIndex + 1; i < numbers.length; i++) {
    
    // wait between comparisons
      (function (i) {
        setTimeout(function () {
        
          // set comparing style
          document.getElementById(i).className = "element comparingElement";
          // found new minimum
          if (numbers[i] < numbers[lowestNumIndex]) {
            if (lowestNumIndex != startIndex) {
              document.getElementById(lowestNumIndex).className = "element";
            }
            lowestNumIndex = i;
            document.getElementById(i).className = "element minimumElement";
          } 
          
          // not new minimum, set back to regular element style
          else {
            // wait for next element to compare to change back
            setTimeout(function() {
              document.getElementById(i).className = "element";
            }, speed);
          }
          if (i == numbers.length - 1) {
            swapElements(startIndex, lowestNumIndex);
          }
        }, speed*i);
      })(i); 
      document.getElementById(i).className = "element"; 
    }
  }
}

function swapElements(startIndex, lowestNumIndex) {

  // sanity check
  if (startIndex != lowestNumIndex) {
  	setTimeout(function () {
    
    	// swap numbers in list
      tempVal = numbers[startIndex];
      numbers[startIndex] = numbers[lowestNumIndex];
      numbers[lowestNumIndex] = tempVal;
      
      // store elements
      let startElement = document.getElementById(startIndex);
      let lowestElement = document.getElementById(lowestNumIndex);
      
      // update displays in classes
      startElement.className = "element minimumElement";
      lowestElement.className = "element compareToElement";
      
      // update numbers on display
      startElement.innerText = numbers[startIndex];
      lowestElement.innerText = numbers[lowestNumIndex];
      
      // swap heights
      let paddingTemp = startElement.style.paddingTop;
      startElement.style.paddingTop = lowestElement.style.paddingTop;
      lowestElement.style.paddingTop = paddingTemp;
      
    }, speed * 3);
  }
  // reset display
  setTimeout(function () {
    if (startIndex == lowestNumIndex) {
      document.getElementById(startIndex).className = "element minimumElement";
    } else {
      document.getElementById(lowestNumIndex).className = "element";
    }

    if (running) {
      // more to sort
      if (sortStep < numbers.length - 1) {
        button.click(); // move to next step
      } 
      // reached the end
      else {
        running = false;
        startButton.innerText = "Binary Search";
        document.getElementById("result").innerText = "Sorted!";
        document.getElementById("searchNum").style.display = "inline";
        document.getElementById("searchNum").value = numbers[Math.floor(Math.random() * numbers.length)];
        document.getElementById(numbers.length - 1).className = "element minimumElement";
      }
    } 
    // user stopped program
    else {
      startButton.innerText = "Resume Sort";
      document.getElementById(startIndex).className = "element minimumElement";
    }
  }, speed * 6);
}

// start search and display result at end
function startBinarySearch() {
  // reset element displays
  for (i = 0; i < numbers.length; i++) {
    document.getElementById(i).className = "element";
  }
  document.getElementById("result").innerText = "Searching...";
  startButton.innerText = "Searching...";

  // store numbers
  searchNum = document.getElementById("searchNum").value;
  binarySearch(1, searchNum, 0, numbers.length - 1).then(function(result) {
    // update display
    startButton.innerText = "Binary Search";
    if (result != -1 && result != null) {
      document.getElementById(result).className = "element midElement";
      document.getElementById("result").innerText = searchNum + " found at index " + result + "!";
    } else {
      document.getElementById("result").innerText = searchNum + " not found in list.";
    }
  });
  
}

// search logic
function binarySearch(iteration, num, left, right) {

  // promise for waiting for timouts to finish to return
  var promise = new Promise(function(resolve, reject) {
    setTimeout(function() {
      // until left/right cross
      if (left <= right) {
        let mid;
        // set elements to display correctly
        setTimeout(function() {
          mid = Math.floor(left + ((right - left) / 2));
          document.getElementById(left).className = "element leftElement";
          document.getElementById(mid).className = "element midElement";
          document.getElementById(right).className = "element rightElement";
        }, speed);
    
        // number found
        setTimeout(function() {
          if (numbers[mid] == num) {
            resolve(mid);
      
          // number in first half
          } else if (numbers[mid] > num) {
            // wait to update display
            setTimeout(function() {
              document.getElementById(mid).className = "element wrongElement";
            }, speed * 3);
            // wait longer to update display
            setTimeout(function() {
              document.getElementById(mid).className = "element";
              document.getElementById(mid - 1).className = "element rightElement";
              document.getElementById(right).className = "element";
              resolve(binarySearch(iteration + 1, num, left, mid - 1));
            }, speed * 9);
          } 
          // number in second half
          else if (numbers[mid] < num) {
            // wait to update display
            setTimeout(function() {
              document.getElementById(mid).className = "element wrongElement";
            }, speed * 3);
            // wait longer to update display
            setTimeout(function() {
              document.getElementById(left).className = "element";
              document.getElementById(mid).className = "element";
              document.getElementById(mid + 1).className = "element leftElement";
              resolve(binarySearch(iteration + 1, num, mid + 1, right));
            }, speed * 9);
          }
        }, speed * 6);
      } 
      // number not found
      else {
        resolve(-1);
      }
    }, speed);
  })
  return promise;
}




