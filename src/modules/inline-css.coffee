convertURL = require '../modules/get-relative-link.coffee'
convertToBase64 = require '../modules/xhr-to-base64.coffee'
getXHR = require '../modules/xhr.coffee'


getCounter = (urlMas, actualUrls) ->
  counter = 0
  for i in [0...urlMas.length]
    if actualUrls[urlMas[i]]
      counter++
  return counter


addNewActualUrls = (htmlText, actualUrls, source) ->
  re = /@font-face\s*\{[\s\S]*?src\s*:\s*(?:url\(\s*(['"])?([\s\S]*?)\1\s*\))+[\s\S]*?.*?\}/g
  re1 = /url\(\s*(['"])?([\s\S]*?)\1\s*\)/g
  while (obj = re.exec(htmlText))?
    while (url = re1.exec(obj[0]))?
      actualUrls[convertURL(url[2], source)] = true
  return actualUrls

module.exports = (src, element, source, dom, callback) ->
  flag = false
  if src.indexOf("@import") > -1
    re_1 = /@import\s+url\(((['"])?[\s\S]*?\1)\)\;/gmi
    re_2 = /@import\s+(['"]?[\s\S]*?\1)\;/gmi
    src = src.replace(re_2, (str) ->
      re_1 = /@import\s+url\(((['"])?[\s\S]*?\1)\)\;/gmi
      re_2 = /@import\s+(['"]?[\s\S]*?\1)\;/gmi
      if(str.indexOf('url') > -1)
        temp = re_1.exec(str)
        return getXHR(convertURL(temp[1], source))
      else
        temp = re_2.exec(str)
        return getXHR(convertURL(temp[1], source))
    )
  if(src.indexOf("url(") < 0)
    callback null, element, dom.document, src
  else
    #console.log "inline-css:", src, element
    urlMas = []
    elemMas = []
    convMas = []
    lastIndex = 0
    regExp =  /([\s\S]*?url\()\s*(['"]?)([\s\S]*?)\2\s*(\))/gmi
    obj = regExp.exec(src)
    while obj?
      elemMas.push obj[1], obj[4]
      urlMas.push convertURL obj[3], source
      lastIndex = regExp.lastIndex
      if src.indexOf('url(',lastIndex+1) > -1
        obj = regExp.exec(src)
      else
        elemMas.push src[lastIndex..]
        lastIndex = src.length
        break
    elemMas.push src[lastIndex..]
    dom.actualUrls = addNewActualUrls(src,dom.actualUrls, source)
    console.log "MASIVE", urlMas, dom.actualUrls
    counter = getCounter(urlMas, dom.actualUrls)
    for i in [0...urlMas.length]
      if dom.actualUrls[urlMas[i]]
        flag = true
        dom.actualUrls[urlMas[i]]
        console.log 'COUNTER++',counter
        convertToBase64 urlMas[i], element, (error, obj, result, url) ->
          counter--
          console.log counter
          if error?
            console.error "Error base64:", error.stack
          else
            dom.actualUrls[url] = result
          if counter == 0
            console.log dom.actualUrls
            src = []
            index = 0
            urlIndex = 0
            while index < elemMas.length
              src.push elemMas[index]
              index++
              if urlMas[urlIndex]?
                if dom.actualUrls[urlMas[urlIndex]] or urlMas[urlIndex].startsWith('data:')
                  #console.log 'URL', dom.actualUrls[urlMas[urlIndex]]
                  if urlMas[urlIndex].startsWith('data:')
                    src.push '"' + urlMas[urlIndex] + '"'
                  else
                    src.push '"'+ dom.actualUrls[urlMas[urlIndex]] + '"'
                else
                  src.push ""
              if(elemMas[index]?)
                #console.log "SECOND_ELEM", elemMas[index]
                src.push(elemMas[index])
              index++
              urlIndex++
            callback null, element, dom.document, src.join("")
    if !flag
      callback null, element, dom.document, elemMas.join('')

