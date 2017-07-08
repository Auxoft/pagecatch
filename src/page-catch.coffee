xhrToBase64 = require './modules/xhr-to-base64.coffee'
convertURL = require './modules/get-relative-link.coffee'
getXHR = require './modules/xhr.coffee'
inlineCSS = require './modules/inline-css.coffee'


badLinksRel = [
  'dns-prefetch', 'canonical','publisher',
  'prefetch', ' alternate', 'bb:rum'
]
META_ATTRIBS_FOR_DEL = [
  'Content-Security-Policy'
  'refresh'
]

class TreeElementNotFound extends Error


# get array with information of every frame
getSource = () ->
  linksObj = {}
  stylesheetsArray = []


  createSelector = (obj)->
    selector = []
    while (obj && obj.nodeName != 'HTML')
      parent = obj.parentElement
      if (parent)
        for child,i in parent.children
          if (parent.children[i] == obj)
            selector.unshift(i)
            break
      obj = parent
    selector = selector.join(':')

    return selector


  getCssRulesForTagStyle = (stylesheets) ->
    for style in stylesheets
      str = ""
      if style.rules
        for rule in style.rules
          str+= rule.cssText
        stylesheetsArray.push [str,createSelector(style.ownerNode)]
    # console.log stylesheetsArray
  getCssRulesForTagStyle(document.styleSheets)


  getUrlMas = (styleObj) ->
    for elem in styleObj
      startIndex = styleObj[elem].indexOf('url(')
      while startIndex > -1
        endIndex = styleObj[elem].indexOf(')', startIndex + 1)
        key = styleObj[elem].substring(startIndex + 4, endIndex)
        # console.log "URL::", key
        if key.startsWith('"') or key.startsWith("'")
          key = key.substring(1, key.length - 1)
        if not key.startsWith('#')
          linksObj[key] = true
          # console.assert linksObj[key]
          # console.log 'ELEM', key
        startIndex = styleObj[elem].indexOf('url(', endIndex + 1)

  passOnTree = (elem) ->
    children = elem.children
    for child in children
      passOnTree(child)
    getUrlMas(window.getComputedStyle(elem))
    getUrlMas(window.getComputedStyle(elem, ':after'))
    getUrlMas(window.getComputedStyle(elem, ':before'))

  passOnTree(document.body)

  ###!
  # get frame index in the page
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
  # @return {Object} - frames position on the current frame
  # @example [3,0,0]: 0
  ###
  getElementPath = (DOM) ->
    dictionary = {}

    ###!
    # get frameID
    # @param {HTMLIframeElement} obj - iframe document object
    # @return {String} - string with the iframe index
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
      #console.log result
      return JSON.stringify(result)

    frames = DOM.getElementsByTagName 'iframe'
    #console.log frames.length
    for iframe in frames
      i = 0
      while i<window.frames.length
        if iframe.contentWindow == window.frames[i]
          #console.log getFrameId(iframe, DOM)
          dictionary[getFrameId(iframe, DOM)] = i
          result = []
          break
        i++
    return dictionary

  ###!
  # get page doctype with all atributes'
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
  # get attributes of tag <html ...>...</html>
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
    [document.URL, document.location.protocol],
    [document.head.innerHTML, document.body.outerHTML],
    getAttribute(document.documentElement.attributes),
    getFramePath(),
    getElementPath(document.documentElement),
    getDoctype(document.doctype),
    linksObj,
    stylesheetsArray
  ]

deleteIframesFromHead = (head) ->
  frames = head.querySelectorAll('iframe')
  for i in [0...frames.length]
    frames[i].parentElement.removeChild(frames[i])
    i--
  return head
###!
# convert html text of every frame to DOM-Tree
# @param {string} head - string with html code of head
# @param {string} body - string with html code of body
# @return {HTMLDocument} - created DOM with string
###

getDocument = (head, body) ->
  html = document.implementation.createHTMLDocument()
  html.head.innerHTML = head
  html.head = deleteIframesFromHead(html.head)
  html.body.outerHTML = body
  html.getElementsByTagName('head')[1].parentElement.removeChild(
    html.getElementsByTagName('head')[1]
  )
  return html

