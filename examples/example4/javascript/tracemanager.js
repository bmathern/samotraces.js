/*
 * Modelled Trace API
 *
 * This file is part of ktbs4js.
 *
 * ktbs4js is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * ktbs4js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with ktbs4js.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        window.tracemanager = factory(jQuery);
    }
}(function ($) {
    /**
     * @constant
     * @desc If there are more than MAX_FAILURE_COUNT synchronisation failures, then disable synchronisation
     */
    var MAX_FAILURE_COUNT = 20;

    /**
     * @constant
     * @desc If there are more than MAX_BUFFER_SIZE obsels in the buffer, then "compress" them as a single "ktbsFullBuffer"
     */
    var MAX_BUFFER_SIZE = 500;

    /** Log a message
     */
    function logmsg() {
        if (window.console) {
            window.console.log.apply(console, [ "ktbs4js" ].concat([].slice.call(arguments)));
        }
    };

    /**
     * @name BufferedService
     * @class
     * @constructor
     * @param {string} url: the Trace url
     * @param {string} mode: the HTTP method to use ("GET" or "POST")
     * @param {string} format: the serialization format ("json", "json-compact", "turtle")
     * @param {boolean} handshake: if true, send an initial handshake to the server
     *
     * @desc It takes care of enqueuing obsels and sending them possibly in batches to the server.
     */
    function BufferedService(url, mode, format, handshake) {
        this.url = url;
        this.buffer = [];
        this.isReady = !handshake;
        this.timer = null;
        this.failureCount = 0;
        // sync_mode is either "none", "sync" or "buffered"
        this.sync_mode = "none";
        /* mode can be either POST or GET */
        if (mode == 'POST' || mode == 'GET')
            this.mode = mode;
        else
            this.mode = 'POST';
        /* Data format */
        this.format = (this.mode === 'GET' ? 'json-compact' : 'json');
        if (format !== undefined)
            this.format = format;
        /* Flush buffer every timeOut ms if the sync_mode is delayed */
        this.timeOut = 2000;
    };

    BufferedService.prototype = /** @lends BufferedService.prototype */ {
        // url: "",
        // buffer: [],
        // isReady: false,
        // timer: null,
        // failureCount: 0,

        /**
         * Flush buffer
         */
        flush: function() {
            // FIXME: add mutex on this.buffer
            if (! this.isReady)
            {
                logmsg("Sync service not ready");
            } else if (this.failureCount > MAX_FAILURE_COUNT)
            {
                logmsg("Too many failures, disabling trace synchronisation");
                // Disable synchronisation
                this.set_sync_mode('none');
            } else if (this.buffer.length) {
                var temp = this.buffer;
                this.buffer = [];
                var content_type = 'application/json';
                var data;

                if (this.format === 'turtle') {
                    content_type = "text/turtle";
                    data = [ "@prefix : <http://liris.cnrs.fr/silex/2009/ktbs#>.\n",
                             // Assume that the model for a trace has for URI <trace_uri> + "model#"
                             "@prefix m: <model#>.\n" ]
                        .concat(temp.map(function(o) { return o.toTurtle(); }))
                        .join("\n");
                } else if (this.format === 'json-compact') {
                    content_type = "application/x-json-compact";
                    // We mark the "compressed" nature of the
                    // generated JSON by prefixing it with c
                    data = 'c' + JSON.stringify(temp.map(function (o) { return o.toCompactJSON(); }));
                    // Swap " (very frequent, which will be
                    // serialized into %22) and ; (rather rare), this
                    // saves some bytes
                    data = data.replace(/[;"#]/g, function(s){ return s == ';' ? '"' : ( s == '"' ? ';' : '%23'); });
                } else {
                    // Default format: json
                    data = JSON.stringify(temp.map(function (o) { return o.toJSON(); }));
                }

                if (this.mode == 'GET')
                {
                    data = "post=" + encodeURIComponent(data);
                    if (content_type !== 'application/x-json-compact')
                        data = 'content-type=' + content_type + '&' + data;
                    // FIXME: check data length (< 2K is safe)
                    var request=$('<img />').error( function() { this.failureCount += 1; })
                        .load( function() { this.failureCount = 0; })
                        .attr('src', this.url + '?' + data);
                }
                else
                {
                    $.ajax({ url: this.url,
                             type: 'POST',
                             contentType: content_type,
                             data: data,
                             processData: false,
                             // Type of the returned data.
                             dataType: "text",
                             error: function(jqXHR, textStatus, errorThrown) {
                                 logmsg("Error when sending buffer:", textStatus + ' ' + JSON.stringify(errorThrown));
                                 this.failureCount += 1;
                             },
                             success: function(data, textStatus, jqXHR) {
                                 // Reset failureCount to 0 as soon as there is 1 valid answer
                                 this.failureCount = 0;
                             }
                           });
                }
            }
        },

        /**
         * Set sync mode: "delayed", "sync" (immediate sync), "none"
         * (no synchronisation with server, the trace has to be
         * explicitly saved if needed).
         * @param {string} mode: "delayed", "sync" or "none"
         * @param {string} default_subject: Default subject id
         */
        set_sync_mode: function(mode, default_subject) {
            this.sync_mode = mode;
            if (! this.isReady && mode !== "none")
                this.init(default_subject);
            if (mode == 'delayed') {
                this.start_timer();
            } else {
                this.stop_timer();
            }
        },

        /**
         * Enqueue an obsel
         * @param {Obsel} obsel: the obsel to enqueue
         **/
        enqueue: function(obsel) {
            if (this.buffer.length > MAX_BUFFER_SIZE)
            {
                obsel = new Obsel(undefined, 'ktbsFullBuffer', this.buffer[0].begin,
                                  this.buffer[this.buffer.length - 1].end, this.buffer[0].subject);
                obsel.trace = this.buffer[0].trace;
                this.buffer = [];
            }
            this.buffer.push(obsel);
            if (this.sync_mode === 'sync') {
                // Immediate sync of the obsel.
                this.flush();
            }
        },

        /**
         * Start the timer for delayed sync
         */
        start_timer: function() {
            var self = this;
            if (this.timer === null) {
                this.timer = window.setInterval(function() {
                    self.flush();
                }, this.timeOut);
            }
        },

        /**
         * Stop the timer for delayed sync
         */
        stop_timer: function() {
            if (this.timer !== null) {
                window.clearInterval(this.timer);
                this.timer = null;
            }
        },

        /**
         * Initialize the sync service
         * @param {string} default_subject: the default subject
         */
        init: function(default_subject) {
            var self = this;
            if (this.isReady)
                /* Already initialized */
                return;
            if (typeof default_subject === 'undefined' || default_subject === "")
            {
                this.isReady = true;
                return;
            }
            if (this.mode == 'GET')
            {
                var request=$('<img/>').attr('src', this.url + 'login?userinfo={"default_subject": "' + default_subject + '"}');
                // Do not wait for the return, assume it is
                // initialized. This assumption will not work anymore
                // if login returns some necessary information
                this.isReady = true;
            }
            else
            {
                $.ajax({ url: this.url + 'login',
                         type: 'POST',
                         data: 'userinfo={"default_subject":"' + default_subject + '"}',
                         success: function(data, textStatus, jqXHR) {
                             self.isReady = true;
                             if (self.buffer.length) {
                                 self.flush();
                             }
                         }
                       });
            }
        }
    };

    /**
     * @name Trace
     * @class
     * @constructor
     * @param {string} uri: the Trace uri
     * @param {string} mode: the access mode ("r", "w" or "rw")
     * @param {string} requestmode: the HTTP method used for synchronization ("GET" or "POST")
     * @param {string} format: the serialization format (see {@link BufferedService})
     * @param {boolean} handshake: see {@link BufferedService}
     */
    function Trace(uri, mode, requestmode, format, handshake) {
        /* FIXME: We could/should use a sorted list such as
           http://closure-library.googlecode.com/svn/docs/class_goog_structs_AvlTree.html
           to speed up queries based on time */
        this.obsels = [];
        /* Trace URI */
        if (uri === undefined)
            uri = "";
        if (mode === undefined)
            mode = "r";
        this.mode = mode;
        this.uri = uri;
        this.sync_mode = "none";
        this.default_subject = "";
        this.shorthands = {};
        /* baseuri is used a the base URI to resolve relative attribute names in obsels */
        this.baseuri = "";

        if (this.mode.indexOf("w") >= 0) {
            this.syncservice = new BufferedService(uri, requestmode, format, handshake);
            $(window).unload( function () {
                if (this.syncservice && this.sync_mode !== 'none') {
                    this.syncservice.flush();
                    this.syncservice.stop_timer();
                }
            });
        }

        if (this.mode.indexOf("r") >= 0) {
            // Now that all is set up, we can try to load existing obsels.
            this.load_obsels();
        }
    };

    Trace.prototype = /** @lends Trace.prototype */ {
        /* FIXME: We could/should use a sorted list such as
           http://closure-library.googlecode.com/svn/docs/class_goog_structs_AvlTree.html
           to speed up queries based on time */
        /** List of obsels */
        obsels: [],
        /** Trace URI */
        uri: "",
        /** mode defines the intended usage mode of the trace. It can be either
           "r" : read-only - we will only read existing obsels
           "w" : write-only - we will only create obsels to be stored on a server
           "rw" : read-write - we will both read and write obsels.
        */
        mode: "rw",
        /** Default subject */
        default_subject: "",
        /** baseuri is used as the base URI to resolve relative
         * attribute-type names in obsels. Strictly speaking, this
         * should rather be expressed as a reference to model, or
         * more generically, as a qname/URI dict */
        baseuri: "",
        /** Mapping of obsel type or property name to a compact
         * representation (shorthands).
         */
        shorthands: null,
        syncservice: null,

        /** Define the trace URI */
        set_uri: function(uri) {
            this.uri = uri;
        },
        /** Get the trace URI */
        get_uri: function() {
            return this.uri;
        },

        /** Get the trace id */
        get_id: function() {
            var i = this.uri.split("/").reverse();
            if (i[0] !== "")
                return i[0];
            else
                return i[1];
        },

        /** Indicates wether the trace can be written to */
        get_readonly: function() {
            return (this.mode.indexOf("w") === -1);
        },

        /** Remove the trace from the server */
        remove: function() {
            $.ajax({ url: this.uri,
                     type: 'DELETE',
                     async: false,
                     error: function(jqXHR, textStatus, errorThrown) {
                         throw "Cannot delete trace " + this.uri + ": " + textStatus + ' ' + JSON.stringify(errorThrown);
                     }
                   });
            return true;
        },

        /**
         * Set sync mode. See {@link BufferedService.set_sync_mode} for details.
         * @param {string} mode: "delayed", "sync" or "none"
         */
        set_sync_mode: function(mode) {
            if (this.syncservice !== null) {
                this.syncservice.set_sync_mode(mode, this.default_subject);
            }
        },

        /** Load obsels from the Trace url
         * options is an object that contains optional parameters:
         *
         * - page: the page number
         * - pagesize: the page size
         * - from: the minimum timestamp
         * - to: the maximum timestamp
         *
         * @param {object} options: optional parameters
         */
        load_obsels: function(options) {
            var self = this;
            var params = [];

            if (options !== undefined) {
                if (options.page !== undefined)
                    params.push("page=" + options.page);
                if (options.pagesize !== undefined)
                    params.push("pageSize=" + options.pagesize);
                if (options.from !== undefined)
                    // FIXME: convert from Date to ms if necessary
                    params.push("from=" + options.from);
                if (options.to !== undefined)
                    params.push("to=" + options.to);
            }

            $.ajax({ url: this.uri + "@obsels" + (params.length ? ("?" + params.join('&')) : ""),
                     type: 'GET',
                     // Type of the returned data.
                     dataType: "json",
                     statusCode: {
                         413: function(jqXHR, textStatus, errorThrown) {
                             // Entity request too large.
                             // Resend query with restriction
                             self.load_obsels({ page: 1 });
                         }
                     },
                     error: function(jqXHR, textStatus, errorThrown) {
                         logmsg("Cannot load obsels: ", textStatus + ' ' + JSON.stringify(errorThrown));
                     },
                     success: function(data, textStatus, jqXHR) {
                         // Parse received data to populate this.obsels
                         self.parseJSON(data);
                     }
                   });
        },

        /** Force trace refresh */
        force_state_refresh: function() {
            this.load_obsels();
        },

        /**
         * Return a list of the obsels of this trace matching the parameters
         * @param {integer} _begin: the minimum begin time
         * @param {integer} _end: the maximum end time
         * @param {boolean} _reverse: return obsels in reverse chronological order
         * @return {list} a list of {@link Obsel}
         */
        list_obsels: function(_begin, _end, _reverse) {
            var res;
            if (typeof _begin !== 'undefined' || typeof _end !== 'undefined') {
                /*
                 * Not optimized yet.
                 */
                res = [];
                var l = this.obsels.length;
                for (var i = 0; i < l; i++) {
                    var o = this.obsels[i];
                    if ((typeof _begin !== 'undefined' && o.begin > _begin) && (typeof _end !== 'undefined' && o.end < _end)) {
                        res.push(o);
                    }
                }
            }

            if (typeof _reverse !== 'undefined') {
                if (res !== undefined) {
                    /* Should reverse the whole list. Make a copy. */
                    res = this.obsels.slice(0);
                }
                res.sort(function(a, b) { return b.begin - a.begin; });
                return res;
            }

            if (res === undefined) {
                res = this.obsels;
            }
            return res;
        },

        /**
         * Return the obsel of this trace identified by the URI, or undefined
         * @return {Obsel} an obsel
         */
        get_obsel: function(id) {
            for (var i = 0; i < this.obsels.length; i++) {
                /* FIXME: should check against variations of id/uri, take this.baseuri into account */
                if (this.obsels[i].uri === id) {
                    return this.obsels[i];
                }
            }
            return undefined;
        },

        /** Set the default subject
         * @param {string} subject
         */
        set_default_subject: function(subject) {
            // FIXME: if we call this method after the sync_service
            // init method, then the default_subject will not be
            // consistent anymore. Maybe we should then call init() again?
            this.default_subject = subject;
        },

        /** Get the default subject
         * @return {string} the default subject
         */
        get_default_subject: function() {
            return this.default_subject;
        },

        /* (ident: id, type:ObselType, begin:int, end:int?, subject:str?, attributes:[AttributeType=>any]?) */
        /** Create a new obsel and add it to the trace
         * @param {string} ident: the obsel id
         * @param {string} type: the obsel type
         * @param {integer} begin: the obsel begin time
         * @param {integer} end: the obsel end time
         * @param {object} _attributes: the obsel attributes
         * @return {Obsel} the created obsel
         */
        create_obsel: function(ident, type, begin, end, subject, _attributes) {
            var o = new Obsel(ident, type, begin, end, subject);
            if (typeof _attributes !== 'undefined') {
                o.attributes = _attributes;
            }
            o.trace = this;
            this.obsels.push(o);
            if (this.syncservice !== null)
                this.syncservice.enqueue(o);
            $(this).trigger('updated');
            return o;
        },

        /* Helper methods */

        /**
         * Parse a JSON-LD trace representation and add resulting
         * obsels to the trace obsels.
         */
        parseJSON: function(data) {
            var self = this;
            // FIXME: check @context
            // Parse received data to populate this.obsels
            if (data.hasOwnProperty('obsels')) {
                var o;
                data.obsels.forEach(function(j) {
                    o = (new Obsel()).fromJSON(j);
                    o.trace = this;
                    self.obsels.push(o);
                });
                $(this).trigger('updated');
            }
        },

        /** Create a new obsel with the given attributes
         * @param {string} type: the obsel type
         * @param {object} _attributes: the obsel attributes
         * @param {integer} [_begin]: the obsel begin time (current time if omitted)
         * @param {integer} [_end]: the obsel end time (same as begin if omitted)
         * @param {string} [_subject]: the obsel subject (trace default subject if omitted)
         */
        trace: function(type, _attributes, _begin, _end, _subject) {
            if (typeof begin === 'undefined') {
                var t = (new Date()).getTime();
                _begin = t;
            }
            if (typeof end === 'undefined') {
                _end = _begin;
            }
            if (typeof subject === 'undefined') {
                _subject = this.default_subject;
            }
            if (typeof _attributes === 'undefined') {
                _attributes = {};
            }
            return this.create_obsel(undefined, type, _begin, _end, _subject, _attributes);
        }
    };

    /**
     * @name Obsel
     * @class
     * @constructor
     * @param {string} ident: the obsel id
     * @param {string} type: the obsel type
     * @param {integer} begin: the obsel begin time
     * @param {integer} end: the obsel end time
     * @param {string} subject: the obsel subject
     * @param {object} attributes: the obsel attributes
     */
    function Obsel(ident, type, begin, end, subject, attributes) {
        this.trace = undefined;
        this.uri = "";
        this.id = ident || "";
        this.type = type;
        this.begin = begin;
        this.end = end;
        this.subject = subject;
        /* Is the obsel synced with the server ? */
        this.sync_status = false;
        /* Dictionary indexed by ObselType URIs */
        this.attributes = {};
    };
    Obsel.prototype = /** @lends Obsel.prototype */ {
        /* The following attributes are here for documentation
         * purposes. They MUST be defined in the constructor
         * function. */
        trace: undefined,
        type: undefined,
        begin: undefined,
        end: undefined,
        subject: undefined,
        /* Dictionary indexed by ObselType URIs */
        attributes: {},

        /** Get the Obsel URI
         * @return {string} the URI
         */
        get_uri: function() {
            if (this.uri)
                return this.uri;
            else if (this.id && this.trace !== undefined)
                return (this.trace.uri + this.id);
            else
                return "";
        },

        /** Get the Obsel id
         * @return {string} the id
         */
        get_id: function() {
            return this.id;
        },

        /** Force reload */
        force_state_refresh: function() {
            $.ajax({ url: this.uri,
                     type: 'GET',
                     // Type of the returned data.
                     dataType: "json",
                     error: function(jqXHR, textStatus, errorThrown) {
                         logmsg("Cannot refresh obsel " + this.uri + ": ", textStatus + ' ' + JSON.stringify(errorThrown));
                     },
                     success: function(data, textStatus, jqXHR) {
                         // Parse received data to populate this.obsels
                         self.fromJSON(data);
                     }
                   });
        },

        // FIXME: to implement
        get_readonly: function() {
            return true;
        },

        /** Delete the obsel from the trace
         * @throws Will throw an exception if it could not be removed.
         */
        remove: function() {
            $.ajax({ url: this.uri,
                     type: 'DELETE',
                     async: false,
                     error: function(jqXHR, textStatus, errorThrown) {
                         throw "Cannot delete obsel " + this.uri + ": " + textStatus + ' ' + JSON.stringify(errorThrown);
                     }
                   });
            return true;
        },

        // FIXME: implement properly
        get_label: function() {
            return this.id;
        },

        get_trace: function() {
            return this.trace;
        },

        get_obsel_type: function() {
            return this.type;
        },
        get_begin: function() {
            return this.begin;
        },
        get_end: function() {
            return this.end;
        },
        get_subject: function() {
            return this.subject;
        },

        /** List attribute types
         */
        list_attribute_types: function() {
            var result = [];
            for (var prop in this.attributes) {
                if (this.attributes.hasOwnProperty(prop))
                    result.push(prop);
            }
            /* FIXME: we return URIs here instead of AttributeType elements */
            return result;
        },

        list_relation_types: function() {
            /* FIXME: not implemented yet */
        },

        list_related_obsels: function (rt) {
            /* FIXME: not implemented yet */
        },
        list_inverse_relation_types: function () {
            /* FIXME: not implemented yet */
        },
        list_relating_obsels: function (rt) {
            /* FIXME: not implemented yet */
        },
        /**
         * Return the value of the given attribute type for this obsel
         */
        get_attribute_value: function(at) {
            if (typeof at === "string")
                /* It is a URI */
                return this.attributes[at];
            else
                /* FIXME: check that at is instance of AttributeType */
                return this.attributes[at.uri];
        },


        /* obsel modification (trace amendment) */

        /** Set the value of an attribute */
        set_attribute_value: function(at, value) {
            if (typeof at === "string")
                /* It is a URI */
                this.attributes[at] = value;
            /* FIXME: check that at is instance of AttributeType */
            else
                this.attributes[at.uri] = value;
        },

        /** Delete an attribute */
        del_attribute_value: function(at) {
            if (typeof at === "string")
                /* It is a URI */
                delete this.attributes[at];
            /* FIXME: check that at is instance of AttributeType */
            else
                delete this.attributes[at.uri];
        },

        /** Add a related obsel */
        add_related_obsel: function(rt, value) {
            /* FIXME: not implemented yet */
        },

        /** Delete a related obsel */
        del_related_obsel: function(rt, value) {
            /* FIXME: not implemented yet */
        },

        /**
         * Return a JSON representation of the obsel
         */
        toJSON: function() {
            var r = {
                "@id": this.id,
                "@type": this.type,
                "begin": this.begin,
                "end": this.end,
                "subject": this.subject
            };
            for (var prop in this.attributes) {
                if (this.attributes.hasOwnProperty(prop))
                    r[prop] = this.attributes[prop];
            }
            return r;
        },

        PRIVATE_JSON_PROPERTIES: [ '@id', '@type', 'subject', 'begin', 'end' ],
        /**
         * Initialize the Obsel attributes from the given JSON-LD representation
         * @param {object} j: a JSON-LD serialization
         */
        fromJSON: function(j) {
            this.id = j['@id'];
            this.type = j['@type'];
            this.subject = j.subject;
            this.begin = j.begin;
            this.end = j.end;
            this.attributes = {};
            for (var k in j) {
                if (j.hasOwnProperty(k) && this.PRIVATE_JSON_PROPERTIES.indexOf(k) === -1) {
                    // Not a private property, copy it into attributes
                    this.attributes[k] = j[k];
                }
            }
            return this;
        },

        /**
         * Return a compact JSON representation of the obsel.
         * Use predefined + custom shorthands for types/properties
         */
        toCompactJSON: function() {
            var r = {
                "@t": (this.trace.shorthands.hasOwnProperty(this.type) ? this.trace.shorthands[this.type] : this.type),
                "@b": this.begin
            };
            // Transmit subject only if different from default_subject
            if (this.subject !== this.trace.default_subject)
                r["@s"] = this.subject;

            // Store duration (to save some bytes) and only if it is non-null
            if (this.begin !== this.end)
                r["@d"] = this.end - this.begin;

            // Store id only if != ""
            if (this.id !== "")
                r["@i"] = this.id;

            for (var prop in this.attributes) {
                if (this.attributes.hasOwnProperty(prop))
                {
                    var v = this.attributes[prop];
                    r[prop] = this.trace.shorthands.hasOwnProperty(v) ? this.trace.shorthands[v] : v;
                }
            }
            return r;
        },

        /** Return a JSON string serialization */
        toJSONstring: function() {
            return JSON.stringify(this.toJSON());
        },

        /**
         * Return a Turtle representation of the obsel,
         * assuming that : is bound to the KTBS namespace,
         * and that m: is bound to the model namespace.
         */
        toTurtle: function () {
            var prop;
            var data = [ "[ :hasTrace <> ;",
                         "  a m:" + this.type + " ;" ];
            if (this.begin) { data.push("  :hasBegin " + this.begin + " ;"); }
            if (this.end) { data.push("  :hasEnd " + this.end + " ;"); }
            if (this.subject) { data.push("  :hasSubject \"" + this.subject + "\" ;"); }
            for (prop in this.attributes) {
                if (this.attributes.hasOwnProperty(prop)) {
                    data.push("  m:" + prop + " " + JSON.stringify(this.attributes[prop]));
                }
            }
            data.push("] .\n");
            return data.join("\n");
        }

    };

    /**
     * @name TraceManager
     * @class
     * @constructor
     * @desc It manages a set of traces.
     */
    function TraceManager() {
        this.traces = {};
    };
    TraceManager.prototype = /** @lends TraceManager.prototype */ {
        traces: [],
        /**
         * Return the trace with id name
         * If it was not registered, return undefined.
         * @param {string} name
         */
        get_trace: function(name) {
            return this.traces[name];
        },

        /**
         * Explicitly create and initialize a new trace with the given name.
         * The optional uri parameter allows to initialize the trace URI.
         * If another trace exists with the same name, then it is replaced by a new one.
         *
         * See the {@link Trace} documentation for the definition of parameters. They are:
         *
         * - url: the Trace url (for reading or writing)
         * - mode: the access mode - "r", "w", "rw" (default)
         * - requestmode: the HTTP method for creating obsels - "GET", "POST" (default)
         * - syncmode: the synchronization mode - "delayed", "sync", "none" (default)
         * - format: the serialization format - "json" (default), "json-compact", "turtle"
         * - default_subject: the default subject id (default: "")
         * - handshake: is an initial handshake needed (default: false)?
         *
         * @param {string} name: the trace name
         * @param {object} params: the trace parameters
         */
        init_trace: function(name, params)
        {
            var url = params.url ? params.url : "";
            var mode = params.mode || "rw";
            var requestmode = params.requestmode ? params.requestmode : "POST";
            var syncmode = params.syncmode ? params.syncmode : "none";
            var format = params.format || "json";
            var default_subject = params.default_subject || "";
            var handshake = params.handshake;

            var t = new Trace(url, mode, requestmode, format, handshake);
            t.set_default_subject(default_subject);
            t.set_sync_mode(syncmode);
            this.traces[name] = t;
            return t;
        }
    };

    /** @name tracemanager
     * @desc The {@link TraceManager} instance (singleton)
     */
    var tracemanager  = new TraceManager();
    return tracemanager;
}));
