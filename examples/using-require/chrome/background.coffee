fileSaver = require 'file-saver'
pageCatch = require '../../../src/page-catch.coffee'

id = 0
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

deleteScripts = (document) ->
  scripts = document.querySelectorAll 'script'
  for script in scripts
    script.parentElement.removeChild script
  return document

deleteAxtElements = (document) ->
  axtElements = document.querySelectorAll('.axt-element')
  console.log "axtElements =", axtElements
  axtElements.forEach (element) ->
    element.parentElement?.removeChild(element)

deleteMeta = (document) ->
  metaElements = document.querySelectorAll('meta[http-equiv]')
  metaElements.forEach (element) ->
    if element.getAttribute('http-equiv') in META_ATTRIBS_FOR_DEL
      element.parentElement?.removeChild(element)

deleteSendBoxAttrib = (document) ->
  iframes = document.querySelectorAll('iframe[sendbox]')
  iframes.forEach (iframe) ->
    iframe.removeAttribute('sendbox')

deleteAxtAttribs = (document) ->
  body = document.getElementsByTagName('body')[0]
  body.removeAttribute('axt-keyreel-extension-installed')
  body.removeAttribute('axt-parser-timing')

  axtAttrElements = document.querySelectorAll('[axt-visible]')
  axtAttrElements.forEach (element) ->
    element.removeAttribute('axt-visible')

replaceAxtAttribs = (document) ->
  _processForm = (form) ->
    if form.hasAttribute('axt-expected-form-type')
      form_type = form.getAttribute('axt-expected-form-type')
    else
      form_type = form.getAttribute('axt-form-type')

    form.removeAttribute('axt-form-type')
    if form_type
      form.setAttribute('axt-expected-form-type', form_type)
    else
      form.removeAttribute('axt-expected-form-type')

    form.querySelectorAll(
      '[axt-input-type],[axt-expected-input-type]'
    ).forEach (input) ->
      if input.hasAttribute('axt-expected-input-type')
        input_type = input.getAttribute('axt-expected-input-type')
      else
        input_type = input.getAttribute('axt-input-type')

      input.removeAttribute('axt-input-type')
      if input_type
        input.setAttribute('axt-expected-input-type', input_type)
      else
        input.removeAttribute('axt-expected-input-type')

    form.querySelectorAll(
      '[axt-button-type],[axt-expected-button-type]'
    ).forEach (button) ->
      if button.hasAttribute('axt-expected-button-type')
        button_type = button.getAttribute('axt-expected-button-type')
      else
        button_type = button.getAttribute('axt-button-type')

      button.removeAttribute('axt-button-type')
      if button_type
        button.setAttribute('axt-expected-button-type', button_type)
      else
        button.removeAttribute('axt-expected-button-type')

  # process all forms except <body>
  body = document.getElementsByTagName('body')[0]
  body.querySelectorAll(
    '[axt-form-type],[axt-expected-form-type'
  ).forEach(_processForm)
  # then process <body> if it's a form
  # WHY? we need it because <body> include all forms, so it can process all
  # forms inputs as its own. To avoid this we process all forms first and
  # only then we process <body>
  _processForm(body) if body.getAttribute('axt-form-type')?

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
  deleteMeta(document)
  clearOnEventAttribs(document)
  deleteSendBoxAttrib(document)
  deleteAxtElements(document)
  deleteAxtAttribs(document)
  replaceAxtAttribs(document)
  clearValueAttrib(document)
 
#save our html in file
save = (htmlText) ->
  file = new File([htmlText], "index.html", {type: "text/html;charset=utf-8"})
  fileSaver.saveAs(file)

chrome.management.getAll (extensionsArray) ->
  for extension in extensionsArray
    if(extension.name == 'KeyReel form checker' and extension.enabled)
      id = extension.id
      return

chrome.runtime.onMessageExternal.addListener (request, sender, sendResponse) ->
  console.log 'request', request
  console.log 'sender:', sender
  console.log 'sendResponse', sendResponse
  console.log id
  if (sender.id == id)
    chrome.tabs.query {active: true, currentWindow: true}, (tabArray) ->
      console.log pageCatch
      pageCatch(tabArray[0].id, cleanUp, save)

#event checker for catch click on extension icon
chrome.browserAction.onClicked.addListener () ->
  chrome.tabs.query {active: true, currentWindow: true}, (tabArray) ->
    pageCatch(tabArray[0].id, cleanUp, save)