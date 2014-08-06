/**
 * 检查元素是否位于容器的显示可见区域中
 * @author kpaxqin
 *
 */

var SeenChecker = function(options){
    this.init(options);
};
SeenChecker.prototype = {
    init : function(options){
        options = $.extend({}, {
            container : $(window),
            defaultAxis : "y",
            preloadRange : 1
        }, options || {});
        if (options.container.length == 0){
            throw new Error("invalid container");
        }

        this.options = options;
        this.cache = null;
    },
    _calculate : function(){
        var container = this.options.container,
            preloadRange = this.options.preloadRange,
            conHeight = container.height(),
            conWidth = container.width(),
            conTop,
            conLeft;
        if(container.get(0) === window){
            conTop = container.scrollTop();
            conLeft = container.scrollLeft();
        }else{
            conTop = container.offset().top;
            conLeft = container.offset().left;
        }

        this.cache = {
            conHeight : conHeight * preloadRange,
            conWidth : conWidth * preloadRange,
            conTop : conTop,
            conLeft : conLeft
        }
    },
    _check : function(elHeight, elWidth, elOffset, axis, forceRefresh){
        if (forceRefresh || !this.cache){
            this.refresh();
        };

        var posMin, posMax, conRange;
        if (axis == "x"){
            posMin = elOffset.left - this.cache.conLeft;
            posMax = posMin + elWidth;
            conRange = this.cache.conWidth;
        }else{
            posMin = elOffset.top - this.cache.conTop;
            posMax = posMin + elHeight;
            conRange = this.cache.conHeight;
        }

        if ((posMin >= 0 && posMin < conRange) || (posMax > 0 && posMax <= conRange)){
            return true;
        }else{
            return false;
        }
    },
    check : function(el, axis, forceReresh){
        var elHeight = el.outerHeight(),
            elWidth = el.outerWidth(),
            elOffset = el.offset();

        if (arguments.length == 1 || Object.prototype.toString.call(axis) === "[object Boolean]"){
            forceReresh = axis;
            axis = this.options.defaultAxis;
        }

        if (axis === "xy"){
            var xResult = this._check(elHeight, elWidth, elOffset, "x", forceReresh),
                yResult = this._check(elHeight, elWidth, elOffset, "y", forceReresh);
            return xResult && yResult;
        }else{
            return this._check(elHeight, elWidth, elOffset, axis, forceReresh);
        }
    },
    refresh : function(){
        this._calculate();
    }
}
