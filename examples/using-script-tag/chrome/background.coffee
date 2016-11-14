
#values attribute onEvent
ONEVENT_ATTRIBS = [
  'onload'
  'onclick'
  'onkeyup'
  'onkeydown'
  'onenter'
  'onmouseenter',
  'onmouseleave'
  'onkeypress'
]

#remove all tags script from page
deleteScripts = (document) ->
  scripts = document.querySelectorAll 'script'
  for script in scripts
    script.parentElement.removeChild script
  return document

#remove attributes value from tag input
clearValueAttrib = (document) ->
  inputs = document.querySelectorAll("input[type='password']")
  inputs.forEach (input) ->
    input.setAttribute('value', '') if input.getAttribute('value')

#remove all events from page
clearOnEventAttribs = (document) ->
  elements = document.querySelectorAll(
    "[#{ONEVENT_ATTRIBS.join('],[')}]"
  )
  elements.forEach (element) ->
    for attr in element.attributes
      if attr?.name in ONEVENT_ATTRIBS
        element.removeAttribute(attr.name)

#run all function for clean page
cleanUp = (document, url) ->
  deleteScripts(document)
  clearOnEventAttribs(document)
  clearValueAttrib(document)
 
#save our html in file
save = (htmlText) ->
  file = new File([htmlText],"index.html",{type: "text/html;charset=utf-8"})
  saveAs(file)

#event checker for catch click on extension icon
chrome.browserAction.onClicked.addListener () ->
  chrome.tabs.query {active: true, currentWindow: true}, (tabArray) ->
    getPage(tabArray[0].id,cleanUp,save)