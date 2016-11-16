module.exports = (url) ->
  try
    #console.log "xhr: Url ='#{url}'"
    xhr = new XMLHttpRequest()
    xhr.open 'GET', url, false
    xhr.send()
    if xhr.status ==200
      return xhr.responseText
    else
      return " "
  catch e
    console.error "XHR", e.stack
    return " "
