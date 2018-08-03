fileSaver = require 'file-saver'
pageCatch = require '../../../src/page-catch.coffee'

#values attribute onEvent
META_ATTRIBS_FOR_DEL = [
  'Content-Security-Policy'
  'refresh'
]

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

# clean up procedures:
deleteScripts = (document) ->
  scripts = document.querySelectorAll 'script'
  for script in scripts
    script.parentElement.removeChild script
  return document

deleteMeta = (document) ->
  metaElements = document.querySelectorAll('meta[http-equiv]')
  metaElements.forEach (element) ->
    if element.getAttribute('http-equiv') in META_ATTRIBS_FOR_DEL
      element.parentElement?.removeChild(element)

deleteSendBoxAttrib = (document) ->
  iframes = document.querySelectorAll('iframe[sendbox]')
  iframes.forEach (iframe) ->
    iframe.removeAttribute('sendbox')

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

deleteNoScripts = (document) ->
  scripts = document.querySelectorAll 'noscript'
  for script in scripts
    script.parentElement.removeChild script
  return document

cleanUp = (document, url) ->
  # deleteNoScripts(document)
  deleteScripts(document)
  deleteMeta(document)
  clearOnEventAttribs(document)
  deleteSendBoxAttrib(document)
  clearValueAttrib(document)

#save our html in a file
save = (htmlText) ->
  file = new File([htmlText], 'index.html', {type: "text/html;charset=utf-8"})
  fileSaver.saveAs(file)

#event listener for catching a click on the extension icon
chrome.browserAction.onClicked.addListener () ->
  chrome.tabs.query {active: true, currentWindow: true}, (tabArray) ->
    pageCatch(tabArray[0].id, cleanUp, save)

