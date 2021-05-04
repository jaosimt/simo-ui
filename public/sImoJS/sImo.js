topZIndex = 2147483647;

sImo = function () {};
sImo.prototype = {
    CustomObject: function (){
        if (arguments.length !== 2) {
            this.error = "Expecting 2 obj arguments.  Got " + (arguments.length === 0 ? "none" : arguments.length);
            return this;
        }
        
        var objTemplate = arguments[0];
        var objArgument = arguments[1];
        var noProps = true;
        
        for (prop in objArgument) {
            if (objArgument.hasOwnProperty(prop) && objTemplate.hasOwnProperty(prop)) {
                this[prop] = objArgument[prop];
                noProps = false;
            }
        }
        
        if (noProps) {
            this.error = "Argument has no Object [" + Object.keys(objTemplate) + "] properties!";
        }
        
        return this;
    },
    hasStorage: false,
    cookie: {
        enabled: function () {
            var cookieEnabled = (navigator.cookieEnabled);
            
            if (typeof navigator.cookieEnabled === "undefined" && !cookieEnabled) {
                document.cookie = "testcookie";
                cookieEnabled = (document.cookie.indexOf("testcookie") !== -1);
            }
            return (cookieEnabled);
        },
        set: function (cName, cValue, expireDays) {
            if (simo.cookie.enabled() && cName && cValue) {
                expireDays = simo.is.number(expireDays) ? expireDays : 7;
                var d = new Date();
                d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cName + "=" + cValue + "; " + expires;
            }
        },
        get: function (cName) {
            if (!simo.cookie.enabled()) {
                return "";
            }
            var name = cName + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1);
                if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
            }
            return "";
        },
        remove: function (cookie) {
            if (cookie) {
                document.cookie = cookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            }
        }
    },
    store: function (arg1, arg2) {
        if (simo.cookie.enabled()) {
            if (!arg1) {
                return window.localStorage;
            }
            var store_val = "";
            try {
                if (arg1 && arg2 !== undefined) {
                    window.localStorage.setItem(String(arg1), arg2);
                }
                store_val = window.localStorage.getItem(String(arg1));
            } catch (err) {
                log("unexpected error in localStorage!");
                store_val = {};
            }
            
            return store_val;
            
        } else {
            log("cookie is not enabled! respect, in one word!");
            return {};
        }
    },
    trim: function (str) {
        str = String(str);
        return str && ("function" === typeof str.trim) ? str.trim() : str;
    },
    cleanArray: function (array_object, options) {
        var _type = typeof array_object === "object" && array_object instanceof Array ? "array" : undefined;
        
        if (_type !== "array") {
            console.error("Object type: " + _type, "simo.cleanArray | Required Object type should be of jQuery type 'array'");
            return undefined;
        }
        
        options = options ? (String(options) + " empty") : "empty";
        
        var _a = [];
        
        array_object.forEach(function (value) {
            var _x = String(value);
            _x = (_x === "") ? "empty" : _x;
            if (!options.match(new RegExp("\\b" + _x + "\\b", "igm"))) {
                _a.push(value);
            }
        });
        
        return _a;
    },
    replicate: function (character, nTimes, objArg) {
        var Replicate = {},
            paramTemplate = {
                paddingLeft: false,
                returnString: ""
            };
        
        nTimes = parseInt(nTimes);
        if (isNaN(nTimes) || nTimes === 0) {
            return "";
        }
        
        character = String(character);
        
        if (typeof(objArg) === "object") {
            Replicate = new simo.CustomObject(paramTemplate, objArg);
        }
        
        if (nTimes) {
            while (nTimes--) {
                Replicate.returnString = Replicate.paddingLeft ? (character + Replicate.returnString) : (Replicate.returnString + character);
            }
        }
        
        return Replicate.returnString;
    },
    has: {
        cssCalc: function () {
            var body = document.body || document.getElementsByTagName("body")[0];
            var div = document.createElement('div');
            div.id = "css3-calc-test";
            body.appendChild(div);
            var cssCalc = div.clientWidth === 6;
            body.removeChild(div);
            return cssCalc;
        },
        charInString: function (character, string) {
            return String(string).indexOf(character) >= 0;
        },
        localStorage: function () {
            store = null;
            
            //if cookie is not enabled local storage is also not accessible
            if (!simo.cookie.enabled()) {
                return false;
            }
            
            var fail,
                uid;
            try {
                uid = String(new Date);
                (store = window.localStorage).setItem(uid, uid);
                fail = store.getItem(uid) !== uid;
                store.removeItem(uid);
                fail && (store = false);
            } catch (exception) {
                return false;
            }
            
            if (!store) {
                store = {
                    setItem: function (key, value) {
                    },
                    getItem: function (key) {
                    },
                    removeItem: function (key) {
                    },
                    clear: function () {
                    }
                }
            } else if (fail) {
                console.error("It seems that your browser is currently in private mode!");
            }
            
            return store && !fail;
        }
    },
    remove: {
        storedItem: function (_key) {
            if (simo.hasStorage) {
                store.removeItem(_key)
            } else {
                simo.cookie.remove(_key)
            }
        }
    },
    to: {
        object: function (array, separator) {
            separator = (typeof(separator) === "string") ? simo.trim(separator) : false;
            return array.reduce(function (obj, item, i) {
                var key, value;
                if (separator && item.indexOf(separator) >= 0) {
                    var _pair = item.split(separator);
                    key = _pair[0];
                    value = _pair[1];
                } else {
                    key = i;
                    value = item;
                }
                obj[String(key)] = (simo.is.number(value) ? parseFloat(value) : value);
                return obj;
            }, {});
        }
    },
    notification: function(obj){
        var template = {
            message: '',
            autoHide: false,
            secondsTimeOut: 3,
            color: '',
            callBack: null,
            preventDuplicate: false
        };
        
        var notificationParams = new simo.CustomObject(template, obj);
        
        if (simo.is.empty(simo.previousNotification)) {
            simo.previousNotification = notificationParams.message
        } else if (notificationParams.preventDuplicate && notificationParams.message === simo.previousNotification) {
            return
        }
        
        simo.previousNotification = notificationParams.message;
        
        var sScript = document.querySelector('script'),
            body = document.querySelector('body');
        
        if (simo.is.htmlObject(sScript)) {
            var existingLink = document.querySelector('link[id="sImoUiNotification"]');
            
            if (!simo.is.htmlObject(existingLink)) {
                var link = document.createElement("link");
                link.id = "sImoUiNotification";
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = 'sImoJS/sImoNotification.css';
                
                sScript.parentNode.insertBefore(link, sScript);
            }
            
            if (!simo.is.htmlObject(body) || !simo.is.object(notificationParams) || (simo.is.object(notificationParams) && !notificationParams.message)) {
                console.log("sImo ui notification is missing required objects.");
                return;
            }
            
            var button = notificationParams.autoHide === true ? "" : '<div class="button">Close</div>',
                notification = document.createElement("div"),
                colorClass = notificationParams.color || "";
            
            notification.setAttribute("name", "sImo-ui-notification");
            notification.style.opacity = 0;
            notification.style.transform = "translate(0%, -110%)";
            
            notification.classList.add('transform');
            
            if (colorClass !== "") {
                notification.classList.add(colorClass);
            }
            
            notification.innerHTML = '<div class="notification" style="width: ' + (button !== "" ? "282px" : "100%" ) + '">' + notificationParams.message + '</div>' + button;
            
            var existingN = document.querySelectorAll("[name=sImo-ui-notification]");
            
            body.appendChild(notification);
            
            simo.after(200, function () {
                var clientHeight = notification.clientHeight;
                var clientWidth = notification.clientWidth + 2;
                
                notification.style.width = clientWidth + "px";
                notification.style.transform = "translate(0%, 0%)";
                notification.style.opacity = 1;
                
                var lastClientHeight = clientHeight + 10;
                
                for (var z2a = (existingN.length - 1); z2a >= 0; z2a--) {
                    var thisN = existingN[z2a];
                    thisN.style.transform = "translate(0%, " + lastClientHeight + "px)";
                    lastClientHeight += thisN.clientHeight + 10;
                }
                
                function slideOut() {
                    notification.style.transform = notification.style.transform.replace(/\d+.*,/, "110%,");
                    
                    simo.after(200, function () {
                        simo.removeAll(notification);
                        
                        var remainingN = document.querySelectorAll("[name=sImo-ui-notification]");
                        var lastClientHeight = 10;
                        
                        for (var z2a = (remainingN.length - 1); z2a >= 0; z2a--) {
                            var thisN = remainingN[z2a];
                            thisN.style.transform = "translate(0%, " + lastClientHeight + "px)";
                            lastClientHeight += thisN.clientHeight + 10;
                        }
                    });
                    
                    if (simo.is.function(notificationParams.callBack)) {
                        notificationParams.callBack();
                    }
                }
                
                if (button !== "") {
                    var b = notification.querySelector('.button');
                    
                    if (simo.is.number(clientHeight)) {
                        var p = parseInt((getComputedStyle(b).paddingBottom.match(/^\d+/) || [0])[0]) + parseInt((getComputedStyle(b).paddingTop.match(/^\d+/) || [0])[0]) || 0;
                        notification.querySelector('.button');
                    }
                    
                    b.onclick = function () {
                        slideOut();
                    }
                } else {
                    simo.after((notificationParams.secondsTimeOut || template.secondsTimeOut) * 1000, function () {
                        slideOut();
                    })
                }
            })
        }
    },
    init: {
        uiWidgets: function(callback) {
            var sImoUiThemeColorClass = ["white", "gray", "red", "blue", "green"];
            
            // code block
            var codeBlocks = document.querySelectorAll("code:not(.sImo-ui-code)");
            codeBlocks.forEach(function(c){
                c.innerHTML = c.innerHTML.replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/^\n*|\n*$/g, '').replace(/\n/gm, '<br/>').replace(/\ /gm, '&nbsp;');
                c.classList.add("sImo-ui-code")
            });
            
            var sScript = document.querySelector('script');
            
            var newLink = function(id, href){
                var lt = document.createElement("link");
                lt.id = id;
                lt.rel = "stylesheet";
                lt.type = "text/css";
                lt.href = href;
                return lt;
            };
            
            var componentExist = function(selectors){
                var found = false;
                for (var i in selectors) {
                    if (selectors.hasOwnProperty(i) && simo.is.htmlObject(document.querySelector(selectors[i]))){
                        found = true;
                        break;
                    }
                }
                
                return found;
            };
            
            if (simo.is.htmlObject(sScript)) {
                // sImo ui modal
                var existingLink = document.querySelector('link[id="sImoUiModal"]');
                var hasSimoUi = document.querySelectorAll('div[name=sImo-ui-modal]');
                var modal = document.querySelectorAll('div[name=sImo-ui-modal]:not(.sImo-ui-modal)');
                if (modal.length > 0) {
                    if (!simo.is.htmlObject(existingLink)) {
                        sScript.parentNode.insertBefore(newLink("sImoUiModal", "sImoJS/sImoModalWindow.css"), sScript);
                    }
                    
                    
                    modal.forEach(function(m){
                        var colorClass = "",
                            closeIcon = "",
                            fixedModal = m.classList.contains("fixed");
                        
                        if (m.classList.length > 0) { colorClass = " " + m.className.match(new RegExp(sImoUiThemeColorClass.join("|"), "i")) }
                        if (m.getAttribute("showCloseIcon") !== null) { closeIcon = '<div class="modal-close-button fadeIn' + colorClass + '"></div>' }
                        
                        m.innerHTML = closeIcon + '<div name="sImo-ui-div" class="' + m.className + ' center-absolute-block" title="' + m.title + '">' + m.innerHTML + '</div>';
                        
                        m.className = fixedModal ? "fixed" : "";
                        m.classList.add("sImo-ui-modal");
                        m.classList.add("fadeIn");
                        m.removeAttribute("title");
                        
                        if (closeIcon !== "") {
                            m.querySelector("div.modal-close-button").onclick = function(){
                                m.classList.add("fadeOut");
                                simo.after(1000, function () {
                                    simo.removeAll(m);
                                })
                            }
                        }
                    });
                } else if (existingLink && hasSimoUi.length === 0) simo.removeAll(existingLink);
                
                // sImo ui div container
                existingLink = document.querySelector('link[id="sImoUiDiv"]');
                hasSimoUi = document.querySelectorAll("div[name=sImo-ui-div]");
                var sImoUiDiv = document.querySelectorAll("div[name=sImo-ui-div]:not(.sImo-ui-div)");
                if (sImoUiDiv.length > 0) {
                    if (!simo.is.htmlObject(existingLink)) {
                        sScript.parentNode.insertBefore(newLink("sImoUiDiv", "sImoJS/sImoDivContainer.css"), sScript);
                    }
                    
                    sImoUiDiv.forEach(function (d) {
                        var ttl = simo.trim(d["title"]);
                        var divClass = "sImo-ui-div";
                        var divLabel = '<div class="sImo-ui-div-label">' + ttl + '</div>';
                        
                        if (ttl === "") {
                            divLabel = "";
                        }
                        
                        if (d.classList.contains("center-content")) {
                            divClass += " horizontal-center";
                        }
                        
                        d.className += " sImo-ui-div";
                        d.innerHTML = divLabel + '<div class="' + divClass + '">' + d.innerHTML + '</div>'
                    });
                } else if (existingLink && hasSimoUi.length === 0) simo.removeAll(existingLink);
                
                // sImo ui select
                existingLink = document.querySelector('link[id="sImoUiSelect"]');
                hasSimoUi = document.querySelectorAll('select');
                var sel = document.querySelectorAll('select:not(.sImo-ui-select)');
                if (sel.length > 0) {
                    if (!simo.is.htmlObject(existingLink)) {
                        sScript.parentNode.insertBefore(newLink("sImoUiSelect", "sImoJS/sImoSelect.css"), sScript);
                    }
                    
                    sel.forEach(function(select){
                        var selClass = "sImo-ui-select-wrapper",
                            colorClass = "",
                            specifiedWidth = select.getAttribute("width"),
                            longestLabel = "",
                            selectName = select.getAttribute("name") || simo.get.random({dataType: "alpha"}),
                            selectedLabel = "Select...",
                            disabled = select.disabled ? " disabled" : "",
                            liStr = "";
                        
                        if (select.classList.length > 0) {
                            colorClass = select.className.match(new RegExp(sImoUiThemeColorClass.join("|"), "i"));
                            selClass += (" " + select.className.replace(new RegExp(colorClass), '').trim());
                        }
                        
                        select.classList.add("sImo-ui-select");
                        select.setAttribute("name", selectName);
                        
                        for (var i = 0; i < select.options.length; i++) {
                            var opt = select.options[i],
                                className = "";
                            
                            if (longestLabel.length < opt.innerText.length) {
                                longestLabel = opt.innerText;
                            }
                            
                            if (opt.selected) {
                                selectedLabel = opt.innerText;
                                className = ' class="selected"';
                            }
                            
                            if (opt.attributes.length > 0) {
                                var attrStr = "";
                                Array.from(opt.attributes).forEach(function(a){
                                    attrStr += ' ' + a.name + '="' + a.value + '"';
                                });
                                liStr += '<li index="' + i + '"' + attrStr + className +'>' + opt.innerText + '</li>';
                            } else {
                                liStr += '<li index="' + i + '"' + attrStr + className +'>' + opt.innerText + '</li>';
                            }
                            
                        }
                        
                        select.outerHTML = '<div class="' + selClass + '"><div class="sImo-ui-select collapsed' + disabled + '"><div' +
                            ' class="select-label' + disabled + '"><span' +
                            ' class="select-label">' + selectedLabel + '</span><span class="sImo-ui-down-arrow-white select-icon"></span></div><ul class="select-options">' + liStr + '</ul>' + select.outerHTML + '</div></div>';
                        
                        var modifiedSelect = document.querySelector('select[name="' + selectName + '"]');
                        
                        modifiedSelect.parentNode.parentNode.setAttribute("style", 'width: ' + modifiedSelect.clientWidth + 'px');
                        
                        var clicker = modifiedSelect.parentNode.querySelector("div.select-label:not(.disabled)");
                        var ul = modifiedSelect.parentNode.querySelector('ul');
                        if (simo.is.htmlObject(clicker) && simo.is.htmlObject(ul)) {
                            var icon = modifiedSelect.parentNode.querySelector('span.select-icon');
                            
                            clicker.onclick = function() {
                                if (modifiedSelect.parentNode.classList.contains("collapsed")) {
                                    modifiedSelect.parentNode.classList.remove('collapsed');
                                    icon.classList.add("transform-180-neg")
                                } else {
                                    modifiedSelect.parentNode.classList.add('collapsed');
                                    icon.classList.remove("transform-180-neg")
                                }
                            };
                            
                            ul.onclick = function(ev){
                                var li = ev.target;
                                if (simo.is.htmlObject(li)) {
                                    var selected = ul.querySelector("li.selected"),
                                        idx = parseInt(li.getAttribute("index")) || 0;
                                    
                                    if (simo.is.htmlObject(selected)) {
                                        selected.classList.remove("selected");
                                    }
                                    
                                    li.classList.add("selected");
                                    
                                    var optionSelected = modifiedSelect.querySelector("option[selected]");
                                    if (simo.is.htmlObject(optionSelected)) {
                                        optionSelected.removeAttribute("selected");
                                    }
                                    
                                    var newOptionSelected = modifiedSelect.querySelector("option:nth-child(" + (idx + 1) + ")");
                                    if (simo.is.htmlObject(newOptionSelected)) {
                                        newOptionSelected.setAttribute("selected", "selected");
                                    }
                                    
                                    clicker.querySelector("span.select-label").innerText = li.innerText;
                                    
                                    modifiedSelect.parentNode.classList.add('collapsed');
                                    icon.classList.remove("transform-180-neg");
                                    
                                    if (simo.is.function(modifiedSelect.getAttribute('onchange'))) {
                                        modifiedSelect.onchange();
                                    }
                                }
                            }
                        }
                        
                        if (simo.is.array(colorClass)) { modifiedSelect.parentNode.classList.add(colorClass[0]); }
                        
                        if (specifiedWidth) {
                            modifiedSelect.parentNode.setAttribute("style", "width: " + specifiedWidth);
                            modifiedSelect.parentNode.parentNode.setAttribute("style", "width: " + specifiedWidth);
                        } else {
                            simo.after(100, function(){
                                var fontSize = getComputedStyle(modifiedSelect.parentNode.querySelector("li")).fontSize;
                                var tp = document.createElement("p");
                                tp.textContent = longestLabel;
                                tp.style.fontSize = fontSize;
                                tp.style.opacity = 0;
                                tp.style.float = "left";
                                document.querySelector("body").appendChild(tp);
                                var selWidth = 50 + tp.clientWidth;
                                
                                modifiedSelect.parentNode.setAttribute("style", "width: " + selWidth + "px");
                                modifiedSelect.parentNode.parentNode.setAttribute("style", "width: " + selWidth + "px");
                                simo.removeAll(tp);
                            });
                        }
                    })
                } else if (existingLink && hasSimoUi.length === 0) simo.removeAll(existingLink);
                
                // buttons
                existingLink = document.querySelector('link[id="sImoUiButton"]');
                if (componentExist(['input[type=button]', 'input[type=submit]', 'input[type=reset]', 'button', 'div.sImoButton'])) {
                    if (!simo.is.htmlObject(existingLink)) {
                        sScript.parentNode.insertBefore(newLink("sImoUiButton", "sImoJS/sImoButton.css"), sScript);
                    }
                } else if (existingLink) simo.removeAll(existingLink);
                
                // textFields
                existingLink = document.querySelector('link[id="sImoUiTextField"]');
                if (componentExist(['input[type=text]', 'input[type=email]', 'input[type=password]', 'textarea'])) {
                    if (!simo.is.htmlObject(existingLink)) {
                        sScript.parentNode.insertBefore(newLink("sImoUiTextField", "sImoJS/sImoTextField.css"), sScript);
                    }
                } else if (existingLink) simo.removeAll(existingLink);
                
                // checkbox & radio
                existingLink = document.querySelector('link[id="sImoUiCheckbox"]');
                var componentSelectors = ['input[type=radio]:not(.sImo-ui-radio)', 'input[type=checkbox]:not(.sImo-ui-checkbox):not([name=sImo-ui-switch])'];
                if (componentExist(componentSelectors)) {
                    if (!simo.is.htmlObject(existingLink)) {
                        sScript.parentNode.insertBefore(newLink("sImoUiCheckbox", "sImoJS/sImoCheckbox.css"), sScript);
                    }
                    
                    var randomString = simo.get.random({length: 4, dataType: "alpha"});
                    componentSelectors.forEach(function(selector){
                        document.querySelectorAll(selector).forEach(function(c){
                            var isRadio = c.getAttribute("type") === "radio",
                                attrNameForRadio = "simo-ui-radio";
                            var name = c.getAttribute("title") || "",
                                classNames = c.className,
                                componentClass = isRadio ? "sImo-ui-radio" : "sImo-ui-checkbox";
                            
                            if (isRadio) {
                                attrNameForRadio = c.getAttribute("name") || (attrNameForRadio + "-" + randomString);
                                c.setAttribute("name", attrNameForRadio);
                            }
                            
                            c.classList.add(componentClass);
                            
                            c.outerHTML = '<label class="' + componentClass + (c.disabled ? " disabled" : "") + '">' + name + c.outerHTML  + '<span class="' + componentClass + ' ' + classNames + '"></span></label>'
                        })
                    });
                } else if (existingLink) simo.removeAll(existingLink);
                
                // sImo ui switch
                existingLink = document.querySelector('link[id="sImoUiSwitch"]');
                hasSimoUi = document.querySelectorAll("input[type=checkbox][name=sImo-ui-switch]");
                var sImoUiSwitch = document.querySelectorAll("input[type=checkbox][name=sImo-ui-switch]:not(.sImo-ui-switch)");
                if (sImoUiSwitch.length > 0) {
                    if (!simo.is.htmlObject(existingLink)) {
                        sScript.parentNode.insertBefore(newLink("sImoUiSwitch", "sImoJS/sImoSwitch.css"), sScript);
                    }
                    
                    sImoUiSwitch.forEach(function (c) {
                        var ttl = "";
                        if (simo.trim(c.title) !== "") {
                            ttl = '<span class="' + c.className + '">' + c.title + '</span>';
                        }
                        
                        c.className = c.className + " sImo-ui-switch";
                        var cssClass = "sImo-ui-switch";
                        
                        if (c.disabled) {
                            cssClass += " disabled"
                        }
                        
                        c.outerHTML = '<div class="' + cssClass + '">' + c.outerHTML + '<div><div></div></div>' + ttl + '</div>'
                    })
                } else if (existingLink && hasSimoUi.length === 0) simo.removeAll(existingLink);
            }
            
            if (typeof callback === 'function') callback();
        }
    },
    set: {
        storeItem: function (key, value, daysExpired) {
            if (simo.hasStorage) {
                store.setItem(key, value)
            } else {
                simo.cookie.set(key, value, daysExpired);
            }
        }
    },
    send: {
        data: function (type, params, url, callback, synchronous, contentType, responseType) {
            var tidyResponse = {};
            
            if (type !== "POST" && type !== "PUT" && type !== "DELETE") {
                tidyResponse = {
                    status: 417,
                    statusText: 'Expectation Failed: Expecting POST, PUT or DELETE!  Got "' + type + '" instead.',
                    response: null
                };
                
                if (simo.is.function(callback)) {
                    callback(tidyResponse);
                } else {
                    return tidyResponse
                }
            }
            
            var isFormData = false;
            
            if (params.constructor.name === "FormData") {
                isFormData = true;
            } else if (type !== "DELETE" && (!simo.is.object(params) || simo.is.empty(params))) {
                tidyResponse = {
                    status: 417,
                    statusText: 'Expectation Failed: Request Parameter is not an instance of an Object!',
                    response: null,
                    params: params
                };
                
                if (simo.is.function(callback)) {
                    callback(tidyResponse);
                } else {
                    return tidyResponse
                }
            }
            
            synchronous = synchronous !== undefined && simo.get.type(synchronous) === "boolean" ? synchronous : false;
            var request = simo.get.xmlHttpObject();
            
            request.open(type, url, synchronous);
            
            if (!isFormData) { request.setRequestHeader("Content-Type", contentType || "application/json"); }
            
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (simo.get.type(callback) === "function") {
                        callback(simo.___tidyResponse(request));
                    } else {
                        return simo.___tidyResponse(request);
                    }
                }
            };
            
            request.send(params !== null && !isFormData ? JSON.stringify(params) : params);
        }
    },
    get: {
        parentNode: function(selector, el){
            var p, f = false;
            
            if (simo.is.htmlObject(el) && simo.is.string(selector)){
                p = el;
                while(simo.is.htmlObject(p) && !f && p.tagName.toLowerCase() !== 'body') {
                    if (p.getAttribute("name") === selector || p.getAttribute("id") === selector || p.classList.contains(selector)) {
                        f = true;
                        break;
                    }
                    
                    p = p.parentNode;
                }
            }
            
            if (f) { return p }
            return null;
        },
        formData: function(container, selectors){
            var data = {};
            selectors = selectors || ['input', 'textarea'];
            
            if (simo.is.htmlObject(container)) {
                var c = container.length ? container[0] : container;
                if (simo.is.htmlObject(c)) {
                    c.querySelectorAll(selectors).forEach(function (d) {
                        if (d.getAttribute("name")){
                            data[d.getAttribute("name")] = d.value;
                        }
                    })
                }
            }
            
            console.log("FormData:");
            console.log("---------");
            console.log(data);
            
            return data;
        },
        htmlElement: function (el, target) {
            var _container = document,
                _ret = [];
            if (!simo.is.empty(target)) {
                _container = el;
                el = target;
            }
            if (el === undefined) {
                return [];
            }
            function ___elementSeeker(_el) {
                if (typeof(_container) === "object" && String(Object.getPrototypeOf(_container).constructor.name).toLowerCase().indexOf("html") >= 0) {
                    _el = _container.querySelectorAll(_el);
                    if (simo.is.number(_el.length)) {
                        for (var a = 0, b = _el.length; a < b; a++) {
                            _ret.push(_el[a]);
                        }
                    } else {
                        _ret.push(_el);
                    }
                }
            }
            
            if (typeof(el) === "string") {
                //------------------------------------------------------------------------------------------------------
                //	check & get pseudo selector
                //	currently supported pseudo: first, nth(), last
                //------------------------------------------------------------------------------------------------------
                var _pseudo = [],
                    a, b;
                if (el.indexOf(":") >= 0) {
                    _pseudo = el.split(":");
                    el = _pseudo.splice(0, 1).join("");
                }
                //if(String(Object.getPrototypeOf(el).constructor.name).toLowerCase() === "nodelist"){
                //	for(var a = 0, b = el.length; a < b; a++){
                //		___elementSeeker(el[a]);
                //	}
                //}else{
                ___elementSeeker(el);
                //}
                if (_ret.length > 1 && _pseudo.length) {
                    var _ret_tmp = _ret;
                    _ret = [];
                    for (a = 0, b = _pseudo.length; a < b; a++) {
                        if (simo.get.type(_pseudo[a]) === "string") {
                            switch (_pseudo[a].replace(/[0-9]+/g, "")) {
                                case "first":
                                    _ret.push(_ret_tmp[0]);
                                    break;
                                case "last":
                                    _ret.push(_ret_tmp[(_ret_tmp.length - 1)]);
                                    break;
                                case "nth()":
                                    _ret.push(_ret_tmp[(parseInt(_pseudo[a].replace(/[^0-9]+/g, "")) || 1)]);
                                    break;
                            }
                        }
                    }
                }
                el = _ret;
            } else {
                if (!simo.is.empty(el) && simo.is.number(el.length)) {
                    for (a = 0, b = el.length; a < b; a++) {
                        _ret.push(el[a]);
                    }
                    el = _ret;
                }
            }
            if (!simo.is.empty(el) && (el.length === 1)) {
                el = el[0];
            }
            return !simo.is.empty(el) ? el : [];
        },
        imageSize: function (imgUrl) {
            //
            // might not work unless window has been fully loaded
            //
            
            var returnImage = {
                width: 0,
                height: 0
            };
            
            
            if (imgUrl === "none") {
                return returnImage
            }
            
            var img = document.createElement("img");
            img.name = "getImageSize";
            img.className = "hidden";
            img.src = imgUrl.replace(/url\(['"]*(.*\.\w+)['"]*\)/, "$1");
            
            document.querySelector("body").appendChild(img);
            img = document.querySelector('img[name="getImageSize"]');
            
            returnImage = {
                width: img.width,
                height: img.height
            };
            
            img.remove();
            
            return returnImage
        },
        randomChars: function (charSet, length) {
            while (length > charSet.length) charSet += charSet[Math.round(Math.random() * (charSet.length - 1))];
            return charSet[Math.round(Math.random() * (length - 1))]
        },
        randomNumber: function (max) {
            return Math.floor((Math.random() * max) + 1);
        },
        timeStamp: function(){
            "use strict";
            return new Date().getTime();
        },
        type: (function (global) {
            var cache = {};
            return function (obj) {
                var key;
                var ret = obj === null ? 'null' /* null */ : obj === global ? 'global' /* window in browser or global in nodejs */ : (key = typeof obj) !== 'object' ? key /* basic: string, boolean, number, undefined, function */ : obj.nodeType ? 'object' /* DOM element */ : cache[key = ({}).toString.call(obj)] /* cached. date, regexp, error, object, array, math */ || (cache[key] = key.slice(8, -1).toLowerCase());
                /* get XXXX from [object XXXX], and cache it */
                return ret.toString();
            };
        }(this)),
        camelCase: function (strToCamelCase) {
            strToCamelCase = simo.trim(strToCamelCase);
            // remove all characters that should not be in a variable name
            // as well as underscores an numbers from the beginning of the string
            var s = simo.trim(strToCamelCase.replace(/(^[_]|[^a-z_]*[^a-z_-]|[^a-z]+.$)/ig, " "));
            // uppercase letters following a space, underscore or hyphen
            s = s.replace(/([^a-z]+)(.)/ig, function (a, b, c) {
                return c.toUpperCase();
            });
            // lowercase letters followed by 2 or more uppercase letters
            s = s.replace(/([a-z])(\B[A-Z]{2,})/g, function (a, b, c) {
                return c.replace(/(\b[A-Z])(\B[A-Z].*)/g, function (d, e, f) {
                    return b + e + f.toLowerCase();
                });
            });
            return s;
        },
        storedItem: function (key) {
            _getter = function (_key) {
                if (simo.cookie.enabled()) {
                    if (simo.hasStorage) {
                        return store.getItem(_key)
                    } else {
                        return simo.cookie.get(_key);
                    }
                } else {
                    return "";
                }
                
            };
            
            var item;
            if (key instanceof Array) {
                //------------------------------------------------------------------------------------------------------
                //  return on any; not all
                //------------------------------------------------------------------------------------------------------
                var i = key.length,
                    found = false;
                while (i-- && !found) {
                    item = _getter(key[i]);
                    found = !simo.is.empty(item)
                }
            } else {
                item = _getter(key);
            }
            return item;
        },
        xmlHttpObject: function () {
            var xmlhttp = false,
                XMLHttpFactories = [
                    function () {
                        return new XMLHttpRequest()
                    },
                    function () {
                        return new ActiveXObject("Msxml2.XMLHTTP")
                    },
                    function () {
                        return new ActiveXObject("Msxml3.XMLHTTP")
                    },
                    function () {
                        return new ActiveXObject("Microsoft.XMLHTTP")
                    }
                ];
            for (var i = 0, len = XMLHttpFactories.length; i < len; i++) {
                try {
                    xmlhttp = XMLHttpFactories[i]();
                } catch (e) {
                    continue;
                }
                break;
            }
            return xmlhttp;
        },
        data: function (url, callback, synchronous, responseType) {
            synchronous = synchronous !== undefined && simo.get.type(synchronous) === "boolean" ? synchronous : false;
            var request = simo.get.xmlHttpObject();
            request.open('GET', url, synchronous);
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (simo.get.type(callback) === "function") {
                        callback(simo.___tidyResponse(request));
                    } else {
                        return simo.___tidyResponse(request);
                    }
                }
            };
            request.onerror = function() {
                var err = new TypeError(request.responseText || 'Network request failed');
                var retError = '{"status": "error", "message": "' + err.message + '"}';
                if (simo.get.type(callback) === "function") {
                    callback(retError);
                } else {
                    return retError;
                }
            };
            request.send(null)
        },
        random: function (type, objArg) {
            var alphaCharSet = "AaBbCcDdEeFfGgHhIiGjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
            
            var Random = {},
                returnObject = {
                    dataType:"alpha_numeric",
                    specials: true,
                    length: 8,
                    min: 0,
                    max: 20,
                    charSet: '0a1b2c3d4e5f6g7h8i9j1A2k3B4l5C6m7D8n9E1o2F3p4G5q6H7r8I9s1J2t3K4u5L6v7M8w9N0x1O2y3P4z5Q6R7S8T9!U!1_V_2+W+3!X!4+Y+5!Z!6!7+8+9'
                };
            
            if (simo.is.object(type)) { objArg = type }
            if (simo.is.object(objArg)) {
                Random = new simo.CustomObject(returnObject, objArg);
                
                returnObject.dataType = ((Random.dataType === "numeric") || (Random.dataType === "alpha_numeric") || (Random.dataType === "alpha")) ? Random.dataType : returnObject.dataType;
                returnObject.specials = Random.specials ? Random.specials : returnObject.specials;
                returnObject.length = simo.is.number(Random.length) ? parseInt(Random.length) : returnObject.length;
                returnObject.min = simo.is.number(Random.min) ? parseFloat(Random.min) : returnObject.min;
                returnObject.max = simo.is.number(Random.max) ? parseFloat(Random.max) : returnObject.max;
                returnObject.charSet = (Random.charSet === "string") ? Random.charSet : (Random.dataType === "alpha" ? alphaCharSet : returnObject.charSet);
                
                if (Random.dataType !== "numeric") { type = "string" }
            }
            
            type = ((type === "string") || (type === "array")) ? type : "string";
            if (!returnObject.specials) {
                returnObject.charSet = returnObject.charSet.split(/[_+!]/g).join("");
            }
            
            var result, i;
            if (type === "string") {
                result = "";
                for (i = returnObject.length; i > 0; --i) result += ((returnObject.dataType === "numeric") ? String(simo.get.randomNumber(9)) : simo.get.randomChars(returnObject.charSet, returnObject.length));
            } else {
                result = [];
                for (i = returnObject.min; i < returnObject.max; i++) result.push((returnObject.dataType === "numeric") ? simo.get.randomNumber(999) : simo.get.randomChars(returnObject.charSet, 999));
            }
            return result;
        },
        urlParams: function () {
            var href = simo.trim(window.location.href);
            if (href.indexOf("?") < 0) {
                return {};
            }
            
            href = href.split("?")[1].split("&");
            if (!href.length) {
                return {};
            }
            return simo.to.object(href, "=");
        },
        viewportSize: function () {
            return {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            }
        },
        objectWidth: function (obj) {
            if (typeof obj.clip !== "undefined") {
                return obj.clip.width;
            } else {
                if (obj.style.pixelWidth) {
                    return obj.style.pixelWidth;
                } else {
                    return obj.offsetWidth;
                }
            }
        },
        objectHeight: function (_obj) {
            if (typeof _obj.clip !== "undefined") {
                return _obj.clip.height;
            } else {
                if (_obj.style.pixelHeight) {
                    return _obj.style.pixelHeight;
                } else {
                    return _obj.offsetHeight;
                }
            }
        },
        elementDimension: function (arg) {
            arg = (typeof(arg) === "object") ? arg : document.getElementById(arg);
            return {
                width: simo.get.objectWidth(arg),
                height: simo.get.objectHeight(arg)
            };
        }
    },
    is: {
        elementInViewport: function (el) {
            var rect = el.getBoundingClientRect();
            
            return rect.bottom > 0 &&
                rect.right > 0 &&
                rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
                rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
        },
        string: function(obj){
            return simo.get.type(obj) === "string"
        },
        number: function(obj){
            return simo.get.type(obj) === "number"
        },
        boolean: function(obj){
            return simo.get.type(obj) === "boolean"
        },
        function: function(obj){
            return simo.get.type(obj) === "function"
        },
        object: function(obj){
            return simo.get.type(obj) === "object"
        },
        array: function(obj){
            return simo.get.type(obj) === "array"
        },
        htmlObject: function (obj) {
            if (obj === null || obj === "" || obj === undefined){
                return false;
            }
            switch (typeof obj) {
                case "object":
                    if ((Object.getPrototypeOf(obj).constructor.name || "").toLowerCase().match(/nodelist|html\w+|window/)) {
                        return !(obj.length !== undefined && obj.length < 1);
                    } else {
                        return false;
                    }
                    break;
                default:
                    return false;
            }
        },
        numeric: function (obj, strict) {
            if (simo.is.boolean(strict) ? strict : false) {
                return simo.is.number(obj)
            } else {
                return simo.is.number(obj) || (simo.is.string(obj) && obj.match(/^[-+]*\d+(,\d\d\d)*(\.\d+)*$/));
            }
        },
        mobile: function () {
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)))
        },
        tablet: function () {
            return navigator.userAgent.match(/iPad|Tablet/i) !== null;
        },
        decimal: function (n) {
            n = parseFloat(n);
            return simo.is.number(n) && n % 1 !== 0;
        },
        empty: function (obj, evalRule) {
            //--------------------------------------------------------------------------------------------------------------
            // Argument evalRule        [Optional]
            //
            //      validValues         true | strict       >>  Strict mode or Boolean Only mode > ignores non Boolean objects
            //                          loose               >>  Loose mode > evaluates false on undefined objets only
            //                                                  e.g. will only check if object or node exists
            //                          false               >>  Default mode > evaluates true on non-empty objects
            //--------------------------------------------------------------------------------------------------------------
            evalRule = (evalRule === true) || (evalRule === "strict") ? "strict" : (evalRule !== false) && (evalRule !== "loose" ) ? false : evalRule;
            var obj_type = typeof(obj), is_empty = true;
            
            if (evalRule === "strict") {
                is_empty = !((obj_type === "boolean") && (obj === true));
            } else if (evalRule === "loose") {
                is_empty = obj_type === "undefined";
            } else {
                switch (obj_type) {
                    case "boolean":
                        is_empty = !obj;
                        break;
                    case "nodelist":
                    case "array":
                    case "object":
                        //for (var name in obj) {
                        //  if (obj.hasOwnProperty(name)) {
                        is_empty = obj === null || false;
                        //  break;
                        //}
                        //}
                        break;
                    case "number":
                        is_empty = (obj < 1) || isNaN(obj);
                        break;
                    case "string":
                        is_empty = simo.trim(obj) === "";
                        break;
                    case "error":
                    case "date":
                    case "regexp":
                    case "function":
                        is_empty = false;
                        break;
                    default:
                    // default _empty eq true as declared above when type is non of the above
                }
            }
            return is_empty;
        }
    },
    cloneArray: function(array) {
        if (!simo.is.array(array)) {
            return [];
        }
        
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }
        
        return newArray
    },
    after: function(millisecondsTimeout, callback) {
        if (simo.is.number(millisecondsTimeout) && simo.is.function(callback)) {
            setTimeout(callback, millisecondsTimeout);
        }
    },
    htmlElement: function (el, callback) {
        el = simo.get.htmlElement(el);
        if (simo.is.htmlObject(el) && typeof(callback) === "function") {
            if (el.length) {
                for (var i in el) {
                    if (el.hasOwnProperty(i)) {
                        callback(el[i]);
                    }
                }
            } else {
                callback(el);
            }
        }
    },
    removeAll: function (el) {
        simo.htmlElement(el, function (el) {
            el.remove();
        })
    },
    fadeOut: function (el, callback) {
        //ToDo: Add validation on the el type; make sure el is an instance of a HTML Object or alike
        el = simo.get.htmlElement(el);
        function _fadeOut(_el) {
            simo.htmlElement(_el, function (this_el) {
                if (!this_el.classList.contains("fadeIn")) {
                    this_el.classList.add("fadeIn");
                }
                this_el.style.opacity = 1;
                (function fade() {
                    if ((this_el.style.opacity -= .1) < 0) {
                        this_el.style.display = "none";
                        if (typeof(callback) === "function") {
                            callback(this_el);
                        }
                    } else {
                        requestAnimationFrame(fade);
                    }
                })();
            })
        }
        if (el.length){
            for (var i in el){
                if (el.hasOwnProperty(i)) {
                    _fadeOut(el[i]);
                }
            }
        } else {
            _fadeOut(el);
        }
    },
    fadeIn: function (el, display, callback) {
        //ToDo: Add validation on the el type; make sure el is an instance of a HTML Object or alike
        el = simo.get.htmlElement(el);
        function _fadeIn(_el) {
            simo.htmlElement(_el, function (this_el) {
                callback = typeof(display) === "function" && typeof(callback) !== "function" ? display : callback;
                display = typeof(display) !== "function" ? display : typeof(callback) !== "function" ? callback : null;
                if (!this_el.classList.contains("fadeIn")) {
                    this_el.classList.add("fadeIn");
                }
                this_el.style.opacity = 0;
                this_el.style.display = display || "block";
                (function fade() {
                    var val = parseFloat(this_el.style.opacity);
                    if (!((val += .1) > 1)) {
                        this_el.style.opacity = val;
                        requestAnimationFrame(fade);
                    } else {
                        if (typeof(callback) === "function") {
                            callback(this_el);
                        }
                    }
                })();
            })
        }
        if (el.length){
            for (var i in el){
                if (el.hasOwnProperty(i)) {
                    _fadeIn(el[i]);
                }
            }
        } else {
            _fadeIn(el);
        }
    },
    coverOverlay: function (params, callback) {
        var cover_overlay = document.querySelector(".simo-overlay");
        var _action = simo.is.empty(cover_overlay) ? "show" : "destroy",
            bg_color = "0,0,0",
            bg_opacity = 0.5,
            _top = 0,
            _left = 0;
        
        switch (simo.get.type(params)) {
            case "string":
                _action = params === "refresh" || params === "show" || params === "destroy" ? params : _action;
                break;
            case "object":
                var template = {
                    action: _action,
                    backgroundRGB: bg_color,
                    opacity: bg_opacity,
                    top: _top,
                    left: _left
                };
                var coParams = new simo.CustomObject(template, params);
                
                _action = coParams.action === "refresh" || coParams.action === "show" || coParams.action === "destroy" ? coParams.action : _action;
                bg_color = coParams.backgroundRGB ? coParams.backgroundRGB : bg_color;
                bg_opacity = simo.is.number(coParams.opacity) ? parseFloat(coParams.opacity) : bg_opacity;
                _top = parseFloat(coParams.top) || _top;
                _left = parseFloat(coParams.left) || _left;
                break;
            case "function":
                callback = params;
        }
        var _browser_size = simo.get.viewportSize();
        
        switch (_action) {
            case "destroy":
                simo.fadeOut(cover_overlay, function (el) {
                    simo.removeAll(el);
                });
                break;
            case "refresh":
                if (!simo.is.empty(cover_overlay)) {
                    var _new_width = _browser_size.width - (parseFloat(getComputedStyle(cover_overlay).left) || 0),
                        _new_height = _browser_size.height - (parseFloat(getComputedStyle(cover_overlay).top) || 0);
                    cover_overlay.style.width = _new_width + "px";
                    cover_overlay.style.height = _new_height + "px";
                }
                break;
            case "show":
                if (simo.is.empty(cover_overlay)) {
                    var _body = document.body || document.getElementsByTagName("body")[0];
                    var _div = document.createElement('div');
                    _div.className = "simo-overlay fadeIn";
                    _div.style.position = "fixed";
                    _div.style.zIndex = topZIndex - 1;
                    _div.style.top = _top;
                    _div.style.left = _left;
                    _div.style.backgroundColor = ("rgba(" + bg_color + "," + bg_opacity + ")");
                    _div.style.width = "100%";
                    _div.style.height = "100%";
                    //_div.style.width = _browser_size.width + "px";
                    //_div.style.height = _browser_size.height + "px";
                    _body.appendChild(_div);
                }
        }
        if (typeof(callback) === "function") {
            cover_overlay = document.querySelector(".simo-overlay");
            callback(_action === "destroy" || (simo.is.htmlObject(cover_overlay) ? cover_overlay : null));
        }
    }
};

