var demo = function (canvas, options) {
    var util = {
        degree2angle: function (degree) {
            return Math.PI * degree / 180;
        },
        createCalculateCoordinate: function (a, b, x, y) {
            return function (c) {
                var x0 = Math.cos(c) * (x - a) - Math.sin(c) * (y - b) + a;
                var y0 = Math.cos(c) * (y - b) - Math.sin(c) * (x - a) + b;
                return {
                    x: x0,
                    y: y0
                }
            }
        }
    };

    var config = {
        degree: 90,
        radius: 86,
        x: 16,
        y: 24
    };

    var opts = $.extend({}, config, options);

    var stage = new createjs.Stage(canvas);

    var createCircle = function () {
        var g = new createjs.Graphics();
        g.setStrokeStyle(4);
        g.beginStroke("#DADADA");
        g.drawCircle(0, 0, opts.radius);
        return g;
    };

    var createArc = function (degree) {
        var anticlockwise = false;
        var g = new createjs.Graphics();
        g.setStrokeStyle(4);
        g.beginStroke("#FF8202");
        g.arc(0, 0, opts.radius, util.degree2angle(-90), util.degree2angle(degree - 90), anticlockwise);
        return g;
    };

    var createPoint = function () {
        var g = new createjs.Graphics();
        g.beginFill('#FFFFFF');
        g.drawCircle(0, 0, 10);
        g.setStrokeStyle(2);
        g.beginStroke('#FEB972');
        g.drawCircle(0, 0, 10);
        g.setStrokeStyle(0);
        g.beginStroke('#FF8202');
        g.beginFill('#FF8202');
        g.drawCircle(0, 0, 6);
        return g;
    };

    var circle = new createjs.Shape(createCircle());
    circle.x = opts.radius + opts.x;
    circle.y = opts.radius + opts.y;

    var arc = new createjs.Shape(createArc(opts.degree));
    arc.x = opts.radius + opts.x;
    arc.y = opts.radius + opts.y;

    var point = new createjs.Shape(createPoint());
    var mathFn = util.createCalculateCoordinate(
        opts.radius + opts.x,
        opts.radius + opts.y,
        opts.radius + opts.x,
        opts.y
    );
    var res = mathFn(util.degree2angle(opts.degree));
    point.x = res.x;
    point.y = res.y;

    stage.addChild(circle);
    stage.addChild(arc);
    stage.addChild(point);

    stage.update();

    return {
        setDegree: function (degree) {
            arc.graphics = createArc(degree);
            var res = mathFn(util.degree2angle(degree));
            point.x = res.x;
            point.y = res.y;
            stage.update();
        }
    }
};

var test = demo($('#mycanvas').get(0), {
    degree: 0
});

var temp = {degree: 0};
createjs.Tween
    .get(temp)
    .to({degree: 360}, 10000)
    .addEventListener("change", function () {
        var degree = Math.floor(temp.degree);
        test.setDegree(degree);
    });