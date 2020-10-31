var utils = {

    degreesToRads: function (degrees) {
        return degrees / 180 * Math.PI;
    },

    randomInt: function (min, max) {
        return min + Math.random() * (max - min + 1);
    }

};

// basic setup  :)

canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
W = canvas.width = window.innerWidth;
H = canvas.height = window.innerHeight;

gridX = 5;
gridY = 5;

function Shape(x, y, text) {
    this.x = x;
    this.y = y;
    this.size = 120;

    this.text = text;
    this.placement = [];
}

Shape.prototype.getValue = function () {
    console.log("get black pixels position");

//  Draw the shape :^)

    ctx.textAlign = "center";
    ctx.font = "bold " + this.size + "px arial";
    ctx.fillText(this.text, this.x, this.y);

//  get the data

    var data = ctx.getImageData(0, 0, W, H);

//  use a 32-bit buffer as we are only checking if a pixel is set or not
    var buffer32 = new Uint32Array(data.data.buffer);

//  Loop through the image
    for (var y = 0; y < H; y += gridY) {
        for (var x = 0; x < W; x += gridX) {
            if (buffer32[y * W + x]) {
                this.placement.push(new Particle(x, y));
            }
        }
    }
    ctx.clearRect(0, 0, W, H);
};

colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722'
];

function Particle(x, y) {
    this.radius = 1.1;
    this.futurRadius = utils.randomInt(radius, radius + 3);

    this.x = x;
    this.y = y;

    this.dying = false;

    this.base = [x, y];

    this.vx = 0;
    this.vy = 0;
    this.friction = .99;
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.getSpeed = function () {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    };

    this.setSpeed = function (speed) {
        var heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    };

    this.getHeading = function () {
        return Math.atan2(this.vy, this.vx);
    };

    this.setHeading = function (heading) {
        var speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    };

    this.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;

        this.vx *= this.friction;
        this.vy *= this.friction;

        if (this.radius < this.futurRadius && this.dying === false) {
            this.radius += duration;
        } else {
            this.dying = true;
        }

        if (this.dying === true) {
            this.radius -= duration;
        }

        ctx.beginPath();

        ctx.fillStyle = this.color;

        ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
        ctx.fill();
        ctx.closePath();

        if (this.y < 0 || this.radius < 1) {
            this.x = this.base[0];
            this.dying = false;
            this.y = this.base[1];
            this.radius = 1.1;
            this.setSpeed(speed);
            this.futurRadius = utils.randomInt(radius, radius + 3);
            this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
        }
    };

    this.setSpeed(utils.randomInt(.1, .5));
    this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));

}

var messageValue = "Board And Pieces";
var gravity = parseFloat("0");
var duration = parseFloat(".4");
var speed = parseFloat(".1");
var radius = parseFloat(".1");

var message = new Shape(W / 2, H / 2 - 100, messageValue);

message.getValue();

update();

var fps = 100;

function update() {
    setTimeout(function () {
        ctx.clearRect(0, 0, W, H);

        for (var i = 0; i < message.placement.length; i++) {
            message.placement[i].update();
        }

        requestAnimationFrame(update);
    }, 1000 / fps);
}
