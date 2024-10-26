Y.use(["node", "squarespace-gallery-ng", "squarespace-util"], function() {
    Y.namespace("Supply");
    Y.Supply.Site = Singleton.create({
        ready: function() {
            Y.on("domready", this.initialize, this)
        },
        initialize: function() {
            Function("/*@cc_on return document.documentMode\x3d\x3d\x3d10@*/")() && (document.documentElement.className += " ie10");
            this._emptyNav();
            Y.one(".collection-type-products") && this._initProducts();
            Y.one("#main .masonry-item") && this._initMasonry({
                width: Y.one(".collection-type-index") ? parseInt(Y.Squarespace.Template.getTweakValue("indexColumnWidth"),
                    10) : parseInt(Y.Squarespace.Template.getTweakValue("productColumnWidth"), 10),
                gutter: Y.one(".collection-type-index") ? parseInt(Y.Squarespace.Template.getTweakValue("indexGutter"), 10) : parseInt(Y.Squarespace.Template.getTweakValue("productGutter"), 10)
            });
            this.bindUI();
            this.syncUI();
            Y.one(".products-collection") && Y.all(".products-collection").removeClass("loading");
            Y.one("#flowContent .flow-back") && Y.one(".flow-back").removeClass("loading");
            Y.one("#flowContent") && Y.one("#flowContent").removeClass("loading");
            Y.one(".masonry-container") && Y.one(".masonry-container").removeClass("loading");
            Y.one("#header .lower-header").removeClass("loading");
            Y.one("#header \x3e .wrapper").removeClass("loading")
        },
        bindUI: function() {
            (new Y.Squarespace.ResizeEmitter({
                timeout: 100
            })).on("resize:end", this.syncUI, this);
            Y.one("#navOpen").on("click", function(a) {
                a.halt();
                Y.one("body").addClass("nav-opened")
            });
            Y.one("#navClose").on("click", function(a) {
                a.halt();
                Y.one("body").removeClass("nav-opened")
            });
            Y.one("#canvasOverlay").on("click",
                function(a) {
                    a.halt();
                    Y.one("body").removeClass("nav-opened")
                });
            Y.one("#header").delegate("click", function(a) {
                Y.one(".folder-links-collapsible") && (a.preventDefault(), this._toggleFolder(a.currentTarget.get("parentNode")))
            }, ".folder-collection \x3e a", this);
            Y.one(".collection-type-products") && this._bindProducts();
            Y.one(".collection-type-gallery") && this._bindGallery()
        },
        syncUI: function() {
            if (Y.one(".site-vertical-alignment-middle") && 1024 < Y.config.win.innerWidth) {
                var a = Y.one("#header \x3e .wrapper");
                a.toggleClass("middle",
                    Y.config.win.innerHeight > a.get("offsetHeight"))
            }
            this._positionLowerHeader();
            Y.one(".sqs-announcement-bar") && this._setMobileAnnouncementPosition();
            Y.one(".masonry-item") && this._syncMasonry();
            Y.one(".collection-type-products") && this._syncProducts();
            Y.one(".collection-type-index");
            Y.one("#flowItems .flow-item") && this._syncFlow();
            this.masonry && this.masonry.refresh();
            this._imgLoad()
        },
        _initProducts: function() {
            Y.all(".products-child .active-link").each(function(a) {
                a.ancestor(".products-collection").removeClass("active-link")
            });
            var a = Y.config.win.location;
            if (Y.one(".view-item")) {
                var b = Y.one(".flow-back");
                b.setAttribute("href", b.getAttribute("href") + a.search);
                0 < a.search.length && b.setHTML(decodeURI(a.search.substr(a.search.indexOf("\x3d") + 1)))
            }
        },
        _initMasonry: function(a) {
            this.masonry = new Y.Squarespace.Gallery2({
                container: Y.one(".masonry-container"),
                element: Y.all(".masonry-item"),
                design: Y.one(".collection-type-index.index-aspect-ratio-auto") || Y.one(".collection-type-products.product-aspect-ratio-auto") ? "autocolumns" : "autogrid",
                designOptions: {
                    columnWidth: a.width,
                    columnWidthBehavior: "min",
                    gutter: a.gutter,
                    aspectRatio: !1,
                    mixedContent: !0
                },
                loaderOptions: {
                    load: !1
                },
                lazyLoad: !1,
                refreshOnResize: !0
            })
        },
        _bindProducts: function() {
            Y.one("#flowBody") && (Y.one("#flowBodyOpen").on("click", function(a) {
                a.preventDefault();
                Y.one("body").addClass("flow-body-active")
            }), Y.one("#flowBodyClose").on("click", function(a) {
                a.preventDefault();
                Y.one("body").removeClass("flow-body-active")
            }))
        },
        _bindGallery: function() {
            Y.one("#flowItems .flow-item-info") && Y.one("#flowItems").delegate("click",
                function(a) {
                    a.preventDefault();
                    this.ancestor(".flow-item").toggleClass("active").siblings().removeClass("active")
                }, ".flow-item.has-info .button-expand")
        },
        _syncMasonry: function() {
            this._setContentHeight();
            var a = "product";
            Y.one(".collection-type-index") && (a = "index");
            Y.one("." + a + "-aspect-ratio-auto") ? this.masonry.refreshContentMode(null) : this.masonry.refreshContentMode("fill")
        },
        _syncIndex: function() {
            this._setGutter(parseInt(Y.Squarespace.Template.getTweakValue("indexGutter"), 10))
        },
        _syncProducts: function() {
            Y.one(".view-list") &&
                this._setGutter(parseInt(Y.Squarespace.Template.getTweakValue("productGutter"), 10))
        },
        _syncFlow: function() {
            var a = Y.one("#flowItems"),
                b = Y.one("#flowContent"),
                c = this._predictFlowItemsHeight();
            640 < Y.config.win.innerWidth ? b.get("offsetHeight") > Y.config.win.innerHeight ? (b.setAttribute("style", ""), Y.one("body").addClass("force-vertical-alignment-top"), c ? a.setAttribute("style", "") : a.setStyle("position", "fixed")) : (Y.one("body").removeClass("force-vertical-alignment-top"), c && (b.setStyle("position", "fixed"),
                a.setAttribute("style", ""))) : (Y.one("body").removeClass("force-vertical-alignment-top"), a.setAttribute("style", ""), b.setAttribute("style", ""));
            Y.one(".site-vertical-alignment-middle") && 1024 < Y.config.win.innerWidth ? (Y.one(".collection-type-gallery") && !Y.one(".gallery-single-image-fill") || Y.one(".collection-type-products") && !Y.one(".product-item-single-image-fill") || Y.one(".flow-item:nth-child(2)")) && a.toggleClass("middle", !c) : a.removeClass("middle");
            if ((Y.one(".collection-type-gallery") && Y.one(".gallery-single-image-fill") ||
                    Y.one(".collection-type-products") && Y.one(".product-item-single-image-fill")) && 1 === Y.all(".flow-item").size()) 640 < Y.config.win.innerWidth ? (Y.one("body").addClass("flow-items-fill"), Y.one(".flow-item").addClass("content-fill")) : (Y.one("body").removeClass("flow-items-fill"), Y.one(".flow-item").removeClass("content-fill"), Y.one(".flow-item img").setAttribute("style", ""))
        },
        _setMobileAnnouncementPosition: function() {
            if (1024 >= Y.config.win.innerWidth) {
                var a = Y.one(".sqs-announcement-bar").get("offsetHeight");
                Y.one("#under").setStyle("top", a)
            } else Y.one("#under").setAttribute("style", "")
        },
        _predictFlowItemsHeight: function() {
            for (var a = 0, b = Y.all(".flow-item img"), c = 0; c < b.size(); c++) {
                var e = b.item(c),
                    d = e.getAttribute("data-image-dimensions"),
                    d = parseFloat(d.split("x")[1] / d.split("x")[0]),
                    a = a + (d * parseFloat(e.getComputedStyle("width")) + parseFloat(e.get("parentNode").getStyle("marginBottom")));
                if (a > Y.config.win.innerHeight) return !0
            }
            return !1
        },
        _setGutter: function(a) {
            this.masonry && (10 > a ? this.masonry.set("gutter",
                a) : 25 > a ? 640 >= Y.config.win.innerWidth ? this.masonry.set("gutter", 10) : this.masonry.set("gutter", a) : 640 >= Y.config.win.innerWidth ? this.masonry.set("gutter", 10) : 1024 >= Y.config.win.innerWidth ? this.masonry.set("gutter", 25) : this.masonry.set("gutter", a))
        },
        _setContentHeight: function() {
            if (Y.one(".product-list-style-catalog.collection-type-products") && !Y.one(".product-aspect-ratio-auto") || Y.one(".index-list-title-style-under.collection-type-index") && !Y.one(".index-aspect-ratio-auto"))
                if (640 < Y.config.win.innerWidth) {
                    var a =
                        0;
                    Y.all(".masonry-content").each(function(b) {
                        b.get("clientHeight") > a && (a = b.get("clientHeight"))
                    });
                    Y.all(".masonry-content").setStyle("height", a)
                } else Y.one(".masonry-content").getAttribute("style") && Y.all(".masonry-content").each(function(a) {
                    a.setAttribute("style", "")
                });
            else Y.one(".masonry-content").getAttribute("style") && Y.all(".masonry-content").each(function(a) {
                a.setAttribute("style", "")
            })
        },
        _toggleFolder: function(a) {
            a.hasClass("folder-closed") ? (a.addClass("folder-opened"), a.removeClass("folder-closed")) :
                a.hasClass("folder-opened") ? (a.removeClass("folder-opened"), a.addClass("folder-closed")) : a.hasClass("active-folder") ? a.addClass("folder-closed") : a.addClass("folder-opened");
            this._positionLowerHeader()
        },
        _positionLowerHeader: function() {
            if (1024 < Y.config.win.innerWidth && Y.one(".site-vertical-alignment-top")) {
                var a = Y.one("#header \x3e .wrapper"),
                    b = Y.one("#header .lower-header"),
                    a = b.hasClass("bottom") ? b.get("offsetHeight") + a.get("offsetHeight") : a.get("offsetHeight");
                b.toggleClass("bottom", Y.config.win.innerHeight >
                    a)
            }
        },
        _emptyNav: function() {
            Y.one("#navOpen") && (!Y.one(".navigation li") && !Y.one(".navigation-secondary li")) && Y.one("#navOpen").addClass("empty")
        },
        _imgLoad: function(a, b) {
            b = b || null;
            Y.all((a || "body") + ' img[data-src]:not([data-load\x3d"false"])').each(function(a) {
                ImageLoader.load(a, {
                    mode: b
                })
            })
        }
    })
});