String.prototype.capitalize = String.prototype.capitalize || function(){
    return this.toLowerCase().replace(/^\w| \w/igm, function(a) {
        return a.toUpperCase()
    })
};

simo = new sImo();
simo.hasStorage = simo.has.localStorage();
simo.dataHandler = function(res, successCallback, failureCallback, hideSuccessNotification){
    var apiPath = res.responseUrl ? (res.responseUrl.split('api/')[1] || null) : null,
        message = '';
    
    if (apiPath) { apiPath = apiPath.split('?')[0] }
    
    log(res, (apiPath ? (apiPath + ' ') : '') + 'response [ dataHandler ]');
    
    switch (Math.floor(res.status / 100)) {
        case 0:
            simo.notification({
                message: "Network Access Failed!",
                color: 'red',
                secondsTimeOut: 5,
                preventDuplicate: true
            });
            if (simo.is.function(failureCallback)) {
                failureCallback(res);
            }
            return;
        case 2: // 2xx Success
            if (!hideSuccessNotification) {
                message = res.statusText ? (res.statusText.toLowerCase() === 'ok' ? 'Success' : res.statusText) : '';
                
                if (apiPath) {
                    message += ' » ' + apiPath
                }
                
                simo.notification({
                    message: message,
                    autoHide: true,
                    color: 'blue',
                    secondsTimeOut: 5
                })
            }
            successCallback(res.response);
            return;
        case 3: // 3xx Redirection
            //  ToDo: For Improvement
            break;
        case 4: // 4xx Client Error
            //  ToDo: For Improvement
            simo.notification({
                message: res.statusText + " » " + res.responseUrl.split('?')[0],
                color: 'red',
                secondsTimeOut: 5,
                preventDuplicate: true
            });
            if (simo.is.function(failureCallback)) {
                failureCallback(res);
            }
            return;
        case 5: // Server Error
            //  ToDo: For Improvement
            break;
        default: // unknown
        //  ToDo: For Improvement
    }
    
    var errMessage = '';
    if (res.response && res.response.errors && res.response.errors.length) {
        var mssg = '';
        res.response.errors.forEach(function(e){
            if (mssg !== '') { mssg += ', '; }
            if (e.type) { mssg += e.type.capitalize(); }
            if (e.message) { mssg += ((mssg !== '' ? ': ' : '') + e.message) }
        });
        
        if (mssg !== '') { errMessage = mssg }
    }
    
    if (errMessage === '') {
        errMessage = res.statusText;
    }
    
    simo.notification({
        message: errMessage,
        autoHide: true,
        color: 'red',
        secondsTimeOut: 5
    });
    
    if (simo.is.function(failureCallback)) {
        failureCallback(res.response)
    }
};

