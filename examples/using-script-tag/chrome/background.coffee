
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

deleteScripts = (document) ->
  scripts = document.querySelectorAll 'script'
  for script in scripts
    script.parentElement.removeChild script
  return document

clearValueAttrib = (document) ->
  inputs = document.querySelectorAll("input[type='password']")
  inputs.forEach (input) ->
    input.setAttribute('value', '') if input.getAttribute('value')

clearOnEventAttribs = (document) ->
  elements = document.querySelectorAll(
    "[#{ONEVENT_ATTRIBS.join('],[')}]"
  )
  elements.forEach (element) ->
    for attr in element.attributes
      if attr?.name in ONEVENT_ATTRIBS
        element.removeAttribute(attr.name)

cleanUp = (document, url) ->
  deleteScripts(document)
  clearOnEventAttribs(document)
  clearValueAttrib(document)
 

save = (htmlText) ->
  file = new File([htmlText],"index.html",{type: "text/html;charset=utf-8"})
  saveAs(file)

chrome.browserAction.onClicked.addListener () ->
  chrome.tabs.query {active: true, currentWindow: true}, (tabArray) ->
    getPage(tabArray[0].id,cleanUp,save)