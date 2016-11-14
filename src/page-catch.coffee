xhrToBase64 = require './modules/xhr-to-base64.coffee'
convertURL = require './modules/get-relative-link.coffee'
getXHR = require './modules/xhr.coffee'
inlineCSS = require './modules/inline-css.coffee'



META_ATTRIBS_FOR_DEL = [
  'Content-Security-Policy'
  'refresh'
]

class TreeElementNotFound extends Error


#get array with information of every frame
getSource = () ->
  
  ###!
  # get frame index in page
  # @return {String} - frame index
  # @example 0:3:5
  ###
  getFramePath = () ->
    fid = []

    ###!
    # add frame-ID into fid[] array (recursive)
    # @param {Window} win - parent's Window object
    ###
    _get_frame_id = (win) ->
      parent = win.parent
      return if win == parent
      idx = '?'
      for frame, frame_idx in parent.frames
        if win == frame
          idx = frame_idx
          break
      fid.unshift idx
      _get_frame_id(parent)
      return
    _get_frame_id(window)
    return fid.join ':'

  ###!
  # get frame position on content script
  # @param {HTMLDocument} DOM - DOM document object
  # @return {Object} - frames position on current frame
  # @example [3,0,0]: 0
  ###
  getElementPath = (DOM) ->
    dictionary = {}

    ###!
    # get frameID
    # @param {HTMLIframeElement} obj - iframe document object
    # @return {String} - string with index iframe
    # @example [3,0,0]
    ###
    getFrameId = (obj) ->
      result = []
      _getPositionOfFrame = (obj)->
        if obj.parentElement == DOM
          return
        else
          parent = obj.parentElement
          nodeList = Array.prototype.slice.call(parent.children)
          index = nodeList.indexOf(obj)
          result.unshift(index)
          _getPositionOfFrame(parent)
      _getPositionOfFrame(obj)
      console.log result
      return JSON.stringify(result)

    frames = DOM.getElementsByTagName 'iframe'
    console.log frames.length
    for iframe in frames
      i = 0
      while i<window.frames.length
        if iframe.contentWindow == window.frames[i]
          console.log getFrameId(iframe, DOM)
          dictionary[getFrameId(iframe, DOM)] = i
          result = []
          break
        i++
    return dictionary
    
  ###!
  #get page doctype with all atributes'
  # @param {DocumentType} doctype - document doctype object
  # @return {array} - array with attributes of doctype page
  # @return null - if doctype is absent
  # @example ["html","w3c",""]
  ###
  getDoctype = (doctype)->
    if doctype?
      return [doctype.name, doctype.publicId, doctype.systemId]
    return null

  ###!
  #get attributes of tag <html ...>...</html>
  # @param {array} array - array with html attributes
  # @return {array} - array with attributes of tag <html>
  # @example ["lang","en","class","is-copy-enable"]
  ###
  getAttribute = (array)->
    mas = []
    for elem in array
      mas.push(elem.nodeName, elem.nodeValue)
    return mas

  # Function returns iframe url, content, html-atributes,
  # iframe-selectors and iframe-path
  return [
    document.URL,
    document.documentElement.innerHTML,
    getAttribute(document.documentElement.attributes),
    getFramePath(),
    getElementPath(document.documentElement),
    getDoctype(document.doctype)
  ]

###!
#convert html text of every frame to DOM-Tree
# @param {string} htmlText - string with html code
# @return {HTMLDocument} - created DOM with string
###
getDocument = (htmlText) ->
  _html = document.createElement 'html'
  html = document.createElement 'html'
  html.innerHTML = htmlText.substring(
    htmlText.indexOf("<body"),
    htmlText.length
  )
  attributesBody = html.getElementsByTagName('body')[0].attributes
  _html.innerHTML = "<head></head><body></body>"
  _html.getElementsByTagName('head')[0].innerHTML = htmlText.substring(
    htmlText.indexOf("<head"), htmlText.indexOf("/head>") + 6
  )
  _html.getElementsByTagName('body')[0].innerHTML = htmlText.substring(
    htmlText.indexOf("<body"), htmlText.length
  )
  body = _html.getElementsByTagName('body')[0]
  for attribute in attributesBody
    body.setAttribute attribute.name, attribute.value
  return _html

