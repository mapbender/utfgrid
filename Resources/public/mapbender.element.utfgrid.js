(function($) {

$.widget("mapbender.mbUTFGrid", {
    options: {},

    _create: function() {
        var widget = this;
        this.widget = this;
        if(!Mapbender.checkTarget("mbUTFGrid", widget.options.target)) {
            return;
        }
        var element = widget.element;
        this.map = $('#' + this.options.target).data('mapbenderMbMap').map.olMap;
        widget.elementUrl = Mapbender.configuration.application.urls.element + '/' + element.attr('id') + '/';
        Mapbender.elementRegistry.onElementReady(widget.options.target, $.proxy(widget._setup, widget));
    },
    _setup: function(id) {
        var widget = this;

        var utfGridLayers = [];
        $.each(this.options.instances, function(idx, instances) {
            var utfGridLayer = new OpenLayers.Layer.UTFGridWMS( "Utfgrid_"+idx,
                instances.url,
                {layers: instances.layer, format:"application/json"},
                {utfgridResolution: 4, singleTile:true}
            );
            utfGridLayers.push(utfGridLayer);
        });
        this.map.addLayers(utfGridLayers);


        callback = function(infoLookup, lonLat, position) {
            if (position === undefined){
                return;
            }
            var popup = $('#utfgrid-popup');
            popup.html('');
            var msg = '';
            var hasContent = false;
            if (infoLookup) {
                    var layer, info;
                    for (var idx in infoLookup) {
                            layer = widget.map.layers[idx];
                            info = infoLookup[idx];
                            if (info && info.data) {
                                hasContent = true;
                                msg += "ID: " + info.id + "<br>";
                                for (var key in info.data) {
                                        msg += key + ": " + info.data[key] + "<br>";
                                }
                            }
                    }
            }

            if (!hasContent) {
                popup.addClass('hidden');
                return;
            }

            popup.html(msg);
            popup.css({top: position.y, left: position.x, position:'absolute'});
            popup.removeClass('hidden');
        };

        var utfGridControl = new OpenLayers.Control.UTFGrid({
                callback: callback,
                layers: utfGridLayers,
                handlerMode: "hover"
        });

        utfGridControl.findLayers = function() {
            var candidates = this.layers || this.map.layers;
            var layers = [];
            var layer;
            for (var i=candidates.length-1; i>=0; --i) {
                layer = candidates[i];
                if (layer instanceof OpenLayers.Layer.UTFGrid
                        || layer instanceof OpenLayers.Layer.UTFGridWMS ) {
                    layers.push(layer);
                }
            }
            return layers;
        };

        this.control = utfGridControl;
        this.map.addControl(utfGridControl);
        utfGridControl.deactivate();

        if (widget.options.autoActivate){ // autoOpen old configuration
            widget.activate();
        }
    },

    defaultAction: function() {
        this.activate();
    },
    activate: function() {
        var widget = this;
        widget.control.activate();
    },
    deactivate: function() {
        var widget = this;
        widget.control.deactivate();
        $('#utfgrid-popup').addClass('hidden');
    }

});

})(jQuery);

OpenLayers.Layer.UTFGridWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    /**
     * APIProperty: isBaseLayer
     * {Boolean} Default is false for UTFGridWMS layer
     */
    isBaseLayer: false,

    /**
    * Property: useJSONP
    * {Boolean}
    * Should we use a JSONP script approach instead of a standard AJAX call?
    *
    * Set to true for using utfgrids from another server.
    * Avoids same-domain policy restrictions.
    * Note that this only works if the server accepts
    * the callback GET parameter and dynamically
    * wraps the returned json in a function call.
    *
    * Default is false
    */
    useJSONP: false,

    /**
     * Property: tileClass
     * {<OpenLayers.Tile>} The tile class to use for this layer.
     *     Defaults is <OpenLayers.Tile.UTFGrid>.
     */
    tileClass: OpenLayers.Tile.UTFGrid,

    /**
     * Constructor: OpenLayers.Layer.UTFGridWMS
     * Create a new UTFGridWMS layer object
     *
     * Parameters:
     * name - {String} A name for the layer
     * url - {String} Base url for the WMS
     *                (e.g. http://wms.jpl.nasa.gov/wms.cgi)
     * params - {Object} An object with key/value pairs representing the
     *                   GetMap query string parameters and parameter values.
     * options - {Object} Hashtable of extra options to tag onto the layer.
     *     These options include all properties listed above, plus the ones
     *     inherited from superclasses.
     */
    initialize: function(name, url, params, options) {

        this.DEFAULT_PARAMS.format= "application/json";

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, arguments);


        this.tileOptions = OpenLayers.Util.extend({
            utfgridResolution: this.utfgridResolution
        }, this.tileOptions);
    },

    /**
     * Method: createBackBuffer
     * The UTFGrid cannot create a back buffer, so this method is overriden.
     */
    createBackBuffer: function() {},

    /**
     * APIProperty: getFeatureInfo
     * Get details about a feature associated with a map location.  The object
     *     returned will have id and data properties.  If the given location
     *     doesn't correspond to a feature, null will be returned.
     *
     * Parameters:
     * location - {<OpenLayers.LonLat>} map location
     *
     * Returns:
     * {Object} Object representing the feature id and UTFGrid data
     *     corresponding to the given map location.  Returns null if the given
     *     location doesn't hit a feature.
     */
    getFeatureInfo:function(location) {
        var info = null;
        var tileInfo = this.getTileData(location);
        if (tileInfo && tileInfo.tile) {
            info = tileInfo.tile.getFeatureInfo(tileInfo.i, tileInfo.j);
        }
        return info;
    },

    /**
     * APIMethod: getFeatureId
     * Get the identifier for the feature associated with a map location.
     *
     * Parameters:
     * location - {<OpenLayers.LonLat>} map location
     *
     * Returns:
     * {String} The feature identifier corresponding to the given map location.
     *     Returns null if the location doesn't hit a feature.
     */
    getFeatureId: function(location) {
        var id = null;
        var info = this.getTileData(location);
        if (info.tile) {
            id = info.tile.getFeatureId(info.i, info.j);
        }
        return id;
    },

    CLASS_NAME: "OpenLayers.Layer.UTFGridWMS"
});