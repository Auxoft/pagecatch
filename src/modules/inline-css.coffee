convertURL = require '../modules/get-relative-link.coffee'
convertToBase64 = require '../modules/xhr-to-base64.coffee'


module.exports = (src, dom, source, actualUrls, callback) ->
  flag = false
  if(src.indexOf("url(") < 0)
    callback null, dom, src
  else
    #console.log "inline-css:", src, dom
    urlMas = []
    elemMas = []
    convMas = []
    lastIndex = 0
    regExp =  /([\s\S]*?url\()\s*(['"]?)([\s\S]*?)\2\s*(\))/gmi
    while (obj = regExp.exec(src))?
      elemMas.push obj[1], obj[4]
      urlMas.push convertURL obj[3], source
      lastIndex = regExp.lastIndex
    elemMas.push src[lastIndex..]
    #console.log "MASIVE", elemMas
    counter = 0
    for i in [0...urlMas.length]
      if actualUrls[urlMas[i]]
        flag = true
        actualUrls[urlMas[i]]
        counter++
        console.log 'COUNTER++',counter
        convertToBase64 urlMas[i], dom, (error, obj, result, url) ->
          counter--
          console.log counter
          if error?
            console.error "Error base64:", error.stack
          else
            actualUrls[url] = result
          if counter == 0
            console.log actualUrls
            src = []
            index = 0
            urlIndex = 0
            while index < elemMas.length
              src.push elemMas[index]
              index++
              if urlMas[urlIndex]?
                if actualUrls[urlMas[urlIndex]]
                  console.log 'URL', actualUrls[urlMas[urlIndex]]
                  src.push '"'+actualUrls[urlMas[urlIndex]]+'"'
                else
                  src.push ""
              if(elemMas[index]?)
                console.log "SECOND_ELEM", elemMas[index]
                src.push(elemMas[index])
              index++
              urlIndex++
            callback null, dom, src.join("")
    if !flag
      callback null, dom, elemMas.join('')

