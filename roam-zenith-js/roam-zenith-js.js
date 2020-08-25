/* 
[[roam/js]] plugin
---
@name         Andy Gao
@namespace    github.com/andyjgao
@version      0.2
@description  Modify Page Width by dragging and allow reordering of side pages
@author       Andy Gao
---
For usage, please read the README.md
*/

//---------Control Center------------
var mainPageMouseResize = true;
var sidePageMouseResize = true;
var mainPageSliderResize = true;
var sidePageSliderResize = true;
var mainWidth = "800px";
var sideWidth = "600px";
var reorderPages = true;
var MultiSelectResize = false; //this option is conditional on reorderPages being true
var multiDragKey = "CTRL"; // this option is conditional on MultSelectResize being true

//--------Code Initialization--------
mainPageMouseResize && mainPageResize();
sidePageResize();
var sheet = document.createElement("style");
document.documentElement.style.setProperty("--page-width", mainWidth);
document.documentElement.style.setProperty("--page-side-width", sideWidth);
sheet.innerHTML =
  "#roam-right-sidebar-content > * > div:last-child:not(:first-child){width: var(--page-side-width);} #roam-right-sidebar-content > *{max-width: var(--page-side-width)};";
document.body.appendChild(sheet);

//Global ShiftKey Event Listener to be used with side pages (Feel free to change event key below to desired key)
var keyPress = false;
window.addEventListener("keydown", (event) => {
  var eventKey = event.shiftKey;

  if (eventKey) {
    keyPress = true;
  }
});
window.addEventListener("keyup", (event) => {
  if (keyPress) {
    keyPress = false;
  }
});

//Main Page Code
function mainPageResize() {
  /* Helper Functions */

  //function used to calculate and set resize of page
  function resize(element, typeWidth) {
    return function (e) {
      const dx = e.x - m_pos;
      m_pos = e.x;
      var pixelWidth = parseInt(getComputedStyle(element, "").maxWidth) + dx;
      document.documentElement.style.setProperty(typeWidth, pixelWidth + "px");
    };
  }
  //adds event listener to find offset
  function position(e) {
    if (roamArticle.offsetWidth - 35 <= e.offsetX) {
      m_pos = e.x;
      document.addEventListener("mousemove", curResize, false);
    }
  }

  //function used to move Page Card on mouse down
  function runPageChange(roamArticle, curResize) {
    roamArticle.addEventListener("mousedown", position, false);
    let removeThis = function () {
      document.removeEventListener("mousemove", curResize, false);
    };
    document.addEventListener("mouseup", removeThis, false);
    return removeThis;
  }

  //initialize values
  let m_pos;
  let roamArticle = document.querySelector("div.roam-article");
  let pageWidth = "--page-width";
  let curResize = resize(roamArticle, pageWidth);
  let removeEventHandlerFunction = runPageChange(roamArticle, curResize);

  //reset values on page-change
  window.addEventListener(
    "hashchange",
    function () {
      roamArticle.removeEventListener("mousedown", position, false);
      document.removeEventListener(
        "mouseup",
        removeEventHandlerFunction,
        false
      );
      roamArticle = document.querySelector("div.roam-article");
      pageWidth = "--page-width";
      curResize = resize(roamArticle, pageWidth);
      removeEventHandlerFunction = runPageChange(roamArticle, curResize);
    },
    false
  );
}

//Side Page Code