# getDocument = (htmlText) ->
#   _html = document.implementation.createHTMLDocument()
#   regExp = \
#     /(?:<!--[\s\S]*?-->|\s)*(<head[\s\S]*?>[\s\S]*?<\/head>)([\s\S]*)$/mi
#   headRE = /<head(?:[\s\S]*?)>([\s\S]*?)<\/head>/
#   bodyRE = /<body(?:[\s\S]*?)>([\s\S]*?)<\/body>/
#   htmlObject = regExp.exec(htmlText)
#   head = htmlObject[1]
#   body = htmlObject[2]
#   tempDoc = document.createElement('html')
#   tempDoc.innerHTML = head+body
#   # console.log tempDoc
#   attributesBody = tempDoc.getElementsByTagName('body')[0].attributes
#   attributesHead = tempDoc.getElementsByTagName('head')[0].attributes
#   if htmlObject?
#     _html.head.innerHTML = headRE.exec(head)[1]
#     _html.head = deleteIframesFromHead(_html.head)
#     #console.log(_html)
#     _html.body.innerHTML = bodyRE.exec(body)[1]
#     for attribute in attributesBody
#       _html.body.setAttribute attribute.name, attribute.value
#     for attribute in attributesHead
#       _html.head.setAttribute attribute.name, attribute.value
#   #console.log _html.styleSheets
#   #console.log _html
#   return _html

###!
# get frame position on the background script
# @param {HTMLIframeElement} - iframe that we want find position,
# @param {HTMLDocument} - DOM that are parent of this iframe,
# @return {String} - string with iframe position
# @example [3,0,0]
###
getFramePosition = (obj, DOM) ->
  result = []
  _getPositionOfFrame = (obj)->
    if obj.parentElement == DOM.documentElement
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
# delete iframe security policy
# @param {HTMLDocument} - DOM object
###
deleteMeta = (document) ->
  metaElements = document.querySelectorAll('meta[http-equiv]')
  metaElements.forEach (element) ->
    if element.getAttribute('http-equiv') in META_ATTRIBS_FOR_DEL
      element.parentElement?.removeChild(element)

###!
# delete iframe security policy
# @param {HTMLDocument} - DOM object
###
deleteSendBoxAttrib = (document) ->
  iframes = document.querySelectorAll('iframe[sendbox]')
  iframes.forEach (iframe) ->
    iframe.removeAttribute('sendbox')

###!
# add meta tag informing that this page is saved by PageCatch
# @param {HTMLDocument} - DOM of current document,
# @param {String} - string with url of current iframe,
# NOTE: if original-url meta alread exists (with original site url), do
# not create a new one. It means, that we resave already stored page
###
addMeta = (DOM, url)->
  if not DOM.querySelector('meta[name="original-url"]')
    meta = document.createElement 'meta'
    meta.setAttribute 'name','original-url'
    meta.setAttribute 'content', url
    head = (
      DOM.getElementsByTagName('head')[0] ?
      DOM.getElementsByTagName('body')[0]
    )
    head.insertBefore meta, head.children[0]


decode = (text) ->
  if (
    text.indexOf('&amp;') >=0 or
    text.indexOf('&quot;')>=0 or
    text.indexOf('&gt;')>=0 or
    text.indexOf('&lt;')>=0
  )
    text = text.replace(/\&amp\;/g, '&')
    text = text.replace(/\&quot\;/g, '"')
    text = text.replace(/\&lt\;/g, '<')
    text = text.replace(/\&gt\;/g, '>')
    text = decode(text)
    decode(text)
  return text


decodeNoScript = (document)->
  noscripts = document.getElementsByTagName('noscript')
  for script in noscripts
    script.outerHTML = decode(script.outerHTML)
  return document


###!
# run functions for delete security policy
# @param {HTMLDocument} - DOM of current document
# @param {String} - string with url of current iframe
###
defaultCleanUp = (document,url) ->
  decodeNoScript(document)
  deleteMeta(document)
  deleteSendBoxAttrib(document)
  addMeta(document,url)


###!
# take html attributes for save
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
# take doctype with attributes for save
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


deleteElemsFromHead = (obj)->
  elems = obj.querySelectorAll('div,img')
  for elem in elems
    elem.parentElement.removeChild(elem)
  return document


createSelector = (obj)->
  selector = []
  while (obj && obj.nodeName != 'HTML')
    parent = obj.parentElement
    if (parent)
      for child,i in parent.children
        if (parent.children[i] == obj)
          selector.unshift(i)
          break
    obj = parent
  selector = selector.join(':')

  return selector


