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
    #roam-right-sidebar-content > * > div:last-child:not(:first-child) {
        width: var(--page-side-width);
    } 

    #roam-right-sidebar-content .roam-block-container{
        max-width: var(--page-side-width);
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
6. Inside the :root css selector create a new variable `--page-side-width` and set it to desired size. (e.g `--page-side-width: 600px`)
7. Refresh Page. Enjoy.

# Features:
* __Main Page Resize__: On Mouse Press, drag the right side of the page
* __Side Page Resize__: Hold down Shift + Mouse Press, drag the right side of the Side Page
* __Side Page Reorder__: On Mouse Press, drag from the center of page to desired reorder location.
* __Multi Select__: Hold down Control + Mouse Press on the pages you want, then drag to desired reorder location. 
