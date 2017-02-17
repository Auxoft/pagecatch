module.exports = (url, main) ->
  flag = false
  url = url.replace(/\s/g, '')
  #console.warn "URL: ", url
  #console.warn "MAIN: ", main
  if (
    (url[0] == '"' and url[url.length - 1] == '"') or
    (url[0] == "'" and url[url.length - 1] == "'")
  )
    url= url.substr 1, url.length - 2

  if url.startsWith('data:')
    #console.log "DATA", url
    return url

  if url.startsWith('//')
    return "https:" + url

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
    #console.log(mainURLS)
  indexURLS = url.split('/')
  #console.log(mainURLS)
  #console.log indexURLS
  for indexURL in indexURLS
    if indexURL == '..'
      mainURLS.pop()
    else
      mainURLS.push(indexURL)
  #console.log "LASTURL", mainURLS.join('/')
  return mainURLS.join('/')
