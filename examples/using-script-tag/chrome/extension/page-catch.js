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
/***/ (function(module, exports, __webpack_require__) {

	var META_ATTRIBS_FOR_DEL, TreeElementNotFound, addMeta, badLinksRel, convertURL, createSelector, decode, decodeNoScript, defaultCleanUp, deleteElemsFromHead, deleteIframesFromHead, deleteMeta, deleteSendBoxAttrib, getAttribute, getDoctype, getDocument, getFramePosition, getPage, getSource, getXHR, inlineCSS, xhrToBase64,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	xhrToBase64 = __webpack_require__(1);
	
	convertURL = __webpack_require__(2);
	
	getXHR = __webpack_require__(3);
	
	inlineCSS = __webpack_require__(4);
	
	badLinksRel = ['dns-prefetch', 'canonical', 'publisher', 'prefetch', ' alternate', 'bb:rum'];
	
	META_ATTRIBS_FOR_DEL = ['Content-Security-Policy', 'refresh'];
	
	TreeElementNotFound = (function(superClass) {
	  extend(TreeElementNotFound, superClass);
	
	  function TreeElementNotFound() {
	    return TreeElementNotFound.__super__.constructor.apply(this, arguments);
	  }
	
	  return TreeElementNotFound;
	
	})(Error);
	
	getSource = function() {
	  var createSelector, getAttribute, getCssRulesForTagStyle, getDoctype, getElementPath, getFramePath, getUrlMas, linksObj, passOnTree, ref, ref1, ref2, ref3, stylesheetsArray;
	  linksObj = {};
	  stylesheetsArray = [];
	  createSelector = function(obj) {
	    var child, i, j, len, parent, ref, selector;
	    selector = [];
	    while (obj && obj.nodeName !== 'HTML') {
	      parent = obj.parentElement;
	      if (parent) {
	        ref = parent.children;
	        for (i = j = 0, len = ref.length; j < len; i = ++j) {
	          child = ref[i];
	          if (parent.children[i] === obj) {
	            selector.unshift(i);
	            break;
	          }
	        }
	      }
	      obj = parent;
	    }
	    selector = selector.join(':');
	    return selector;
	  };
	  getCssRulesForTagStyle = function(stylesheets) {
	    var e, j, len, str, style;
	    for (j = 0, len = stylesheets.length; j < len; j++) {
	      style = stylesheets[j];
	      str = "";
	      try {
	        if (style.rules != null) {
	          str = Array.from(style.rules).map(function(r) {
	            return r.cssText;
	          }).join('\n');
	          stylesheetsArray.push([str, createSelector(style.ownerNode)]);
	        }
	      } catch (error1) {
	        e = error1;
	      }
	    }
	  };
	  getCssRulesForTagStyle(document.styleSheets);
	  getUrlMas = function(styleObj) {
	    var elem, endIndex, j, key, len, results, startIndex;
	    results = [];
	    for (j = 0, len = styleObj.length; j < len; j++) {
	      elem = styleObj[j];
	      startIndex = styleObj[elem].indexOf('url(');
	      results.push((function() {
	        var results1;
	        results1 = [];
	        while (startIndex > -1) {
	          endIndex = styleObj[elem].indexOf(')', startIndex + 1);
	          key = styleObj[elem].substring(startIndex + 4, endIndex);
	          if (key.startsWith('"') || key.startsWith("'")) {
	            key = key.substring(1, key.length - 1);
	          }
	          if (!key.startsWith('#')) {
	            linksObj[key] = true;
	          }
	          results1.push(startIndex = styleObj[elem].indexOf('url(', endIndex + 1));
	        }
	        return results1;
	      })());
	    }
	    return results;
	  };
	  passOnTree = function(elem) {
	    var child, j, len, ref;
	    if (elem != null) {
	      ref = elem.children;
	      for (j = 0, len = ref.length; j < len; j++) {
	        child = ref[j];
	        passOnTree(child);
	      }
	      getUrlMas(window.getComputedStyle(elem));
	      getUrlMas(window.getComputedStyle(elem, ':after'));
	      return getUrlMas(window.getComputedStyle(elem, ':before'));
	    }
	  };
	  passOnTree(document.body);
	
	  /*!
	   * get frame index in the page
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
	   * @return {Object} - frames position on the current frame
	   * @example [3,0,0]: 0
	   */
	  getElementPath = function(DOM) {
	    var dictionary, frames, getFrameId, i, iframe, j, len, result;
	    dictionary = {};
	
	    /*!
	     * get frameID
	     * @param {HTMLIframeElement} obj - iframe document object
	     * @return {String} - string with the iframe index
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
	  return [[document.URL, document.location.protocol], [(ref = (ref1 = document.head) != null ? ref1.innerHTML : void 0) != null ? ref : '', (ref2 = (ref3 = document.body) != null ? ref3.outerHTML : void 0) != null ? ref2 : ''], getAttribute(document.documentElement.attributes), getFramePath(), getElementPath(document.documentElement), getDoctype(document.doctype), linksObj, stylesheetsArray];
	};
	
	deleteIframesFromHead = function(head) {
	  var frames, i, j, ref;
	  frames = head.querySelectorAll('iframe');
	  for (i = j = 0, ref = frames.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	    frames[i].parentElement.removeChild(frames[i]);
	    i--;
	  }
	  return head;
	};
	
	
	/*!
	 * convert html text of every frame to DOM-Tree
	 * @param {string} head - string with html code of head
	 * @param {string} body - string with html code of body
	 * @return {HTMLDocument} - created DOM with string
	 */
	
	getDocument = function(head, body) {
	  var html;
	  html = document.implementation.createHTMLDocument();
	  html.head.innerHTML = head;
	  html.head = deleteIframesFromHead(html.head);
	  html.body.outerHTML = body;
	  html.getElementsByTagName('head')[1].parentElement.removeChild(html.getElementsByTagName('head')[1]);
	  return html;
	};
	
	
	/*!
	 * get frame position on the background script
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
	    if (obj.parentElement === DOM.documentElement) {
	
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
	 * add meta tag informing that this page is saved by PageCatch
	 * @param {HTMLDocument} - DOM of current document,
	 * @param {String} - string with url of current iframe,
	 * NOTE: if original-url meta alread exists (with original site url), do
	 * not create a new one. It means, that we resave already stored page
	 */
	
	addMeta = function(DOM, url) {
	  var head, meta, ref;
	  if (!DOM.querySelector('meta[name="original-url"]')) {
	    meta = document.createElement('meta');
	    meta.setAttribute('name', 'original-url');
	    meta.setAttribute('content', url);
	    head = (ref = DOM.getElementsByTagName('head')[0]) != null ? ref : DOM.getElementsByTagName('body')[0];
	    return head.insertBefore(meta, head.children[0]);
	  }
	};
	
	decode = function(text) {
	  if (text.indexOf('&amp;') >= 0 || text.indexOf('&quot;') >= 0 || text.indexOf('&gt;') >= 0 || text.indexOf('&lt;') >= 0) {
	    text = text.replace(/\&amp\;/g, '&');
	    text = text.replace(/\&quot\;/g, '"');
	    text = text.replace(/\&lt\;/g, '<');
	    text = text.replace(/\&gt\;/g, '>');
	    text = decode(text);
	    decode(text);
	  }
	  return text;
	};
	
	decodeNoScript = function(document) {
	  var j, len, noscripts, script;
	  noscripts = document.getElementsByTagName('noscript');
	  for (j = 0, len = noscripts.length; j < len; j++) {
	    script = noscripts[j];
	    script.outerHTML = decode(script.outerHTML);
	  }
	  return document;
	};
	
	
	/*!
	 * run functions for delete security policy
	 * @param {HTMLDocument} - DOM of current document
	 * @param {String} - string with url of current iframe
	 */
	
	defaultCleanUp = function(document, url) {
	  decodeNoScript(document);
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
	
	deleteElemsFromHead = function(obj) {
	  var elem, elems, j, len;
	  elems = obj.querySelectorAll('div,img');
	  for (j = 0, len = elems.length; j < len; j++) {
	    elem = elems[j];
	    elem.parentElement.removeChild(elem);
	  }
	  return document;
	};
	
	createSelector = function(obj) {
	  var child, i, j, len, parent, ref, selector;
	  selector = [];
	  while (obj && obj.nodeName !== 'HTML') {
	    parent = obj.parentElement;
	    if (parent) {
	      ref = parent.children;
	      for (i = j = 0, len = ref.length; j < len; i = ++j) {
	        child = ref[i];
	        if (parent.children[i] === obj) {
	          selector.unshift(i);
	          break;
	        }
	      }
	    }
	    obj = parent;
	  }
	  selector = selector.join(':');
	  return selector;
	};
	
	
	/*!
	 * save page
	 * @param {Number} tabID - number of tab which you want to save,
	 * @param {Function} cleanUp - function witch cleans any attributes from page,
	 * @param {Function} done - function in which html-text of saved page will be
	 *                          return
	 * @example "<! DOCTYPE html> <html lang="en" class="is-absent"><head>...</html>"
	 */
	
	getPage = function(tabID, cleanUp, done) {
	  var createNewObj, dictionary, finalize, flag, parse, scriptForAddHash;
	  dictionary = {};
	  flag = false;
	
	  /*!
	   * parse tags as img,style,link and parse attribute style in any tags with it
	   * @param {Function} callback - function that check completing of save
	   */
	  parse = function(callback) {
	    var _style, attributeCounter, attributes, dom, faviconLinks, href, iconCounter, iconFlag, j, k, key, l, len, len1, len2, len3, len4, len5, link, links, m, meta, metas, n, o, ref, ref1, ref2, ref3, ref4, ref5, rel, selector, src, style, styleTags, tag, tagCounter, tags, tagsStyles, url, urlMas;
	    metas = (ref = dictionary[""]) != null ? ref.document.querySelectorAll('[name]') : void 0;
	    for (j = 0, len = metas.length; j < len; j++) {
	      meta = metas[j];
	      if (meta.getAttribute('name') === 'original-url') {
	        flag = true;
	        callback(0, 0, 0);
	        return;
	      }
	    }
	    faviconLinks = [];
	    links = (ref1 = dictionary[""]) != null ? ref1.document.querySelectorAll('link') : void 0;
	    iconFlag = false;
	    iconCounter = 0;
	    for (k = 0, len1 = links.length; k < len1; k++) {
	      link = links[k];
	      rel = link.getAttribute('rel');
	      if (rel !== null && rel.indexOf('icon') !== -1) {
	        if (rel === 'icon') {
	          iconFlag = true;
	        }
	        faviconLinks.push(link);
	      }
	    }
	    if (!iconFlag) {
	      url = (ref2 = dictionary[""]) != null ? ref2.url[0] : void 0;
	      urlMas = url.split('/');
	      urlMas = urlMas.slice(0, 3);
	      url = urlMas.join('/') + '/favicon.ico';
	      link = document.createElement('link');
	      link.setAttribute('rel', 'icon');
	      iconCounter = 1;
	      xhrToBase64(url, link, function(error, tag, result) {
	        var href;
	        if (error != null) {
	          iconCounter--;
	          return console.error("(src)Base 64 error:", error.stack);
	        } else {
	          if (result === "") {
	            iconCounter++;
	            if (faviconLinks.length !== 0) {
	              href = faviconLinks[0].getAttribute('href');
	            } else {
	              iconCounter--;
	            }
	            callback(tagCounter, attributeCounter, iconCounter);
	            xhrToBase64(href, tag, function(error, tag, result) {
	              if (error != null) {
	                iconCounter--;
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("href", result);
	                dictionary[""].document.head.appendChild(tag);
	                iconCounter--;
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	          } else {
	            tag.setAttribute("href", result);
	            dictionary[""].document.head.appendChild(tag);
	            iconCounter--;
	          }
	          return callback(tagCounter, attributeCounter, iconCounter);
	        }
	      });
	    }
	    attributeCounter = 0;
	    tagCounter = 0;
	    for (key in dictionary) {
	      dom = dictionary[key];
	      dom.document.head = deleteElemsFromHead(dom.document.head);
	      styleTags = dom.document.querySelectorAll('style');
	      for (l = 0, len2 = styleTags.length; l < len2; l++) {
	        style = styleTags[l];
	        selector = createSelector(style);
	        ref3 = dom.styleSheets;
	        for (m = 0, len3 = ref3.length; m < len3; m++) {
	          _style = ref3[m];
	          if (_style[1] === selector && _style[0]) {
	            style.innerHTML = _style[0];
	            break;
	          }
	        }
	      }
	      tagsStyles = dom.document.querySelectorAll('*[style]');
	      for (n = 0, len4 = tagsStyles.length; n < len4; n++) {
	        tag = tagsStyles[n];
	        attributeCounter++;
	        inlineCSS(tag.getAttribute('style'), tag, dom.url[0], dom, [], function(error, tag, dom, result) {
	          attributeCounter--;
	          if (error != null) {
	            console.error("Style attr error", error);
	          } else {
	            tag.setAttribute('style', result);
	          }
	          return callback(tagCounter, attributeCounter, iconCounter);
	        });
	      }
	      tags = dom.document.querySelectorAll('img,link,source,style, object');
	      for (o = 0, len5 = tags.length; o < len5; o++) {
	        tag = tags[o];
	        tagCounter++;
	        if (tag.nodeName === 'LINK') {
	          if (((ref4 = tag.getAttribute('rel')) === "stylesheet" || ref4 === "prefetch stylesheet")) {
	            href = convertURL(tag.getAttribute('href'), dom.url[0], dom.url[1]);
	            attributes = tag.attributes;
	            inlineCSS(getXHR(href), tag, href, dom, attributes, function(error, tag, dom, result, attributes) {
	              var attribute, len6, p, parent;
	              tagCounter--;
	              if (error != null) {
	                console.error("style error", error);
	              } else {
	                console.log('INLINECSSS_END', tag);
	                style = document.createElement('style');
	                style.innerHTML = result;
	                for (p = 0, len6 = attributes.length; p < len6; p++) {
	                  attribute = attributes[p];
	                  style.setAttribute(attribute.name, attribute.value);
	                }
	                parent = tag.parentElement;
	                parent.insertBefore(style, tag);
	                parent.removeChild(tag);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else if (ref5 = tag.getAttribute('rel'), indexOf.call(badLinksRel, ref5) >= 0) {
	            tag.parentElement.removeChild(tag);
	            tagCounter--;
	            continue;
	          } else {
	            href = convertURL(tag.getAttribute('href'), dom.url[0], dom.url[1]);
	            xhrToBase64(href, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(href) xhrToBase64 error (href=" + href + "):", error.stack);
	              } else {
	                tag.setAttribute("href", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          }
	        }
	        if (tag.nodeName === 'IMG') {
	          if (tag.hasAttribute('srcset') && !tag.hasAttribute('src')) {
	            src = convertURL(tag.getAttribute('srcset'), dom.url[0], dom.url[1]);
	            xhrToBase64(src, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("srcset", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else if (tag.hasAttribute('src') && !tag.hasAttribute('srcset')) {
	            src = convertURL(tag.getAttribute('src'), dom.url[0], dom.url[1]);
	            xhrToBase64(src, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("src", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else if (tag.hasAttribute('src') && tag.hasAttribute('srcset')) {
	            tag.setAttribute('srcset', "");
	            src = convertURL(tag.getAttribute('src'), dom.url[0], dom.url[1]);
	            xhrToBase64(src, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("src", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else {
	            tagCounter--;
	            continue;
	          }
	        }
	        if (tag.nodeName === 'OBJECT') {
	          if (tag.hasAttribute('data')) {
	            src = convertURL(tag.getAttribute('data'), dom.url[0], dom.url[1]);
	            xhrToBase64(src, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("srcset", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else {
	            tagCounter--;
	            continue;
	          }
	        }
	        if (tag.nodeName === 'STYLE') {
	          inlineCSS(tag.innerHTML, tag, dom.url[0], dom, [], function(error, tag, dom, result) {
	            tagCounter--;
	            if (error != null) {
	              console.error("(style)inlineCSS error:", error.stack);
	            } else {
	              tag.innerHTML = result;
	            }
	            return callback(tagCounter, attributeCounter, iconCounter);
	          });
	          continue;
	        }
	        if (tag.nodeName === 'SOURCE') {
	          if (tag.type.indexOf('video') > -1 || tag.type.indexOf('audio') > -1) {
	            tagCounter--;
	            continue;
	          } else if (tag.hasAttribute('srcset') && !tag.hasAttribute('src')) {
	            src = convertURL(tag.getAttribute('srcset'), dom.url[0], dom.url[1]);
	            xhrToBase64(src, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("srcset", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else if (tag.hasAttribute('src') && !tag.hasAttribute('srcset')) {
	            src = convertURL(tag.getAttribute('src'), dom.url[0], dom.url[1]);
	            xhrToBase64(src, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("src", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else if (tag.hasAttribute('src') && tag.hasAttribute('srcset')) {
	            tag.setAttribute('srcset', "");
	            src = convertURL(tag.getAttribute('src'), dom.url[0], dom.url[1]);
	            xhrToBase64(src, tag, function(error, tag, result) {
	              tagCounter--;
	              if (error != null) {
	                console.error("(src)Base 64 error:", error.stack);
	              } else {
	                tag.setAttribute("src", result);
	              }
	              return callback(tagCounter, attributeCounter, iconCounter);
	            });
	            continue;
	          } else {
	            tagCounter--;
	            continue;
	          }
	        } else {
	          tagCounter--;
	          continue;
	        }
	      }
	    }
	    flag = true;
	    return callback(tagCounter, attributeCounter, iconCounter);
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
	        defaultCleanUp(_document, _url[0]);
	        if (typeof cleanUp === "function") {
	          cleanUp(_document, _url[0]);
	        }
	        source = getAttribute(dictionary[key].header, dictionary[key].doctype) + _document.documentElement.innerHTML + "</html>";
	        results.push(frame.setAttribute('srcdoc', source));
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };
	  scriptForAddHash = function(hashURL) {
	    return window.location.hash = hashURL.split('#')[1];
	  };
	
	  /*!
	   * finish and return string with complete all resourses in one HTML
	   * @param {Number} counter - counter of tags
	   * @param {Number} counter1 - counter of attributes
	   */
	  finalize = function(counter, counter1, counter2) {
	    var _document, _url, hashURL, result, script;
	    console.log("counter=", counter, 'counter1=', counter1, 'counter2=', counter2, 'flag=', flag);
	    if (counter === 0 && counter1 === 0 && counter2 === 0 && flag === true) {
	      createNewObj(dictionary[""], "");
	      _url = dictionary[""].url;
	      _document = dictionary[""].document;
	      defaultCleanUp(_document, _url[0]);
	      if (typeof cleanUp === "function") {
	        cleanUp(_document, _url);
	      }
	      hashURL = dictionary[""].url[0];
	      if (hashURL.indexOf('#') !== -1) {
	        script = document.createElement('script');
	        script.innerHTML = 'window.location.hash =' + '"' + hashURL.split('#')[1] + '"';
	        _document.head.insertBefore(script, _document.head.children[1]);
	      }
	      result = getAttribute(dictionary[""].header, dictionary[""].doctype) + _document.documentElement.innerHTML + "</html>";
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
	        document: getDocument(dom[1][0], dom[1][1]),
	        framesIdx: dom[4],
	        doctype: dom[5],
	        actualUrls: dom[6],
	        styleSheets: dom[7]
	      };
	      dictionary[dom[3]] = obj;
	    }
	    return parse(finalize);
	  });
	};
	
	module.exports = getPage;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	var xhrToBase64;
	
	xhrToBase64 = function(url, elem, callback) {
	  var reader, xhr;
	  if (url.indexOf("data:") >= 0 || url.length < 10) {
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = function(url, main, protocol) {
	  var flag, i, indexURL, indexURLS, len, mainURLS;
	  flag = false;
	  if (url == null) {
	    url = '';
	  }
	  if ((url[0] === '"' && url[url.length - 1] === '"') || (url[0] === "'" && url[url.length - 1] === "'")) {
	    url = url.substr(1, url.length - 2);
	  }
	  if (url.startsWith('data:')) {
	    return url;
	  }
	  url = url.replace(/\s/g, '');
	  main = main.split('#')[0];
	  if (url.startsWith('//')) {
	    return protocol + url;
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
	  mainURLS.pop();
	  indexURLS = url.split('/');
	  for (i = 0, len = indexURLS.length; i < len; i++) {
	    indexURL = indexURLS[i];
	    if (indexURL === '..') {
	      mainURLS.pop();
	    } else if (indexURL === '.') {
	      continue;
	    } else {
	      mainURLS.push(indexURL);
	    }
	  }
	  return mainURLS.join('/');
	};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var addNewActualUrls, convertToBase64, convertURL, getCounter, getXHR;
	
	convertURL = __webpack_require__(2);
	
	convertToBase64 = __webpack_require__(1);
	
	getXHR = __webpack_require__(3);
	
	getCounter = function(urlMas, actualUrls) {
	  var counter, i, j, ref;
	  counter = 0;
	  for (i = j = 0, ref = urlMas.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	    if (actualUrls[urlMas[i]]) {
	      counter++;
	    }
	  }
	  return counter;
	};
	
	addNewActualUrls = function(htmlText, actualUrls, source) {
	  var obj, re, re1, ref, url;
	  re = /@font-face\s*\{[\s\S]*?src\s*:\s*(?:local\(.*?\)\s*,?\s*)*(?:url\(\s*(?:(['"])?([\s\S]*?)\1|()([\s\S]*?))\s*\))+[\s\S]*?.*?\}/g;
	  re1 = /url\(\s*(?:(['"])([^\1]*?)\1|([\s\S]*?))\s*\)/g;
	  while ((obj = re.exec(htmlText)) != null) {
	    while ((url = re1.exec(obj[0])) != null) {
	      actualUrls[convertURL((ref = url[2]) != null ? ref : url[3], source)] = true;
	    }
	  }
	  return actualUrls;
	};
	
	module.exports = function(src, element, source, dom, attributes, callback) {
	  var convMas, counter, elemMas, flag, i, j, lastIndex, obj, re, ref, regExp, urlMas;
	  flag = false;
	  if (src.indexOf("@import") > -1) {
	    re = /@import\s+(?:url\((['"])?([\s\S]*?)\1\)|(['"])?([\s\S]*?)\3)\s*[^;]*?(?:;|$)/gmi;
	    src = src.replace(re, function(str) {
	      var temp;
	      temp = re.exec(str);
	      if (temp == null) {
	        return "";
	      }
	      if (temp[2] != null) {
	        return getXHR(convertURL(temp[2], source));
	      }
	      if (temp[4] != null) {
	        return getXHR(convertURL(temp[4], source));
	      }
	    });
	  }
	  if (src.indexOf("url(") < 0) {
	    return callback(null, element, dom, src, attributes);
	  } else {
	    urlMas = [];
	    elemMas = [];
	    convMas = [];
	    lastIndex = 0;
	    regExp = /([\s\S]*?url\()\s*(['"]?)([\s\S]*?)\2\s*(\))/gmi;
	    obj = regExp.exec(src);
	    while (obj != null) {
	      elemMas.push(obj[1], obj[4]);
	      urlMas.push(convertURL(obj[3], source, (new URL(source)).protocol));
	      lastIndex = regExp.lastIndex;
	      if (src.indexOf('url(', lastIndex + 1) > -1) {
	        obj = regExp.exec(src);
	      } else {
	        elemMas.push(src.slice(lastIndex));
	        lastIndex = src.length;
	        break;
	      }
	    }
	    elemMas.push(src.slice(lastIndex));
	    dom.actualUrls = addNewActualUrls(src, dom.actualUrls, source);
	    counter = getCounter(urlMas, dom.actualUrls);
	    for (i = j = 0, ref = urlMas.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	      if (dom.actualUrls[urlMas[i]]) {
	        flag = true;
	        dom.actualUrls[urlMas[i]];
	        convertToBase64(urlMas[i], element, function(error, obj, result, url) {
	          var index, urlIndex;
	          counter--;
	          if (error != null) {
	            console.error("Error base64:", error.stack);
	          } else {
	            dom.actualUrls[url] = result;
	          }
	          if (counter === 0) {
	            src = [];
	            index = 0;
	            urlIndex = 0;
	            while (index < elemMas.length) {
	              src.push(elemMas[index]);
	              index++;
	              if (urlMas[urlIndex] != null) {
	                if (dom.actualUrls[urlMas[urlIndex]] || urlMas[urlIndex].startsWith('data:')) {
	                  if (urlMas[urlIndex].startsWith('data:')) {
	                    src.push('"' + urlMas[urlIndex] + '"');
	                  } else {
	                    src.push('"' + dom.actualUrls[urlMas[urlIndex]] + '"');
	                  }
	                } else {
	                  src.push('""');
	                }
	              }
	              if ((elemMas[index] != null)) {
	                src.push(elemMas[index]);
	              }
	              index++;
	              urlIndex++;
	            }
	            return callback(null, element, dom, src.join(""), attributes);
	          }
	        });
	      }
	    }
	    if (!flag) {
	      return callback(null, element, dom, elemMas.join(''), attributes);
	    }
	  }
	};


/***/ })
/******/ ]);
//# sourceMappingURL=page-catch.js.map