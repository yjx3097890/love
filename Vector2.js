Vector2 = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector2.prototype = {
    constructor : Vector2,
    
    setX : function (x) {
        this.x = x;
        return this;
    },
    
    setY : function (y) {
        this.y = y;
        return this;
    },
    
    set : function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    
    copy : function (vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
        return this;
    },
    
    equals : function (vec2) {
        return this.x === vec2.x && this.y === vec2.y;
    },
    
    clone : function () {
        return new Vector2(this.x, this.y);
    },
    
    getX : function () {
        return this.x;
    },
    
    getY : function () {
        return this.y;
    },
    
    getLength : function () {
        return Math.sqrt( this.x * this.x + this.y * this.y);
    },
    
    normalize : function () {
        if (this.x === 0 && this.y ===0) {
            return new Vector2();
        }
        var length = this.getLength();
        this.x *= 1 / length;
        this.y *= 1 / length;
        return this;
    },
    
    add : function (vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
        return this;
    },
    
    sub : function (vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this;
    },
    
    multiplyScalar : function (k) {
        this.x *= k;
        this.y *= k;
        return this;
    },
    
    dot : function (vec2) {
        return this.x * vec2.x + this.y * vec2.y;
    },
    
    getLengthTo : function (vec2) {
        return Math.sqrt( (this.x - vec2.x) * (this.x - vec2.x) + (this.y - vec2.y) * (this.y - vec2.y));
    }, 
    
    getLengthToSquared : function (vec2) {
        return (this.x - vec2.x) * (this.x - vec2.x) + (this.y - vec2.y) * (this.y - vec2.y);
    },
    
    getVertical : function () {
        return new Vector2(this.y, - this.x);
    },
    
    getReverse : function () {
        this.x *= -1;
        this.y *= -1;
        return this;
    },
    
    getDistanceToLine : function (a, b) {
        if (a.x === b.x) {
            return Math.abs(this.x - a.x);
        }else if (a.y === b.y) {
            return Math.abs(this.y - a.y);
        }else {
            var k = (a.y - b.y) / (a.x - b.x),
                c = a.y - k * a.x,
                result = Math.abs( k * this.x - this.y + c ) / Math.sqrt( k * k + 1 );
            return result;
        }
    },
    
    reflect : function (normal) {
        if (! (normal instanceof Vector2)) alert("need vector2");
        var nn = normal.normalize();
        this.sub(nn.multiplyScalar(2 * this.dot(nn))); 
        return this;
    },
    
    rotateByPoint : function (point, alpha) {
        var s = Math.sin(alpha), c = Math.cos(alpha),
            temp = this.clone().sub(point);
        this.x = point.x + temp.x * c - s * temp.y;
        this.y = point.y + temp.x * s + c * temp.y;
        return this;
    }
    
};