simo.___tidyResponse = function(response) {
    var tidyResponse = null;
    if (response && response.constructor.name.toLowerCase() === 'xmlhttprequest') {
        tidyResponse = {
            status: response.status,
            statusText: response.statusText,
            responseUrl: response.responseURL
        };
        
        var res = response.response || response.responseText;
        
        if (simo.is.empty(res)) {
            tidyResponse.response = null;
        } else if (simo.is.string(res)) {
            if (res.match(/<body.*>/igm) && res.match(/<\/body>/igm)) {
                // must be html
                tidyResponse.response = res;
            } else if (res.match(/{.*}/gm) || res.match(/\[.*\]/gm)) {
                tidyResponse.response = JSON.parse(res)
            } else {
                tidyResponse.response = res;
            }
        } else {
            tidyResponse.response = res;
        }
    } else {
        tidyResponse = {
            status: 503,
            statusText: 'Service Unavailable: Response is not an instance of XMLHttpRequest!',
            response: response
        }
    }
    
    return tidyResponse;
};

sImoUiNotification = [];

log = function (object, label) {
    if (label) {
        console.log("\n" + label);
        console.log('-'.repeat(label.length));
    }
    
    console.log(object)
};

error = function (object, label) {
    if (label) {
        console.error("\n" + label);
        console.error('-'.repeat(label.length));
    }
    
    console.error(object)
};

