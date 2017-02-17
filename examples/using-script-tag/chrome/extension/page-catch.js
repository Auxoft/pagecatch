var getPage =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var META_ATTRIBS_FOR_DEL, TreeElementNotFound, addMeta, convertURL, defaultCleanUp, deleteMeta, deleteSendBoxAttrib, getAttribute, getDoctype, getDocument, getFramePosition, getPage, getSource, getXHR, inlineCSS, xhrToBase64,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	xhrToBase64 = __webpack_require__(1);
	
	convertURL = __webpack_require__(2);
	
	getXHR = __webpack_require__(3);
	
	inlineCSS = __webpack_require__(4);
	
	META_ATTRIBS_FOR_DEL = ['Content-Security-Policy', 'refresh'];
	
	TreeElementNotFound = (function(superClass) {
	  extend(TreeElementNotFound, superClass);
	
	  function TreeElementNotFound() {
	    return TreeElementNotFound.__super__.constructor.apply(this, arguments);
	  }
	
	  return TreeElementNotFound;
	
	})(Error);
	
	getSource = function() {
	  var getAttribute, getDoctype, getElementPath, getFramePath, getUrlMas, linksObj;
	  linksObj = {};
	  getUrlMas = function(elem) {
	    var child, children, endIndex, j, k, key, len, len1, obj, results, startIndex;
	    children = elem.children;
	    for (j = 0, len = children.length; j < len; j++) {
	      child = children[j];
	      getUrlMas(child);
	    }
	    obj = window.getComputedStyle(elem);
	    console.log(elem);
	    results = [];
	    for (k = 0, len1 = obj.length; k < len1; k++) {
	      elem = obj[k];
	      startIndex = obj[elem].indexOf('url(');
	      results.push((function() {
	        var results1;
	        results1 = [];
	        while (startIndex > -1) {
	          endIndex = obj[elem].indexOf(')', startIndex + 1);
	          key = obj[elem].substring(startIndex + 4, endIndex);
	          if (key.startsWith('"') || key.startsWith("'")) {
	            key = key.substring(1, key.length - 1);
	          }
	          linksObj[key] = true;
	          console.assert(linksObj[key]);
	          console.log('ELEM', key);
	          results1.push(startIndex = obj[elem].indexOf('url(', endIndex + 1));
	        }
	        return results1;
	      })());
	    }
	    return results;
	  };
	  getUrlMas(document.body);
	
	  /*!
	   * get frame index in page
	   * @return {String} - frame index
	   * @example 0:3:5
	   */
	  getFramePath = function() {
	    var _get_frame_id, fid;
	    fid = [];
	
	    /*!
	     * add frame-ID into fid[] array (recursive)
	     * @param {Window} win - parent's Window object
	     */
	    _get_frame_id = function(win) {
	      var frame, frame_idx, idx, j, len, parent, ref;
	      parent = win.parent;
	      if (win === parent) {
	        return;
	      }
	      idx = '?';
	      ref = parent.frames;
	      for (frame_idx = j = 0, len = ref.length; j < len; frame_idx = ++j) {
	        frame = ref[frame_idx];
	        if (win === frame) {
	          idx = frame_idx;
	          break;
	        }
	      }
	      fid.unshift(idx);
	      _get_frame_id(parent);
	    };
	    _get_frame_id(window);
	    return fid.join(':');
	  };
	
	  /*!
	   * get frame position on content script
	   * @param {HTMLDocument} DOM - DOM document object
	   * @return {Object} - frames position on current frame
	   * @example [3,0,0]: 0
	   */
	  getElementPath = function(DOM) {
	    var dictionary, frames, getFrameId, i, iframe, j, len, result;
	    dictionary = {};
	
	    /*!
	     * get frameID
	     * @param {HTMLIframeElement} obj - iframe document object
	     * @return {String} - string with index iframe
	     * @example [3,0,0]
	     */
	    getFrameId = function(obj) {
	      var _getPositionOfFrame, result;
	      result = [];
	      _getPositionOfFrame = function(obj) {
	        var index, nodeList, parent;
	        if (obj.parentElement === DOM) {
	
	        } else {
	          parent = obj.parentElement;
	          nodeList = Array.prototype.slice.call(parent.children);
	          index = nodeList.indexOf(obj);
	          result.unshift(index);
	          return _getPositionOfFrame(parent);
	        }
	      };
	      _getPositionOfFrame(obj);
	      return JSON.stringify(result);
	    };
	    frames = DOM.getElementsByTagName('iframe');
	    for (j = 0, len = frames.length; j < len; j++) {
	      iframe = frames[j];
	      i = 0;
	      while (i < window.frames.length) {
	        if (iframe.contentWindow === window.frames[i]) {
	          dictionary[getFrameId(iframe, DOM)] = i;
	          result = [];
	          break;
	        }
	        i++;
	      }
	    }
	    return dictionary;
	  };
	
	  /*!
	   * get page doctype with all atributes'
	   * @param {DocumentType} doctype - document doctype object
	   * @return {array} - array with attributes of doctype page
	   * @return null - if doctype is absent
	   * @example ["html","w3c",""]
	   */
	  getDoctype = function(doctype) {
	    if (doctype != null) {
	      return [doctype.name, doctype.publicId, doctype.systemId];
	    }
	    return null;
	  };
	
	  /*!
	   * get attributes of tag <html ...>...</html>
	   * @param {array} array - array with html attributes
	   * @return {array} - array with attributes of tag <html>
	   * @example ["lang","en","class","is-copy-enable"]
	   */
	  getAttribute = function(array) {
	    var elem, j, len, mas;
	    mas = [];
	    for (j = 0, len = array.length; j < len; j++) {
	      elem = array[j];
	      mas.push(elem.nodeName, elem.nodeValue);
	    }
	    return mas;
	  };
	  return [document.URL, document.documentElement.innerHTML, getAttribute(document.documentElement.attributes), getFramePath(), getElementPath(document.documentElement), getDoctype(document.doctype), linksObj];
	};
	
	
	/*!
	 * convert html text of every frame to DOM-Tree
	 * @param {string} htmlText - string with html code
	 * @return {HTMLDocument} - created DOM with string
	 */
	
	getDocument = function(htmlText) {
	  var _html, attribute, attributesBody, body, html, j, len;
	  _html = document.createElement('html');
	  html = document.createElement('html');
	  html.innerHTML = htmlText.substring(htmlText.indexOf("<body"), htmlText.length);
	  attributesBody = html.getElementsByTagName('body')[0].attributes;
	  _html.innerHTML = "<head></head><body></body>";
	  _html.getElementsByTagName('head')[0].innerHTML = htmlText.substring(htmlText.indexOf("<head"), htmlText.indexOf("/head>") + 6);
	  _html.getElementsByTagName('body')[0].innerHTML = htmlText.substring(htmlText.indexOf("<body"), htmlText.length);
	  body = _html.getElementsByTagName('body')[0];
	  for (j = 0, len = attributesBody.length; j < len; j++) {
	    attribute = attributesBody[j];
	    body.setAttribute(attribute.name, attribute.value);
	  }
	  return _html;
	};
	
	
	/*!
	 * get frame position on background script
	 * @param {HTMLIframeElement} - iframe that we want find position,
	 * @param {HTMLDocument} - DOM that are parent of this iframe,
	 * @return {String} - string with iframe position
	 * @example [3,0,0]
	 */
	
	getFramePosition = function(obj, DOM) {
	  var _getPositionOfFrame, result;
	  result = [];
	  _getPositionOfFrame = function(obj) {
	    var index, nodeList, parent;
	    if (obj.parentElement === DOM) {
	
	    } else {
	      parent = obj.parentElement;
	      nodeList = Array.prototype.slice.call(parent.children);
	      index = nodeList.indexOf(obj);
	      result.unshift(index);
	      return _getPositionOfFrame(parent);
	    }
	  };
	  _getPositionOfFrame(obj);
	  return JSON.stringify(result);
	};
	
	
	/*!
	 * delete iframe security policy
	 * @param {HTMLDocument} - DOM object
	 */
	
	deleteMeta = function(document) {
	  var metaElements;
	  metaElements = document.querySelectorAll('meta[http-equiv]');
	  return metaElements.forEach(function(element) {
	    var ref, ref1;
	    if (ref = element.getAttribute('http-equiv'), indexOf.call(META_ATTRIBS_FOR_DEL, ref) >= 0) {
	      return (ref1 = element.parentElement) != null ? ref1.removeChild(element) : void 0;
	    }
	  });
	};
	
	
	/*!
	 * delete iframe security policy
	 * @param {HTMLDocument} - DOM object
	 */
	
	deleteSendBoxAttrib = function(document) {
	  var iframes;
	  iframes = document.querySelectorAll('iframe[sendbox]');
	  return iframes.forEach(function(iframe) {
	    return iframe.removeAttribute('sendbox');
	  });
	};
	
	
	/*!
	 * add tag meta, that this page is saved by PageCatch
	 * @param {HTMLDocument} - DOM of current document,
	 * @param {String} - string with url of current iframe,
	 */
	
	addMeta = function(DOM, url) {
	  var head, meta, ref;
	  meta = document.createElement('meta');
	  meta.setAttribute('name', 'original-url');
	  meta.setAttribute('content', url);
	  head = (ref = DOM.getElementsByTagName('head')[0]) != null ? ref : DOM.getElementsByTagName('body')[0];
	  return head.insertBefore(meta, head.children[0]);
	};
	
	
	/*!
	 * run functions for delete security policy
	 * @param {HTMLDocument} - DOM of current document
	 * @param {String} - string with url of current iframe
	 */
	
	defaultCleanUp = function(document, url) {
	  deleteMeta(document);
	  deleteSendBoxAttrib(document);
	  return addMeta(document, url);
	};
	
	
	/*!
	 * take html attributes for save
	 * @param {array} array - array with attributes of tag <html>...</html>,
	 * @param {DocumentElement} status - Doctype of document,
	 * @return {String} - string with html code with all atributes + doctype
	 * @example "<! DOCTYPE html> <html lang="en" class="is-absent"><head>...</html>"
	 */
	
	getAttribute = function(array, status) {
	  var doctype, i, j, ref, src;
	  src = "<html ";
	  for (i = j = 0, ref = array.length; j < ref; i = j += 2) {
	    if (array[i + 1] != null) {
	      src += array[i] + '="' + array[i + 1] + '" ';
	    } else {
	      break;
	    }
	  }
	  if (status != null) {
	    doctype = getDoctype(status);
	    return doctype + src + ">";
	  }
	  return src += ">";
	};
	
	
	/*!
	 * take doctype with attributes for save
	 * @param {array} array - array with attributes of doctype,
	 * @return {String} - string with doctype of page
	 * @example "<!DOCTYPE html>"
	 */
	
	getDoctype = function(array) {
	  var elem, i, j, ref, src;
	  src = "<!DOCTYPE ";
	  elem = "";
	  for (i = j = 0, ref = array.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	    if (!array[i].trim()) {
	      continue;
	    }
	    switch (i) {
	      case 0:
	        src += array[i] + " ";
	        break;
	      case 1:
	        src += "PUBLIC " + '"' + array[i] + '" ';
	        break;
	      case 2:
	        src += '"' + array[i] + '"';
	    }
	  }
	  return src + ">";
	};
	
	
	/*!
	 * save page
	 * @param {Number} tabID - number of tab which you want to save,
	 * @param {Function} cleanUp - function with clean any attributes from page,
	 * @param {Function} done - function in which will be return html text of
	 *                          saved page
	 * @example "<! DOCTYPE html> <html lang="en" class="is-absent"><head>...</html>"
	 */
	
	getPage = function(tabID, cleanUp, done) {
	  var createNewObj, dictionary, finalize, flag, parse;
	  dictionary = {};
	  flag = false;
	
	  /*!
	   * parse tags as img,style,link and parse attribute style in any tags with him
	   * @param {Function} callback - function that check completing of save
	   */
	  parse = function(callback) {
	    var attributeCounter, dom, href, j, k, key, l, len, len1, len2, meta, metas, ref, src, tag, tagCounter, tags, tagsStyles;
	    metas = (ref = dictionary[""]) != null ? ref.document.querySelectorAll('[name]') : void 0;
	    for (j = 0, len = metas.length; j < len; j++) {
	      meta = metas[j];
	      if (meta.getAttribute('name') === 'original-url') {
	        flag = true;
	        callback(0, 0);
	        return;
	      }
	    }
	    attributeCounter = 0;
	    tagCounter = 0;
	    for (key in dictionary) {
	      dom = dictionary[key];
	      tagsStyles = dom.document.querySelectorAll('*[style]');
	      for (k = 0, len1 = tagsStyles.length; k < len1; k++) {
	        tag = tagsStyles[k];
	        attributeCounter++;
	        inlineCSS(tag.getAttribute('style'), tag, dom.url, dom.actualUrls, function(error, tag, result) {
	          attributeCounter--;
	          if (error != null) {
	            console.error("Style attr error", error);
	          } else {
	            tag.setAttribute('style', result);
	          }
	          return callback(tagCounter, attributeCounter);
	        });
	      }
	      tags = dom.document.querySelectorAll('img,link,style');
	      for (l = 0, len2 = tags.length; l < len2; l++) {
	        tag = tags[l];
	        tagCounter++;
	        if (tag.hasAttribute('src')) {
	          src = convertURL(tag.getAttribute('src'), dom.url);
	          xhrToBase64(src, tag, function(error, tag, result) {
	            tagCounter--;
	            if (error != null) {
	              console.error("(src)Base 64 error:", error.stack);
	            } else {
	              tag.setAttribute("src", result);
	            }
	            return callback(tagCounter, attributeCounter);
	          });
	        } else if (tag.hasAttribute('href')) {
	          if (tag.getAttribute('rel') === "stylesheet") {
	            href = convertURL(tag.getAttribute('href'), dom.url);
	            inlineCSS(getXHR(href), tag, href, dom.actualUrls, function(error, tag, result) {
	              var parent, style;
	              if (error != null) {
	                console.error("style error", error);
	              } else {
	                tagCounter--;
	                console.log('INLINECSSS_END', tag);
	                style = document.createElement('style');
	                style.innerHTML = result;
	                parent = tag.parentElement;
	                tag.parentElement.insertBefore(style, tag);
	                tag.parentElement.removeChild(tag);
	              }
	              return callback(tagCounter, attributeCounter);
	            });
	          } else {
	            href = convertURL(tag.getAttribute('href'), dom.url);
	            xhrToBase64(href, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(href) xhrToBase64 error (href=" + href + "):", error.stack);
	              } else {
	                tag.setAttribute("href", result);
	              }
	              return callback(tagCounter, attributeCounter);
	            });
	          }
	        } else {
	          inlineCSS(tag.innerHTML, tag, dom.url, dom.actualUrls, function(error, tag, result) {
	            tagCounter--;
	            if (error != null) {
	              console.error("(style)inlineCSS error:", error.stack);
	              console.error(tag.innerHTML);
	            } else {
	              tag.innerHTML = result;
	            }
	            return callback(tagCounter, attributeCounter);
	          });
	        }
	      }
	    }
	    return flag = true;
	  };
	
	  /*!
	   * create one object from dictionary of frames
	   * @param {Object} obj - obj of dictionary(any frame from page)
	   * @param {String} str - string with current index in recursive
	   */
	  createNewObj = function(obj, str) {
	    var _document, _url, frame, frames, index, j, key, len, results, selector, source;
	    frames = obj.document.getElementsByTagName('iframe');
	    results = [];
	    for (j = 0, len = frames.length; j < len; j++) {
	      frame = frames[j];
	      selector = getFramePosition(frame, obj.document);
	      index = -1;
	      for (key in obj.framesIdx) {
	        if (selector === key) {
	          index = obj.framesIdx[key];
	        }
	      }
	      if (index === -1) {
	        continue;
	      }
	      key = str + index;
	      if (dictionary[key] != null) {
	        createNewObj(dictionary[key], key + ":");
	        _url = dictionary[key].url;
	        _document = dictionary[key].document;
	        defaultCleanUp(_document, _url);
	        if (typeof cleanUp === "function") {
	          cleanUp(_document, _url);
	        }
	        source = getAttribute(dictionary[key].header, dictionary[key].doctype) + _document.innerHTML + "</html>";
	        results.push(frame.setAttribute('srcdoc', source));
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };
	
	  /*!
	   * finish and return string with complete all resourses in one HTML
	   * @param {Number} counter - counter of tags
	   * @param {Number} counter1 - counter of attributes
	   */
	  finalize = function(counter, counter1) {
	    var _document, _url, result;
	    if (counter === 0 && counter1 === 0 && flag === true) {
	      createNewObj(dictionary[""], "");
	      _url = dictionary[""].url;
	      _document = dictionary[""].document;
	      defaultCleanUp(_document, _url);
	      if (typeof cleanUp === "function") {
	        cleanUp(_document, _url);
	      }
	      result = getAttribute(dictionary[""].header, dictionary[""].doctype) + _document.innerHTML + "</html>";
	      if (typeof done === "function") {
	        done(result);
	      }
	      dictionary = {};
	      return flag = false;
	    }
	  };
	  return chrome.tabs.executeScript(tabID, {
	    code: "(" + getSource.toString() + ")()",
	    allFrames: true,
	    matchAboutBlank: true
	  }, function(arrays) {
	    var dom, j, len, obj;
	    for (j = 0, len = arrays.length; j < len; j++) {
	      dom = arrays[j];
	      obj = {
	        url: dom[0],
	        header: dom[2],
	        document: getDocument(dom[1]),
	        framesIdx: dom[4],
	        doctype: dom[5],
	        actualUrls: dom[6]
	      };
	      dictionary[dom[3]] = obj;
	    }
	    return parse(finalize);
	  });
	};
	
	module.exports = getPage;


/***/ },
/* 1 */
/***/ function(module, exports) {

	var xhrToBase64;
	
	xhrToBase64 = function(url, elem, callback) {
	  var reader, xhr;
	  if (url.indexOf("data:") >= 0) {
	    return callback(null, elem, url);
	  } else {
	    xhr = new XMLHttpRequest();
	    xhr.open('GET', url, true);
	    xhr.responseType = 'blob';
	    reader = new FileReader();
	    xhr.onload = function(e) {
	      var blob;
	      if (this.status !== 200) {
	        return callback(null, elem, " ", url);
	      } else {
	        blob = this.response;
	        reader.onloadend = function() {
	          return callback(null, elem, reader.result, url);
	        };
	        return reader.readAsDataURL(blob);
	      }
	    };
	    xhr.onerror = function(e) {
	      console.error("XHR Error " + e.target.status + " occurred while receiving the document.");
	      return callback(e, elem, " ", url);
	    };
	    return xhr.send();
	  }
	};
	
	module.exports = xhrToBase64;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	module.exports = function(url, main) {
	  var flag, i, indexURL, indexURLS, len, mainURLS;
	  flag = false;
	  url = url.replace(/\s/g, '');
	  if ((url[0] === '"' && url[url.length - 1] === '"') || (url[0] === "'" && url[url.length - 1] === "'")) {
	    url = url.substr(1, url.length - 2);
	  }
	  if (url.startsWith('data:')) {
	    return url;
	  }
	  if (url.startsWith('//')) {
	    return "https:" + url;
	  }
	  if (url.match(/^[\w\-_\d]+:/)) {
	    return url;
	  }
	  if (url[0] === '/' && url[1] !== '/') {
	    flag = true;
	    mainURLS = main.split('/');
	    mainURLS = mainURLS.slice(0, 3);
	    main = mainURLS.join('/');
	    return main + url;
	  }
	  mainURLS = main.split('/');
	  if (indexOf.call(mainURLS[mainURLS.length - 1], '.') >= 0 && !flag) {
	    mainURLS.pop();
	  }
	  indexURLS = url.split('/');
	  for (i = 0, len = indexURLS.length; i < len; i++) {
	    indexURL = indexURLS[i];
	    if (indexURL === '..') {
	      mainURLS.pop();
	    } else {
	      mainURLS.push(indexURL);
	    }
	  }
	  return mainURLS.join('/');
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(url) {
	  var e, xhr;
	  try {
	    xhr = new XMLHttpRequest();
	    xhr.open('GET', url, false);
	    xhr.send();
	    if (xhr.status === 200) {
	      return xhr.responseText;
	    } else {
	      return " ";
	    }
	  } catch (error) {
	    e = error;
	    console.error("XHR", e.stack);
	    return " ";
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var convertToBase64, convertURL;
	
	convertURL = __webpack_require__(2);
	
	convertToBase64 = __webpack_require__(1);
	
	module.exports = function(src, dom, source, actualUrls, callback) {
	  var convMas, counter, elemMas, flag, i, j, lastIndex, obj, ref, regExp, urlMas;
	  flag = false;
	  if (src.indexOf("url(") < 0) {
	    return callback(null, dom, src);
	  } else {
	    urlMas = [];
	    elemMas = [];
	    convMas = [];
	    lastIndex = 0;
	    regExp = /(.*?url\()\s*(['"]?)(.*?)\2\s*(\))/gi;
	    while ((obj = regExp.exec(src)) != null) {
	      elemMas.push(obj[1], obj[4]);
	      urlMas.push(convertURL(obj[3], source));
	      lastIndex = regExp.lastIndex;
	    }
	    elemMas.push(src.slice(lastIndex));
	    counter = 0;
	    for (i = j = 0, ref = urlMas.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	      if (actualUrls[urlMas[i]]) {
	        flag = true;
	        actualUrls[urlMas[i]];
	        counter++;
	        console.log('COUNTER++', counter);
	        convertToBase64(urlMas[i], dom, function(error, obj, result, url) {
	          var index, urlIndex;
	          counter--;
	          console.log(counter);
	          if (error != null) {
	            console.error("Error base64:", error.stack);
	          } else {
	            actualUrls[url] = result;
	          }
	          if (counter === 0) {
	            console.log(actualUrls);
	            src = [];
	            index = 0;
	            urlIndex = 0;
	            while (index < elemMas.length) {
	              src.push(elemMas[index]);
	              index++;
	              if (urlMas[urlIndex] != null) {
	                if (actualUrls[urlMas[urlIndex]]) {
	                  console.log('URL', actualUrls[urlMas[urlIndex]]);
	                  src.push('"' + actualUrls[urlMas[urlIndex]] + '"');
	                } else {
	                  src.push("");
	                }
	              }
	              if ((elemMas[index] != null)) {
	                console.log("SECOND_ELEM", elemMas[index]);
	                src.push(elemMas[index]);
	              }
	              index++;
	              urlIndex++;
	            }
	            return callback(null, dom, src.join(""));
	          }
	        });
	      }
	    }
	    if (!flag) {
	      return callback(null, dom, elemMas.join(''));
	    }
	  }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=page-catch.js.map