###!
#get frame position on background script
# @param {HTMLIframeElement} - iframe that we want find position,
# @param {HTMLDocument} - DOM that are parent of this iframe,
# @return {String} - string with iframe position
# @example [3,0,0]
###
getFramePosition = (obj, DOM) ->
  result = []
  _getPositionOfFrame = (obj)->
    if obj.parentElement == DOM
      return
    else
      parent = obj.parentElement
      nodeList = Array.prototype.slice.call(parent.children)
      index = nodeList.indexOf(obj)
      result.unshift(index)
      _getPositionOfFrame(parent)
  _getPositionOfFrame(obj)
  return JSON.stringify(result)

###!
#delete iframe security policy
# @param {HTMLDocument} - DOM object
###
deleteMeta = (document) ->
  metaElements = document.querySelectorAll('meta[http-equiv]')
  metaElements.forEach (element) ->
    if element.getAttribute('http-equiv') in META_ATTRIBS_FOR_DEL
      element.parentElement?.removeChild(element)

###!
#delete iframe security policy
# @param {HTMLDocument} - DOM object
###
deleteSendBoxAttrib = (document) ->
  iframes = document.querySelectorAll('iframe[sendbox]')
  iframes.forEach (iframe) ->
    iframe.removeAttribute('sendbox')

###!
#add tag meta, that this page is saved by PageCatch
# @param {HTMLDocument} - DOM of current document,
# @param {String} - string with url of current iframe,
###
addMeta = (DOM, url)->
  meta = document.createElement 'meta'
  meta.setAttribute 'name','original-url'
  meta.setAttribute 'content', url
  head = (
    DOM.getElementsByTagName('head')[0] ?
    DOM.getElementsByTagName('body')[0]
  )
  head.insertBefore meta, head.children[0]

###!
# run functions for delete security policy
# @param {HTMLDocument} - DOM of current document
# @param {String} - string with url of current iframe
###
defaultCleanUp = (document,url) ->
  deleteMeta(document)
  deleteSendBoxAttrib(document)
  addMeta(document,url)

###!
#take html attributes for save
# @param {array} array - array with attributes of tag <html>...</html>,
# @param {DocumentElement} status - Doctype of document,
# @return {String} - string with html code with all atributes + doctype
# @example "<! DOCTYPE html> <html lang="en" class="is-absent"><head>...</html>"
###
getAttribute = (array, status) ->
  src = "<html "
  for i in [0...array.length] by 2
    if array[i+1]?
      src += array[i] + '="' + array[i+1] + '" '
    else
      break
  #console.log status
  if status?
    doctype = getDoctype(status)
    #console.log doctype
    return doctype + src + ">"
  return src += ">"

###!
#take doctype with attributes for save
# @param {array} array - array with attributes of doctype,
# @return {String} - string with doctype of page
# @example "<!DOCTYPE html>"
###
getDoctype = (array) ->
  src = "<!DOCTYPE "
  elem = ""
  for i in [0...array.length]
    continue if not array[i].trim()
    switch i
      when 0 then src += array[i] + " "
      when 1 then src += "PUBLIC " + '"' + array[i] + '" '
      when 2 then src += '"' + array[i] + '"'
    #console.log src
  return src + ">"

