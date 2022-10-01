
# contents
chrome storage contains...

  activeTabs = [
    [tabId]: {
      url: [url],
      count: [count]
    },
    ...
  ]

  library = [
    [url]: [accumulativeCount],
    ...
  ]


  popup controls library
  
  background handles listeners and injects foreground. 

  foreground runs once within the lifetime of a tab to avoid compounding count functions


   -navigation and visibility logic has to be handled in foreground to avoid foreground script compounding

   maybe everything lives inside of the visibilty, just have to narrow down the response to one instead of many for both hidden and visible. 

  