###!
# save page
# @param {Number} tabID - number of tab which you want to save,
# @param {Function} cleanUp - function with clean any attributes from page,
# @param {Function} done - function in which will be return html text of
#                          saved page
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
        callback 0,0,0
        return
    faviconLinks = []
    links = dictionary[""]?.document.querySelectorAll 'link'
    iconFlag = false
    iconCounter = 0
    for link in links
      rel = link.getAttribute('rel')
      if rel != null and rel.indexOf('icon') != -1
        if rel == 'icon'
          iconFlag = true
        faviconLinks.push(link)
    if not iconFlag
      url = dictionary[""]?.url[0]
      urlMas = url.split('/')
      urlMas = urlMas.slice(0,3)
      url = urlMas.join('/') + '/favicon.ico'
      link = document.createElement 'link'
      link.setAttribute 'rel','icon'
      iconCounter = 1
      xhrToBase64 url, link, (error, tag, result) ->
        if error?
          iconCounter--
          console.error "(src)Base 64 error:", error.stack
        else
          if result == ""
            iconCounter++
            if (faviconLinks.length != 0)
              href = faviconLinks[0].getAttribute('href')
            else
              iconCounter--
            callback tagCounter, attributeCounter, iconCounter
            xhrToBase64 href, tag, (error, tag, result) ->
              if error?
                iconCounter--
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "href", result
                dictionary[""].document.head.appendChild(tag)
                iconCounter--
              callback tagCounter, attributeCounter, iconCounter
          else
            tag.setAttribute "href", result
            dictionary[""].document.head.appendChild(tag)
            iconCounter--
          callback tagCounter, attributeCounter, iconCounter

    attributeCounter = 0
    tagCounter = 0
    for key, dom of dictionary
      dom.document.head = deleteElemsFromHead(dom.document.head)
      # console.log dom.document
      styleTags = dom.document.querySelectorAll 'style'
      for style in styleTags
        if style.innerHTML.length == 0
          selector = createSelector(style)
          for _style in dom.styleSheets
            if _style[1] == selector
              style.innerHTML = _style[0]
              break
      tagsStyles = dom.document.querySelectorAll '*[style]'
      for tag in tagsStyles
        attributeCounter++
        inlineCSS tag.getAttribute('style'), tag, dom.url[0], dom, [],
          (error, tag, dom, result) ->
            attributeCounter--
            if error?
              console.error "Style attr error", error
            else
              tag.setAttribute('style', result)
            callback tagCounter, attributeCounter, iconCounter
      tags = dom.document.querySelectorAll 'img,link,source,style, object'
      for tag in tags
        tagCounter++
        if tag.nodeName == 'LINK'
          if (
            tag.getAttribute('rel') in ["stylesheet", "prefetch stylesheet"]
            )
              href = convertURL tag.getAttribute('href'), dom.url[0], dom.url[1]
              attributes = tag.attributes
              #console.log "INLINECSSS_START",tag
              inlineCSS getXHR(href), tag, href, dom, attributes,
                (error, tag, dom, result,attributes) ->
                  tagCounter--
                  if error?
                    console.error "style error", error
                  else
                    console.log 'INLINECSSS_END', tag
                    style = document.createElement 'style'
                    #console.log result1
                    #console.log 'RESULT2', result2
                    style.innerHTML = result
                    for attribute in attributes
                      style.setAttribute attribute.name, attribute.value
                    parent = tag.parentElement
                    parent.insertBefore style, tag
                    parent.removeChild tag
                  callback tagCounter, attributeCounter, iconCounter
              continue
            else if tag.getAttribute('rel') in badLinksRel
              tag.parentElement.removeChild(tag)
              tagCounter--
              continue
            else
              href = convertURL tag.getAttribute('href'), dom.url[0], dom.url[1]
              xhrToBase64 href, tag, (error, tag, result) ->
                tagCounter--
                if error?
                  console.error "(href) xhrToBase64 error (href=#{href}):", \
                    error.stack
                else
                  tag.setAttribute "href", result
                callback tagCounter, attributeCounter, iconCounter
              continue
        if tag.nodeName == 'IMG'
          if tag.hasAttribute('srcset') and not tag.hasAttribute('src')
            src = convertURL tag.getAttribute('srcset'), dom.url[0], dom.url[1]
            xhrToBase64 src, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "srcset", result
              callback tagCounter, attributeCounter, iconCounter
            continue
          else if (tag.hasAttribute('src') and not tag.hasAttribute('srcset'))
            src = convertURL tag.getAttribute('src'), dom.url[0], dom.url[1]
            xhrToBase64 src, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "src", result
              callback tagCounter, attributeCounter, iconCounter
            continue
          else if tag.hasAttribute('src') and tag.hasAttribute('srcset')
            tag.setAttribute('srcset',"")
            src = convertURL tag.getAttribute('src'), dom.url[0], dom.url[1]
            xhrToBase64 src, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "src", result
              callback tagCounter, attributeCounter, iconCounter
            continue
          else
            tagCounter--
            continue
        if tag.nodeName == 'OBJECT'
          if tag.hasAttribute('data')
            src = convertURL tag.getAttribute('data'), dom.url[0], dom.url[1]
            xhrToBase64 src, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "srcset", result
              callback tagCounter, attributeCounter, iconCounter
            continue
          else
            tagCounter--
            continue
        if tag.nodeName == 'STYLE'
          inlineCSS tag.innerHTML, tag, dom.url[0], dom, [],
            (error, tag, dom, result) ->
              #console.log "INLINECSSS_END", tag
              tagCounter--
              if error?
                console.error "(style)inlineCSS error:", error.stack
                # console.error tag.innerHTML
              else
                tag.innerHTML = result
              callback tagCounter, attributeCounter, iconCounter
          continue
        if tag.nodeName == 'SOURCE'
          if tag.type.indexOf('video') > -1 || tag.type.indexOf('audio') > -1
            tagCounter--
            continue
          else if tag.hasAttribute('srcset') and not tag.hasAttribute('src')
            src = convertURL tag.getAttribute('srcset'), dom.url[0], dom.url[1]
            xhrToBase64 src, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "srcset", result
              callback tagCounter, attributeCounter, iconCounter
            continue
          else if (tag.hasAttribute('src') and not tag.hasAttribute('srcset'))
            src = convertURL tag.getAttribute('src'), dom.url[0], dom.url[1]
            xhrToBase64 src, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "src", result
              callback tagCounter, attributeCounter, iconCounter
            continue
          else if tag.hasAttribute('src') and tag.hasAttribute('srcset')
            tag.setAttribute('srcset',"")
            src = convertURL tag.getAttribute('src'), dom.url[0], dom.url[1]
            xhrToBase64 src, tag, (error, tag, result) ->
              tagCounter--
              if error?
                console.error "(src)Base 64 error:", error.stack
              else
                tag.setAttribute "src", result
              callback tagCounter, attributeCounter, iconCounter
            continue
          else
            tagCounter--
            continue
        else
          tagCounter--
          continue
    flag = true
    callback tagCounter, attributeCounter, iconCounter


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

      continue if index == -1

      key = str + index
      if dictionary[key]?
        createNewObj(dictionary[key], key+":")
        _url = dictionary[key].url
        _document = dictionary[key].document
        defaultCleanUp(_document, _url[0])
        cleanUp?(_document, _url[0])
        source = getAttribute(
          dictionary[key].header,
          dictionary[key].doctype
        ) + _document.documentElement.innerHTML + "</html>"
        #console.log source
        frame.setAttribute('srcdoc', source)


  scriptForAddHash = (hashURL)->
    window.location.hash = hashURL.split('#')[1]


  ###!
  # finish and return string with complete all resourses in one HTML
  # @param {Number} counter - counter of tags
  # @param {Number} counter1 - counter of attributes
  ###
  finalize = (counter, counter1, counter2) ->
    console.log(
      "counter=", counter,
      'counter1=', counter1,
      'counter2=', counter2,
      'flag=', flag
    )
    if counter == 0 and counter1 == 0 and counter2 == 0 and flag == true
      createNewObj dictionary[""],""
      _url = dictionary[""].url
      _document = dictionary[""].document
      defaultCleanUp _document, _url[0]
      cleanUp?(_document, _url)
      hashURL = dictionary[""].url[0]
      if hashURL.indexOf('#') != -1
        script = document.createElement('script')
        script.innerHTML = 'window.location.hash =' + \
          '"' + hashURL.split('#')[1] + '"'
        _document.head.insertBefore(script, _document.head.children[1])
      result = getAttribute(
        dictionary[""].header, dictionary[""].doctype
      ) + _document.documentElement.innerHTML + "</html>"
      done?(result)
      dictionary = {}
      flag = false


  # START
  chrome.tabs.executeScript tabID,
    code: "(" + getSource.toString() + ")()" # transform function to the
                                             # string and wrap it into the
                                             # closure to execute it
                                             # immidiatelly after
                                             # injecting
    allFrames: true,
    matchAboutBlank: true
  , (arrays) ->
    #console.log arrays
    for dom in arrays
      obj =
        url: dom[0]
        header: dom[2]
        document: getDocument(dom[1][0],dom[1][1])
        framesIdx: dom[4]
        doctype: dom[5]
        actualUrls: dom[6]
        styleSheets: dom[7]
      dictionary[dom[3]] = obj
      #console.log dom[6]
    parse(finalize)

module.exports = getPage
