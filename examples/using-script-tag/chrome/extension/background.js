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
/***/ (function(module, exports) {

	var META_ATTRIBS_FOR_DEL, ONEVENT_ATTRIBS, cleanUp, clearOnEventAttribs, clearValueAttrib, deleteMeta, deleteScripts, deleteSendBoxAttrib, save,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	META_ATTRIBS_FOR_DEL = ['Content-Security-Policy', 'refresh'];
	
	ONEVENT_ATTRIBS = ['onload', 'onclick', 'onkeyup', 'onkeydown', 'onenter', 'onmouseenter', 'onmouseleave', 'onkeypress'];
	
	deleteScripts = function(document) {
	  var i, len, script, scripts;
	  scripts = document.querySelectorAll('script');
	  for (i = 0, len = scripts.length; i < len; i++) {
	    script = scripts[i];
	    script.parentElement.removeChild(script);
	  }
	  return document;
	};
	
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
	
	deleteSendBoxAttrib = function(document) {
	  var iframes;
	  iframes = document.querySelectorAll('iframe[sendbox]');
	  return iframes.forEach(function(iframe) {
	    return iframe.removeAttribute('sendbox');
	  });
	};
	
	clearValueAttrib = function(document) {
	  var inputs;
	  inputs = document.querySelectorAll("input[type='password']");
	  return inputs.forEach(function(input) {
	    if (input.getAttribute('value')) {
	      return input.setAttribute('value', '');
	    }
	  });
	};
	
	clearOnEventAttribs = function(document) {
	  var elements;
	  elements = document.querySelectorAll("[" + (ONEVENT_ATTRIBS.join('],[')) + "]");
	  return elements.forEach(function(element) {
	    var attr, i, len, ref, ref1, results;
	    ref = element.attributes;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      attr = ref[i];
	      if (ref1 = attr != null ? attr.name : void 0, indexOf.call(ONEVENT_ATTRIBS, ref1) >= 0) {
	        results.push(element.removeAttribute(attr.name));
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  });
	};
	
	cleanUp = function(document, url) {
	  deleteScripts(document);
	  deleteMeta(document);
	  clearOnEventAttribs(document);
	  deleteSendBoxAttrib(document);
	  return clearValueAttrib(document);
	};
	
	save = function(htmlText) {
	  var file;
	  file = new File([htmlText], "index.html", {
	    type: "text/html;charset=utf-8"
	  });
	  return saveAs(file);
	};
	
	chrome.browserAction.onClicked.addListener(function() {
	  return chrome.tabs.query({
	    active: true,
	    currentWindow: true
	  }, function(tabArray) {
	    return getPage(tabArray[0].id, cleanUp, save);
	  });
	});


/***/ })
/******/ ]);
//# sourceMappingURL=background.js.map