
; (function () {
    function runInContext() {
        var dataUtils = new Object();
        function uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 32; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "";

            var uuid = s.join("");
            return uuid;
        }
        /**
             * 日期格式化
             * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
             * Format("yyyy-MM-dd hh:mm:ss.S")
             * @param data  日期
             * @param fmt 格式类型
             */
        function dataFormat(data, fmt) {
            let o = {
                "M+": data.getMonth() + 1,                 //月份   
                "d+": data.getDate(),                    //日   
                "h+": data.getHours(),                   //小时   
                "m+": data.getMinutes(),                 //分   
                "s+": data.getSeconds(),                 //秒   
                "q+": Math.floor((data.getMonth() + 3) / 3), //季度   
                "S": data.getMilliseconds()             //毫秒   
            };

            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
        dataUtils.dataFormat = dataFormat;
        dataUtils.uuid = uuid;
        return dataUtils
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Detect free variable `exports`. */
    var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    // Export lodash.
    var _ = runInContext();

    // Some AMD build optimizers, like r.js, check for condition patterns like:
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        // Expose Lodash on the global object to prevent errors when Lodash is
        // loaded by a script tag in the presence of an AMD loader.
        // See http://requirejs.org/docs/errors.html#mismatch for more details.
        // Use `_.noConflict` to remove Lodash from the global object.
        root._ = _;

        // Define as an anonymous module so, through path mapping, it can be
        // referenced as the "underscore" module.
        define(function () {
            return _;
        });
    }
    // Check for `exports` after `define` in case a build optimizer adds it.
    else if (freeModule) {
        // Export for Node.js.
        (freeModule.exports = _)._ = _;
        // Export for CommonJS support.
        freeExports._ = _;
    }
    else {
        // Export to the global object.
        root._ = _;
    }
}.call(this))