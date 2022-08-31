Array.prototype.contains = String.prototype.contains = function(v, requiresAll) { var _this=this; return typeof(v)=='object' ? (requiresAll? _.every :_.some)(v,function(a) { return _this.indexOf(a)>-1;}) : this && this.indexOf && this.indexOf(v)>-1;}

class Defer {    
    get isDefered() { return !!this._isDefered ; }
    set isDefered(v) { this._isDefered = v; }
    
    get promise() { return this._promise ; }
    set promise(v) { this._promise = v; }
    /**
     * 
     * @param {Number} timeout 
     */
    constructor(timeout) {
        
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        
        if(timeout!==undefined) {
            setTimeout(function () {
                if(!this.isDefered && this.promise && this.promise.resolve) this.promise.resolve();
            }.bind(this),timeout);
        }
        
        // this.isFulfilled = function() { return isFulfilled; };
        // this.isPending = function() { return isPending; };
        // this.isRejected = function() { return isRejected; };
    }
    then(fun) { this._promise.then(fun); }
    catch(fun) { this._promise.catch(fun); }
    finally(fun) { this._promise.finally(fun); }
    resolve(val1,val2,val3,val4) { this.isDefered=true; this._resolve(val1,val2,val3,val4); }
    reject(val1,val2,val3,val4) { this.isDefered=true; this._reject(val1,val2,val3,val4); }
}

if (typeof String.prototype.parseFunction != 'function') {
    String.prototype.parseFunction = function () {
        var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
        var match = funcReg.exec(this.replace(/\n/g, ' '));

        if(match) {
            return new Function(match[1].split(','), match[2]);
        }

        return null;
    };
}



module.exports = { Defer};