(function () {
    var sScript = null;
    
    // Sticky Background
    var stickyBg = null;
    var csImg = null;
    
    var fixedFooter = null;
    var sStickyBgLabel = null;
    var sStab = null;
    var sStabContent = null;
    var fontSize = 0;
    var fontUnit = "px";
    
    simo.mediaListHtmlString = function(index, img, name, address, description) {
        return '<div name="sImo-ui-div" class="fixed-fonts fadeIn ' + index + '"><div class="media"><img class="vertical-center" src="' + (img || "") + '"></div><div class="list"><div class="name">' + (name || "") + '</div><div class="address">' + (address || "") + '</div><div class="description">' + (description || "") +
            '</div></div></div>';
    };
    
    simo.initSMediaList = function (callback) {
        var mediaList = document.querySelector('div.media-list');
        
        if (!mediaList) { return }
        
        sScript = document.getElementsByTagName('script')[0];
        
        var sMedialList = document.createElement("link");
        sMedialList.rel = "stylesheet";
        sMedialList.type = "text/css";
        sMedialList.href = "sImoJS/sImoMediaList.css";
        
        sScript.parentNode.insertBefore(sMedialList, sScript);
        
        if (simo.is.function(callback)) {
            callback(mediaList);
        }
        
    };
    
    function updateBg() {
        if (simo.is.htmlObject(stickyBg) && csImg && csImg.width && csImg.width > 0) {
            
            log("updateBg");
            
            var sf = csImg.width / csImg.height;
            var viewport = simo.get.viewportSize();
            var nw = viewport.height * sf;
            
            stickyBg.setAttribute("style", "background-size: " + (nw >= viewport.width ? nw : viewport.width) + "px");
            
            if (simo.is.htmlObject(fixedFooter)) {
                fixedFooter.setAttribute("style", "top: " + (viewport.height - 50) + "px");
            }
            
            var smallerDimension = viewport.height < viewport.width ? viewport.height : viewport.width;
            var nfs = Math.round(smallerDimension / 12);
            
            if (simo.is.htmlObject(sStickyBgLabel)) {
                sStickyBgLabel.setAttribute("style", "font-size: " + nfs + fontUnit);
            }
        }
    }
    
    //
    // save window.onload from somewhere else
    //
    var inHtmlOnLoad = window.onload;
    
    window.onload = function() {
        sScript = document.getElementsByTagName('script')[0];
        
        if (sScript !== undefined) {
            var sImoCss = document.createElement("link");
            sImoCss.id = "sImoUi";
            sImoCss.rel = "stylesheet";
            sImoCss.type = "text/css";
            sImoCss.href = "sImoJS/simo.css";
            sScript.parentNode.insertBefore(sImoCss, sScript);
            
            //  initialize sImo ui
            simo.init.uiWidgets();
            
            if (simo.is.function(inHtmlOnLoad)) {
                log("windowOnLoad from html page");
                inHtmlOnLoad()
            }
            
            log("windowOnLoad from simo.js");
            
            stickyBg = document.querySelector('div.sImo-ui-sticky-background');
            if (simo.is.htmlObject(stickyBg)) {
                csImg = simo.get.imageSize(getComputedStyle(stickyBg).backgroundImage);
            }
            
            fixedFooter = document.querySelector('div[name="fixedFooter"]');
            
            sStickyBgLabel = document.querySelector('[name="sStickyBgLabel"]');
            if (simo.is.htmlObject(sStickyBgLabel)) {
                var cfs = getComputedStyle(sStickyBgLabel).fontSize;
                fontSize = parseInt(cfs.replace(/(\d+).*/, "$1"));
                fontUnit = cfs.replace(/\d+(.*)/, "$1");
            }
            
            updateBg();
            
            sStab = document.querySelectorAll('div[name="sTab"]:not(.sImo-ui-tab):not(.sImo-ui-tab-content)');
            sStabContent = document.querySelectorAll('div[name="sTab"].sImo-ui-tab-content');
            
        }
        
        simo.after(100, function(){
            document.querySelector("body").removeAttribute("style");
            document.querySelector("body").classList.add("fadeIn");
        });
    };
    
    
    var inHtmlOnResize = window.onresize;
    window.onresize = function(){
        if (simo.is.function(inHtmlOnResize)) {
            inHtmlOnResize()
        }
        
        updateBg();
    };
})();
