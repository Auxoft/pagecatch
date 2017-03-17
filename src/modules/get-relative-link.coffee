module.exports = (url, main,protocol) ->
  flag = false
  if (
    (url[0] == '"' and url[url.length - 1] == '"') or
    (url[0] == "'" and url[url.length - 1] == "'")
  )
    url = url.substr 1, url.length - 2
  if url.startsWith('data:')
    #console.log "DATA", url
    return url
  url = url.replace(/\s/g, '')
  #console.warn "URL: ", url
  #console.warn "MAIN: ", main
  main = main.split('#')[0]

  if url.startsWith('//')
    return protocol + url

  if url.match(/^[\w\-_\d]+:/)
    return url

  if url[0] == '/' and url[1] != '/'
    flag = true
    mainURLS = main.split('/')
    mainURLS = mainURLS.slice(0, 3)
    main = mainURLS.join('/')
    #console.log main+url
    return main+url
  mainURLS = main.split('/')
  #console.log main
  #console.log mainURLS
  #console.log mainURLS[mainURLS.length-1].indexOf('.')
  if '.' in mainURLS[mainURLS.length-1] and not flag
    mainURLS.pop()
  mainURLS.pop() if mainURLS[mainURLS.length-1] == ""
    #console.log(mainURLS)
  indexURLS = url.split('/')
  #console.log(mainURLS)
  #console.log indexURLS
  for indexURL in indexURLS
    if indexURL == '..'
      mainURLS.pop()
    else if indexURL == '.'
      continue
    else
      mainURLS.push(indexURL)
  #console.log "LASTURL", mainURLS.join('/')
  return mainURLS.join('/')