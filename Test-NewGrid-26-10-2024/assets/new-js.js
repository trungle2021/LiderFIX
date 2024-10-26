(function () {
				var SQUARESPACE_SIZES = [1500, 1E3, 750, 500, 300, 100], IMAGE_LOADING_CLASS = "loading", ImageLoader = new function () {
				this.load = function (a, b) {
				function c(a, b, c) { var d = new Image; d.onload = b; d.onerror = c; d.src = a } a.getDOMNode && (a = a.getDOMNode()); var d = this._getDataFromNode(a, b), e = !(!d.dimensions || !d.dimensions.width || !d.dimensions.height), l = d.load + ""; if ("false" === l) return !1; var g = d.mode; if (e && ("fit" == g || "fill" == g)) {
				g = a.parentNode; if (!g) return console.error("Not doing anything, parentNode not found."), !1; if (!this.refresh(a,
				b, g)) return !1
				} var n = this._intendToLoad(a, d); if ("string" == typeof n && "viewport" !== l) {
				var m = this.getUrl(n, d), d = a.getAttribute("data-image-resolution"); a.getAttribute("src") !== m && this.isValidResolution(n, d) && (a.onload = function () { a.className = a.className.replace(IMAGE_LOADING_CLASS, " ").trim(); a.setAttribute("data-image-resolution", n) }, !a.getAttribute("src") && -1 === a.className.indexOf(IMAGE_LOADING_CLASS) && (a.className += (a.className ? " " : "") + IMAGE_LOADING_CLASS), !a.getAttribute("src") && e ? a.setAttribute("src",
				m) : c(m, function () { e ? a.setAttribute("src", m) : (a.setAttribute("data-image-dimensions", this.width + "x" + this.height), ImageLoader.load(a, b)) }, function () { a.className = a.className.replace(IMAGE_LOADING_CLASS, " ").trim(); a.setAttribute("src", m) })); return !0
				} return n
				}; this.refresh = function (a, b, c) {
				a.getDOMNode && (a = a.getDOMNode()); c && c.getDOMNode && (c = c.getDOMNode()); c = c || a.parentNode; if (!c) return console.error("Not doing anything, parentNode not found."), !1; var d = this._getDataFromNode(a, b), e = c.offsetWidth, l = c.offsetHeight;
				b = d.mode; if ("none" != b) {
				var g = d.dimensions.width, n = d.dimensions.height, m = g / n, q = e / l; if (d.fixedRatio) "fill" == b && q > m || "fit" == b && q < m ? (h = 100, k = 100 * (q / m), r = (100 - k) * d.focalPoint.y, p = 0) : (h = 100 * (m / q), k = 100, r = 0, p = (100 - h) * d.focalPoint.x), a.style.top = r + "%", a.style.left = p + "%", a.style.width = h + "%", a.style.height = k + "%"; else {
																																																																								var f; "fill" === b ? f = m > q ? l / n : e / g : "fit" === b && (f = m < q ? l / n : e / g); !d.stretch && ("fit" == b && 1 < f) && (f = 1); var h = Math.ceil(g * f), k = Math.ceil(n * f); if (0 === h || 0 === k) return !1; var p, r; "fill" === b ? (p = Math.min(Math.max(e /
				2 - h * d.focalPoint.x, e - h), 0), r = Math.min(Math.max(l / 2 - k * d.focalPoint.y, l - k), 0)) : "fit" === b && (f = d.fitAlignment, p = f.left ? 0 : f.right ? e - h : h < e ? (e - h) / 2 : 0, r = f.top ? 0 : f.bottom ? l - k : k < l ? (l - k) / 2 : 0, "inline" == this._getStyle(a, "display") && (a.style.fontSize = "0px"), this._resetAlt(a, function () { h -= a.offsetHeight - a.clientHeight; k -= a.offsetWidth - a.clientWidth })); a.style.top = Math.ceil(r) + "px"; a.style.left = Math.ceil(p) + "px"; a.style.width = Math.ceil(h) + "px"; a.style.height = Math.ceil(k) + "px"
				} p = this._getStyle(c, "position"); a.style.position =
				"relative" == p ? "absolute" : "relative"; if ("fill" == b && (b = this._getStyle(c, "overflow"), !b || "hidden" != b)) c.style.overflow = "hidden"; return !0
				}
				}; this._intendToLoad = function (a, b) {
				function c(c, d) {
				"none" === b.mode && (a.style.width = null, a.style.height = null); var e = parseFloat(a.getAttribute(c)), f = parseFloat(e); if (!f || isNaN(f)) e = g._getStyle(a, c), f = parseFloat(e); if (!f || isNaN(f)) e = g._getStyle(a, "max-" + c, "max" + (c.substr(0, 1).toUpperCase() + c.substr(1))), f = parseFloat(e); if (0 === d || e) switch (g._stringType(e)) {
				case "percentage": d =
				parseInt(e, 10) / 100 * l["offset" + c.substr(0, 1).toUpperCase() + c.substr(1)]; break; case "number": d = parseInt(e, 10)
				} !f && (0 !== d && !a.getAttribute("src")) && (d = 0); return d
				} b = b || this._getDataFromNode(a); if (!b.source) return !1; var d = a.offsetWidth, e = a.offsetHeight, l = a.parentNode, g = this; this._resetAlt(a, function () { d = c("width", d); e = c("height", e) }); 0 === d && 0 === e ? (d = b.dimensions.width, e = b.dimensions.height) : 0 === d ? d = this.getDimensionForValue("width", e, b) : 0 === e && (e = this.getDimensionForValue("height", d, b)); "viewport" ===
				b.load && (a.style.width = Math.floor(d) + "px", a.style.height = Math.floor(e) + "px"); return this.getSquarespaceSize(d, e, b)
				}; this._getDataFromNode = function (a, b) {
				b = b || {}; var c = { focalPoint: { x: 0.5, y: 0.5 }, dimensions: { width: null, height: null }, mode: "none", fitAlignment: { center: !0 }, load: "true", stretch: !0, fixedRatio: !1 }; if (b.focalPoint) c.focalPoint = b.focalPoint; else { var d = a.getAttribute("data-image-focal-point"); if (d && (d = d.split(",")) && 2 == d.length) c.focalPoint = { x: parseFloat(d[0]), y: parseFloat(d[1]) } } if (b.dimensions) c.dimensions =
				b.dimensions; else if ((d = a.getAttribute("data-image-dimensions")) && (d = d.split("x")) && 2 == d.length) c.dimensions = { width: parseInt(d[0], 10), height: parseInt(d[1], 10) }; b.mode ? c.mode = b.mode : a.parentNode && (d = a.parentNode.className, -1 !== d.indexOf("content-fill") ? c.mode = "fill" : -1 !== d.indexOf("content-fit") && (c.mode = "fit")); if ("fit" === c.mode && a.parentNode && (d = b.fitAlignment || a.getAttribute("data-alignment") || a.parentNode.getAttribute("data-alignment"))) c.fitAlignment = {
				top: -1 !== d.indexOf("top"), left: -1 !== d.indexOf("left"),
				center: -1 !== d.indexOf("center"), right: -1 !== d.indexOf("right"), bottom: -1 !== d.indexOf("bottom")
				}; if (b.load) c.load = b.load; else if (d = a.getAttribute("data-load")) c.load = d; if ("undefined" !== typeof b.stretch) c.stretch = b.stretch; else if (d = a.getAttribute("data-image-stretch")) c.stretch = "true" === d ? !0 : !1; c.source = b.source ? b.source : a.getAttribute("data-src"); if (c.source && (-1 !== c.source.indexOf("squarespace.com") || -1 !== c.source.indexOf("squarespace.net")) && "http:" === c.source.substr(0, 5) && "https" === window.location.protocol.substr(0,
				5)) c.source = c.source.replace("http://", "https://"); if (b.fixedRatio) c.fixedRatio = b.fixedRatio; else if (d = a.getAttribute("data-fixed-ratio")) c.fixedRatio = "true" == d; return c
				}; this._stringType = function (a) { return "string" === typeof a && -1 !== a.indexOf("%") ? "percentage" : isNaN(parseInt(a, 10)) ? NaN : "number" }; this._getStyle = function (a, b, c) { var d; a.currentStyle ? d = a.currentStyle[c || b] : window.getComputedStyle && (d = document.defaultView.getComputedStyle(a, null).getPropertyValue(b)); return d }; this._isVisible = function (a) {
				a =
				a.getBoundingClientRect(); return 0 <= a.left && 0 <= a.top || 0 <= a.bottom && 0 <= a.right || 0 <= a.left && 0 <= a.bottom || 0 <= a.right && 0 <= a.top
				}; this.getSquarespaceSize = function (a, b, c) { a = Math.max(b / (c.dimensions.height / c.dimensions.width), a); "undefined" === typeof app && "number" === typeof window.devicePixelRatio && (a *= window.devicePixelRatio); for (b = 1; b < SQUARESPACE_SIZES.length && !(a > SQUARESPACE_SIZES[b]) ; b++); return SQUARESPACE_SIZES[b - 1] + "w" }; this.getDimensionForValue = function (a, b, c) {
				var d = c.dimensions.width; c = c.dimensions.height;
				return "width" == a ? d / c * b : "height" == a ? c / d * b : NaN
				}; this.getUrl = function (a, b) { var c = b.source; return a && ("/" == c[0] || -1 != c.indexOf("squarespace.com") || -1 != c.indexOf("squarespace.net")) ? (-1 === c.indexOf("format=" + a) && (c = c + (-1 !== c.indexOf("?") ? "&" : "?") + "format=" + a), window.Static && (window.Static.IN_BACKEND && -1 === c.indexOf("storage=local")) && (c += "&storage=local"), c) : b.source }; this.isValidResolution = function (a, b) { a = parseInt(a, 10); b = parseInt(b, 10); return isNaN(a) || isNaN(b) ? !0 : a > b }; this._resetAlt = function (a, b) {
				var c =
				a.getAttribute("alt"), d = c && 0 < c.length && !a.getAttribute("src"); if (d) { var e = a.style.display; a.removeAttribute("alt"); a.style.display = "none"; a.offsetHeight + 0; a.style.display = e } b.call(this); d && a.setAttribute("alt", c)
																										}; this.bootstrap = function () {
																										var a = document.images; if (0 < a.length) for (var b = 0, c = a.length; b < c; b++) ((a[b].hasAttribute ? a[b].hasAttribute("data-image") : a[b].attributes["data-image"]) || (a[b].hasAttribute ? a[b].hasAttribute("data-src") : a[b].attributes["data-src"])) && "false" !== (a[b].getAttribute ? a[b].getAttribute("data-load") :
																																																																	 a[b].attributes["data-load"]) + "" && ImageLoader.load(a[b])
																																																																	 }
																																																																	 }; window.ImageLoader = ImageLoader; window.YUI && YUI.add("squarespace-imageloader", function (a) { });
																																																																	 })();