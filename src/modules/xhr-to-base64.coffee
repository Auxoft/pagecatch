xhrToBase64 = (url, elem, callback) ->
  if(url.indexOf("data:") >= 0)
    callback null, elem, url
  else
    #console.log "xhr-to-base64: Url='#{url}'"
    xhr = new XMLHttpRequest()
    xhr.open 'GET', url, true
    xhr.responseType = 'blob'
    reader = new FileReader()

    xhr.onload = (e) ->
      #console.log "xhr-to-base64: XHR LOAD"
      if this.status != 200
        callback null, elem, " ", url
      else
        blob = this.response
        reader.onloadend = () ->
          callback null, elem, reader.result, url
        reader.readAsDataURL(blob)

    xhr.onerror = (e) ->
      console.error "XHR Error " + \
        e.target.status + \
        " occurred while receiving the document."
      callback e, elem, " ",url

    xhr.send()

module.exports = xhrToBase64
