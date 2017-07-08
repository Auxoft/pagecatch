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
/***/ function(module, exports) {

	var META_ATTRIBS_FOR_DEL, ONEVENT_ATTRIBS, cleanUp, clearOnEventAttribs, clearValueAttrib, deleteAxtAttribs, deleteAxtElements, deleteMeta, deleteScripts, deleteSendBoxAttrib, id, replaceAxtAttribs, save,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	id = 0;
	
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
	
	deleteAxtElements = function(document) {
	  var axtElements;
	  axtElements = document.querySelectorAll('.axt-element');
	  console.log("axtElements =", axtElements);
	  return axtElements.forEach(function(element) {
	    var ref;
	    return (ref = element.parentElement) != null ? ref.removeChild(element) : void 0;
	  });
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
	
	deleteAxtAttribs = function(document) {
	  var axtAttrElements, body;
	  body = document.getElementsByTagName('body')[0];
	  body.removeAttribute('axt-keyreel-extension-installed');
	  body.removeAttribute('axt-parser-timing');
	  axtAttrElements = document.querySelectorAll('[axt-visible]');
	  return axtAttrElements.forEach(function(element) {
	    return element.removeAttribute('axt-visible');
	  });
	};
	
	replaceAxtAttribs = function(document) {
	  var _processForm, body;
	  _processForm = function(form) {
	    var form_type;
	    if (form.hasAttribute('axt-expected-form-type')) {
	      form_type = form.getAttribute('axt-expected-form-type');
	    } else {
	      form_type = form.getAttribute('axt-form-type');
	    }
	    form.removeAttribute('axt-form-type');
	    if (form_type) {
	      form.setAttribute('axt-expected-form-type', form_type);
	    } else {
	      form.removeAttribute('axt-expected-form-type');
	    }
	    form.querySelectorAll('[axt-input-type],[axt-expected-input-type]').forEach(function(input) {
	      var input_type;
	      if (input.hasAttribute('axt-expected-input-type')) {
	        input_type = input.getAttribute('axt-expected-input-type');
	      } else {
	        input_type = input.getAttribute('axt-input-type');
	      }
	      input.removeAttribute('axt-input-type');
	      if (input_type) {
	        return input.setAttribute('axt-expected-input-type', input_type);
	      } else {
	        return input.removeAttribute('axt-expected-input-type');
	      }
	    });
	    return form.querySelectorAll('[axt-button-type],[axt-expected-button-type]').forEach(function(button) {
	      var button_type;
	      if (button.hasAttribute('axt-expected-button-type')) {
	        button_type = button.getAttribute('axt-expected-button-type');
	      } else {
	        button_type = button.getAttribute('axt-button-type');
	      }
	      button.removeAttribute('axt-button-type');
	      if (button_type) {
	        return button.setAttribute('axt-expected-button-type', button_type);
	      } else {
	        return button.removeAttribute('axt-expected-button-type');
	      }
	    });
	  };
	  body = document.getElementsByTagName('body')[0];
	  body.querySelectorAll('[axt-form-type],[axt-expected-form-type').forEach(_processForm);
	  if (body.getAttribute('axt-form-type') != null) {
	    return _processForm(body);
	  }
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
	  deleteAxtElements(document);
	  deleteAxtAttribs(document);
	  replaceAxtAttribs(document);
	  return clearValueAttrib(document);
	};
	
	save = function(htmlText) {
	  var file;
	  file = new File([htmlText], "index.html", {
	    type: "text/html;charset=utf-8"
	  });
	  return saveAs(file);
	};
	
	chrome.management.getAll(function(extensionsArray) {
	  var extension, i, len;
	  for (i = 0, len = extensionsArray.length; i < len; i++) {
	    extension = extensionsArray[i];
	    if (extension.name === 'KeyReel form checker' && extension.enabled) {
	      id = extension.id;
	      return;
	    }
	  }
	});
	
	chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
	  console.log('request', request);
	  console.log('sender:', sender);
	  console.log('sendResponse', sendResponse);
	  console.log(id);
	  if (sender.id === id) {
	    return chrome.tabs.query({
	      active: true,
	      currentWindow: true
	    }, function(tabArray) {
	      console.log(pageCatch);
	      return getPage(tabArray[0].id, cleanUp, save);
	    });
	  }
	});
	
	chrome.browserAction.onClicked.addListener(function() {
	  return chrome.tabs.query({
	    active: true,
	    currentWindow: true
	  }, function(tabArray) {
	    return getPage(tabArray[0].id, cleanUp, save);
	  });
	});


/***/ }
/******/ ]);
//# sourceMappingURL=background.js.map