###!
#save page
# @param {Number} tabID - number of tab which you want to save,
# @param {Function} cleanUp - function with clean any attributes from page,
# @param {Function} done - function in which will be return html text of saved page
# @example "<! DOCTYPE html> <html lang="en" class="is-absent"><head>...</html>"
###
getPage = (tabID, cleanUp, done) ->
  dictionary = {}
  flag = false
  
  ###!
  # parse tags as img,style,link and parse attribute style in any tags with him
  # @param {Function} callback - function that check completing of save
  ###
  parse = (callback) ->
    metas = dictionary[""]?.document.querySelectorAll '[name]'
    for meta in metas
      if meta.getAttribute('name') == 'original-url'
        flag = true
        callback 0, 0
        return
    attributeCounter = 0
    tagCounter = 0
    for key, dom of dictionary
      tagsStyles = dom.document.querySelectorAll '*[style]'
      for tag in tagsStyles
        attributeCounter++
        inlineCSS tag.getAttribute('style'), tag, dom.url,
          (error, tag, result) ->
            attributeCounter--
            if error?
              console.error "Style attr error", error
            else
              tag.setAttribute('style', result)
            callback tagCounter, attributeCounter
      tags = dom.document.querySelectorAll 'img,link,style'
      for tag in tags
        tagCounter++
        if(tag.hasAttribute('src'))
          src = convertURL tag.getAttribute('src'), dom.url
          xhrToBase64 src, tag, (error, tag, result) ->
            tagCounter--
            if error?
              console.error "(src)Base 64 error:", error.stack
            else
              tag.setAttribute "src", result
            callback tagCounter, attributeCounter
        else if(tag.hasAttribute('href'))
          if(tag.getAttribute('rel') == "stylesheet")
            href = convertURL(tag.getAttribute('href'), dom.url)
            inlineCSS getXHR(href), tag, href, (error, tag, result) ->
              if error?
                console.error "style error", error
              else
                tagCounter--
                style = document.createElement 'style'
                style.innerHTML = result
                parent = tag.parentElement
                tag.parentElement.insertBefore style, tag
                tag.parentElement.removeChild tag
              callback tagCounter, attributeCounter
          else
            href = convertURL(tag.getAttribute('href'), dom.url)
            xhrToBase64 href, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(href) xhrToBase64 error (href=#{href}):", error.stack
              else
                tag.setAttribute "href", result
              callback tagCounter, attributeCounter
        else
          inlineCSS tag.innerHTML, tag, dom.url, (error, tag, result) ->
            tagCounter--
            if error?
              console.error "(style)inlineCSS error:", error.stack
              console.error tag.innerHTML
            else
              tag.innerHTML = result
            callback tagCounter, attributeCounter
    flag = true
  ###!
  # create one object from dictionary of frames
  # @param {Object} obj - obj of dictionary(any frame from page)
  # @param {String} str - string with current index in recursive
  ###
  createNewObj = (obj, str) ->
    frames = obj.document.getElementsByTagName 'iframe'
    for frame in frames
      selector = getFramePosition(frame, obj.document)
      #console.log selector
      index = -1
      for key of obj.framesIdx
        #console.log key
        if selector == key
          index= obj.framesIdx[key]
      if index == -1
        continue
      key = str + index
      if dictionary[key]?
        createNewObj dictionary[key], key+":"
        _url = dictionary[key].url
        _document = dictionary[key].document
        defaultCleanUp _document, _url
        cleanUp?(_document, _url)
        source = getAttribute(
          dictionary[key].header,
          dictionary[key].doctype
        ) + _document.innerHTML + "</html>"
        frame.setAttribute('srcdoc', source)

  ###!
  # finish and return string with complete all resourses in one HTML
  # @param {Number} counter - counter of tags
  # @param {Number} counter1 - counter of attributes
  ###
  finalize = (counter, counter1) ->
    if counter == 0 and counter1 == 0 and flag == true
      createNewObj dictionary[""],""
      _url = dictionary[""].url
      _document = dictionary[""].document
      defaultCleanUp _document, _url
      cleanUp?(_document, _url)
      result = getAttribute(
        dictionary[""].header, dictionary[""].doctype
      ) + _document.innerHTML + "</html>"
      done?(result)
      dictionary = {}
      flag = false


  #START
  chrome.tabs.executeScript tabID,
    code: "(" + getSource.toString() + ")()" # transform function to the
                                             # string and wrap it into the
                                             # closure to execute it
                                             # immidiatelly after
                                             # injecting
    allFrames: true,
    matchAboutBlank: true
  , (arrays) ->
    for dom in arrays
      obj =
        url: dom[0]
        header: dom[2]
        document: getDocument(dom[1])
        framesIdx: dom[4]
        doctype: dom[5]
      dictionary[dom[3]] = obj
    parse(finalize)

module.exports = getPage