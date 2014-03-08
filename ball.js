/**
 *
 * @param position
 * @param radius
 * @param velocity
 * @param acceleration
 * @param mass : 质量
 * @param e : 弹性系数
 * @constructor
 */
 var Ball = function (position, radius, velocity, acceleration, mass, e) {
    this.position = ( position&&position.clone() ) || new Vector2();
    this.radius = radius || 0;
    this.velocity = ( velocity&&velocity.clone() ) || new Vector2();
    this.acceleration = ( acceleration&&acceleration.clone() ) || new Vector2();
    this.mass = mass || 0;
    this.e = e || 1;
}

/**
 *
 * @param context
 * @param color : {rgb: '#ffffff', a : 1}
 */
Ball.prototype.draw = function (context, color) {
    context.beginPath();
    if ( typeof color === "object"){
        context.globalAlpha = (color && color.a) || 1;
        context.fillStyle = (color && color.rgb) || "#FFFFFF";
    }else{
        context.globalAlpha = 1;
        context.fillStyle = color || "#FFFFFF";
    }
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    return this;
}
/**
 * 计算移动后的位置
 * @param time ： 移动的时间
 * @param isPolar ： 速度、加速度是否是极座标表示
 */
Ball.prototype.move = function (time, isPolar) {
    var t = time || 0;
    if (isPolar) {
        this.velocity.x += this.acceleration.x * t;
        this.velocity.y += this.acceleration.y * t;
        this.position.x += this.velocity.x * Math.cos(this.velocity.y) * t + 1 / 2 * this.acceleration.x * Math.cos(this.acceleration.y) * t * t;
        this.position.y += this.velocity.x * Math.sin(this.velocity.y) * t + 1 / 2 * this.acceleration.x * Math.sin(this.acceleration.y) * t * t;
    }else{
        this.velocity.x += this.acceleration.x * t;
        this.velocity.y += this.acceleration.y * t;
        this.position.x += this.velocity.x * t + 1 / 2 * this.acceleration.x * t * t;
        this.position.y += this.velocity.y * t + 1 / 2 * this.acceleration.y * t * t;
    }
    return this;
};
Ball.prototype.clone = function() {
    var obj = new Ball();
    for(var p in this) {
        if(this.hasOwnProperty(p)) {
            if( typeof this[p] === "object") {
                obj[p] = arguments.callee.call(this[p]);
            }else{
                obj[p] = this[p];
            }
        }
    }
    return obj;
};
/**
 * 判断是否和四周边界相撞
 * @param canvas
 * @param direction ： {up:true,right: true, down: true, left: true}
 * @returns {boolean}
 */
Ball.prototype.hasImpactSide = function(canvas, direction) {
    if(direction.up && this.position.y - this.radius <= 0) {
        return true;
    }
    if(direction.right && this.position.x + this.radius >= canvas.width) {
        return true;
    }
    if(direction.down && this.position.y + this.radius >= canvas.height) {
        return true;
    }
    if(direction.left && this.position.x - this.radius <= 0) {
        return true;
    }
    return false;
};
/**
 * 是否和另一个求接触
 * @param another：另一个球
 * @returns {boolean}
 */
Ball.prototype.isTouchBall = function (another) {
    return (this.position.getLengthToSquared(another.position) <= Math.pow(this.radius + another.radius, 2));
};
/**
 * 是否和另一个球相碰
 * @param another
 * @returns {boolean|*}
 */
Ball.prototype.isCollisionBall = function (another) {
    var isTouch = this.isTouchBall(another),
        dir = this.position.clone().sub(another.position).normalize(), //this相对于another的位置
        relativeV = another.velocity.clone().sub(this.velocity), //this相对于another的速度
        dot = dir.dot(relativeV);
    return isTouch && dot > 0;
};
/**
 * 和另一个球发生碰撞，this.e 为弹性系数， this.mass为质量
 * @param another
 * @returns {Ball}
 */
Ball.prototype.collisionBall = function(another) {
    if( this.isCollisionBall(another) ) {
        var vv = this.velocity.clone().sub(another.velocity).multiplyScalar(1 + this.e);
        this.velocity.sub(vv.clone().multiplyScalar( another.mass / ( this.mass + another.mass )));
        another.velocity.add(vv.clone().multiplyScalar( this.mass / (this.mass + another.mass)));
    }
    return this;
};
/**
 * 和一条直线碰撞，直线过a，b两点
 * @param a ：Vector2
 * @param b ：Vector2
 * @returns {Ball}
 */
Ball.prototype.collisionLine = function (a, b) {
    if (this.position.getDistanceToLine(a, b) <= this.radius) {
        var normal = a.sub(b).getVertical().normalize();
        this.velocity.reflect(normal);
    }
    return this;
};
/**
 * 以极坐标表示的速度的球，在一个密闭球中碰撞
 * @param sealedBall
 * @returns {Ball}
 */
Ball.prototype.impactSealedBall = function (sealedBall) {
    if (Math.pow(sealedBall.position.x - this.position.x, 2) + Math.pow(sealedBall.position.y - this.position.y, 2) >= Math.pow(sealedBall.radius - this.radius, 2)) {
        var alpha = Math.acos((this.position.x - sealedBall.position.x) / Math.sqrt(Math.pow(sealedBall.position.x - this.position.x, 2) + Math.pow(sealedBall.position.y - this.position.y, 2))),
            dir = this.velocity.y;
        if (this.position.y >= sealedBall.position.y) {
            this.velocity.y = -dir -Math.PI + 2 * alpha;
        }else{
            this.velocity.y = -dir + Math.PI - 2 * alpha;
        }
    }
    return this;
};