function sidePageResize() {
  //Import packages
  let packageGen = new Promise((resolve, reject) => {
    try {
      var sortableJS = document.createElement("script");
      sortableJS.setAttribute(
        "src",
        "https://cdn.jsdelivr.net/npm/sortablejs@1.10.2/Sortable.min.js"
      );
      document.head.appendChild(sortableJS);
      sortableJS.onload = () => {
        resolve("loaded");
      };
      sortableJS.onerror = () => {
        reject(new Error("Error setting up Javascript Packages"));
      };
    } catch {
      reject(new Error("Error setting up Javascript Packages"));
    }
  });

  packageGen
    .then((_) => {
      //resize side pages
      function resize(element, typeWidth) {
        return function (e) {
          const dx = e.x - m_pos;
          m_pos = e.x;
          var pixelWidth =
            parseInt(getComputedStyle(element, "").maxWidth) + dx;
          document.documentElement.style.setProperty(
            typeWidth,
            pixelWidth + "px"
          );
        };
      }
      //add event listener to find offset
      function position(element, otherFunc) {
        return function (e) {
          if (keyPress && element.offsetWidth - 35 <= e.offsetX) {
            m_pos = e.x;
            document.addEventListener("mousemove", otherFunc, false);
          }
        };
      }
      //function used to activate code only when sidebar is open
      function waitForAddedNode(params) {
        new MutationObserver(function (mutations) {
          var el = document.getElementById(params.id);
          if (el) {
            for (let id in params.mouseUpEventHandlers) {
              document.removeEventListener(
                "mouseup",
                params.mouseUpEventHandlers[id],
                false
              );
            }
            params.done(el);
          }
        }).observe(params.parent || document, {
          subtree: !!params.recursive,
          childList: true,
        });
      }

      //unique id generator to help with eventListener cleanup
      function createId(init = 0) {
        return {
          next: () => init++,
          curr: init,
        };
      }

      //initialize values
      var counter = createId(0);

      var documentEventHandlersObject = {};

      waitForAddedNode({
        id: "roam-right-sidebar-content",
        parent: document.getElementById("right-sidebar"),
        recursive: false,
        mouseUpEventHandlers: documentEventHandlersObject,
        done: function (el) {
          if (sidePageMouseResize) {
            let firstDiv = document.querySelector(
              "#roam-right-sidebar-content > div"
            );
            firstDiv.id = "sidePage" + counter.next();
            let curResize = resize(firstDiv, "--page-side-width");
            firstDiv.addEventListener(
              "mousedown",
              position(
                document.querySelector("#roam-right-sidebar-content > div"),
                curResize
              ),
              false
            );
            let removeHandler = function () {
              document.removeEventListener("mousemove", curResize, false);
            };
            document.addEventListener("mouseup", removeHandler, false);
            documentEventHandlersObject[firstDiv.id] = removeHandler;
            sideBarMutationObserver(el);
          }
          if (reorderPages) {
            Sortable.create(el, {
              multiDrag: MultiSelectResize ? true : false,
              selectedClass: "selected",
              multiDragKey,
              direction: "horizontal",
              animation: 150,
              swap: true,
              swapClass: "highlight",
              ghostClass: "ghost",
              easing: "cubic-bezier(.41,1.61,0,-0.57)",
              scroll: true,
              scrollSensitivity: 30,
              scrollSpeed: 10,
            });
          }
        },
      });
      //mutation observer to perform appropriate functions on sideBar changes
      function sideBarMutationObserver(el) {
        // Options for the observer (which mutations to observe)
        const config = {
          attributes: false,
          childList: true,
          subtree: false,
        };

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
          for (let mutation of mutationsList) {
            let curResize;
            if (
              mutation.addedNodes[0] &&
              mutation.target.id === "roam-right-sidebar-content"
            ) {
              mutation.addedNodes[0].id = "sidePage" + counter.next();
              curResize = resize(mutation.addedNodes[0], "--page-side-width");
              mutation.addedNodes[0].addEventListener(
                "mousedown",
                position(mutation.addedNodes[0], curResize),
                false
              );
              let removeHandler = function () {
                document.removeEventListener("mousemove", curResize, false);
              };
              document.addEventListener("mouseup", removeHandler, false);
            } else if (
              mutation.removedNodes[0] &&
              mutation.target.id === "roam-right-sidebar-content"
            ) {
              document.removeEventListener(
                "mouseup",
                documentEventHandlersObject[mutation.removedNodes[0].id],
                false
              );
              delete documentEventHandlersObject[mutation.removedNodes[0].id];
            }
          }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(el, config);
      }
    })
    .catch(alert);
}

//Helper Function
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function updateWidth(typeWidth) {
  return function (e) {
    var pixelWidth = `${e.target.value}px`;
    document.documentElement.style.setProperty(typeWidth, pixelWidth);
  };
}

//SliderPageResizers

function mainPageSliderResizing() {
  var mainPageSlider = document.createElement("input");
  mainPageSlider.type = "range";
  mainPageSlider.min = 300;
  mainPageSlider.max = 1000;
  mainPageSlider.value = mainWidth;
  mainPageSlider.style.mixBlendMode = "color-burn";
  mainPageSlider.addEventListener("input", updateWidth("--page-width"), true);
  newDiv.appendChild(mainPageSlider);
}
function sidePageSliderResizing() {
  var sideBarSlider = document.createElement("input");
  sideBarSlider.type = "range";
  sideBarSlider.min = 300;
  sideBarSlider.max = 1000;
  sideBarSlider.value = sideWidth;
  sideBarSlider.addEventListener(
    "input",
    updateWidth("--page-side-width"),
    true
  );
  newDiv.appendChild(sideBarSlider);
}
