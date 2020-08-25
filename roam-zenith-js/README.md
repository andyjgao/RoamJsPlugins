# How to Use RoamZenithJs Plugin

1. Type `{{[[roam/js]]}}` on a page in which you want to store your javascript code.
2. Once a Dialog appears, press "yes, I know what I'm doing"
3. Create a new code block nested under `{{[[roam/js]]}}` and switch to javascript
4. Insert code from this repository
5. Go to [[roam/css]] page and insert the following css code:
   ```
    /* don't limit the block width */
    .rm-block-text {
        max-width: none!important;
    }
    .ghost{
        opacity: .5;
        background: #C8EBFB;
    }
    .highlight{
        background-color: #f9c7c8 !important;
    }
     .selected {
     background-color: #FFEB3B !important;
     z-index: 1 !important;
    }
   ```
6. Refresh Page. Enjoy.
7. If you want to turn on/off features, change the variables inside `Control Center`

```
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
```

# Features:
* __Main Page Resize__: 
   * __Option A:__ On Mouse Press, drag the right side of the page
   * __Option B:__ Use a slider to control Main Page size
* __Side Page Resize__: 
   * __Option A:__ Hold down Shift + Mouse Press, drag the right side of the Side Page
   * __Option B:__ Use a slider to control Side Page size
* __Side Page Reorder__: On Mouse Press, drag from the center of page to desired reorder location.
* __Multi Select Drag__: (Experimental) Hold down control and Mouse press to select pages to reorder

