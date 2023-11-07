const pi = Math.PI;
const goldenRatio = (1 + 5**(1/2))/2;
function cos(x) { return Math.cos(x); }
function sin(x) { return Math.sin(x); }
function acos(x) { return Math.acos(x); }

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
    const h = canvas.height;
    const w = canvas.width;
const startButton = document.getElementById("startButton"); 
    startButton.addEventListener("click", startStop);
    let running;
const angleSlider = document.getElementById("angleSlider");
    angleSlider.addEventListener("input", input);
const heightSlider = document.getElementById("heightSlider");
    heightSlider.addEventListener("input", input);
const distSlider = document.getElementById("distanceSlider");
    distSlider.addEventListener("input", input);
const axisSwitch = document.getElementById("axisSwitch");
const autoSwitch = document.getElementById("autoSwitch");

let camDist = distSlider.value;                         //distance from camera to target
let camAngle = 0;                                       //angle around Y-axis
let camHeight = heightSlider.value;                     //Y-coordinate
let camMat;
let target = [0, 0, 0];

let t = 0;
let dodecaSize = 1;
let icosaSize = 1;

let tempMat, red, green, blue;

window.onload = (event) => {
    context.translate(w/2, h/2);
    context.scale(w/2, -h/2);
    running = false;
    tempMat = mat4.create();
    camMat = mat4.create();
    context.save();
    startStop();
}

function updateVars() {
    camDist = -distSlider.value;
    if (autoSwitch.checked) { camAngle = t*pi/180; }
    else { camAngle = angleSlider.value*pi/180; }
    camHeight = heightSlider.value;
    context.scale(1/camDist, 1/camDist);
    scalePolySizes(1/dodecaSize, 1/icosaSize);
    icosaSize = 0.5 + 0.25*cos(t*pi/180);
    scalePolySizes(dodecaSize, icosaSize);
}

function scalePolySizes(dodecaScale, icosaScale) {
    for (let i = 0; i < dodecaPoints.length; i++) {
        for (let j = 0; j < dodecaPoints[i].length; j++) {
            for (let k = 0; k < dodecaPoints[i][j].length; k++) {
                dodecaPoints[i][j][k] *=dodecaScale;
            }
        }
    }
    for (let i = 0; i < icosaPoints.length; i++) {
        for (let j = 0; j < icosaPoints[i].length; j++) {
            for (let k = 0; k < icosaPoints[i][j].length; k++) {
                icosaPoints[i][j][k] *= icosaScale;
            }
        }
    }
}

function input() {
    if (!running) {draw();}
}

function draw() {
    context.restore(); 
    context.save();
    context.clearRect(-1, -1, 2, 2);
    updateVars();
    updateCamMat();

    if (axisSwitch.checked) { drawAxes(); }
    drawStaff();
    context.lineWidth = 0.0001;
    context.fillStyle = "rgb(210 210 210)";
    drawPolyhedron(dodecaPoints, true);
    context.save();
        mat4.copy(tempMat, camMat);

            context.save();
            context.lineWidth = camDist**(1/2)*6/w;
            context.strokeStyle = "black";
            red = 125*Math.cos(0.5*t*Math.PI/180).toString()+130;
            green = 125*Math.cos(1*t*Math.PI/180).toString()+130;
            blue = -125*Math.cos(2*t*Math.PI/180).toString()+130;
            context.fillStyle = "rgb(" + red + " " + green + " " + blue + ")";
            mat4.rotateX(camMat, camMat, -9*t*pi/180);
            mat4.rotateZ(camMat, camMat, 9*t*pi/180);
            mat4.translate(camMat, camMat, [0.2*cos(t*pi/180), 0, 0.2*sin(t*pi/180)]);
            let s = 0.4 + 0.1*cos(4*t*pi/180);
            scalePolySizes(1, s);
            drawPolyhedron(icosaPoints, true);
            scalePolySizes(1, 1/s);
                mat4.rotateX(camMat, camMat, 12*t*pi/180);
                mat4.rotateZ(camMat, camMat, -6*t*pi/180);
                red = 125*Math.cos(4*t*Math.PI/180).toString()+130;
                green = 125*Math.cos(2*t*Math.PI/180).toString()+130;
                blue = -125*Math.cos(1*t*Math.PI/180).toString()+130;
                context.strokeStyle = "rgb(" + red + " " + green + " " + blue + ")";
                let s2 = s - 0.2*sin(10*t*pi/180);
                scalePolySizes(s2*s, 1);
                let temp = 0.8 + 0.01*cos(t);
                mat4.scale(camMat, camMat, [temp, temp, temp]);
                mat4.translate(camMat, camMat, [0.1*cos(t*pi/180), 1, 0.1*sin(t*pi/180)]);
                red = 125*Math.cos(0.5*t*Math.PI/180).toString()+130;
                green = 125*Math.cos(0.1*t*Math.PI/180).toString()+130;
                blue = -125*Math.cos(0.25*t*Math.PI/180).toString()+130;
                context.fillStyle = "rgb(" + red + " " + green + " " + blue + ")";
                drawPolyhedron(dodecaPoints, true);
                mat4.translate(camMat, camMat, [-0.1*cos(t*pi/180), -2, -0.1*sin(t*pi/180)]);
                drawPolyhedron(dodecaPoints, true);
                scalePolySizes(1/(s2*s), 1);
            context.restore();

        mat4.copy(camMat, tempMat);
        context.lineWidth = camDist**(1/2)*12/w;
        red = 125*Math.cos(t*Math.PI/180).toString()+130;
        green = 125*Math.cos(4*t*Math.PI/180).toString()+130;
        blue = -125*Math.cos(2*t*Math.PI/180).toString()+130;
        context.strokeStyle = "rgb(" + red + " " + green + " " + blue + ")";
        mat4.rotateX(camMat, camMat, 3*t*pi/180);
        mat4.rotateZ(camMat, camMat, -3*t*pi/180);
        drawPolyhedron(icosaPoints, false);

    context.restore();
    mat4.copy(camMat, tempMat);

    context.lineWidth = camDist**(1/2)*12/w;
    drawPolyhedron(dodecaPoints, false);

    
    if (running) {
        t = (t + 0.5) % 360;
        window.requestAnimationFrame(draw);
    }
}

function drawStaff() {
    mat4.copy(tempMat, camMat);
    context.save();

    context.beginPath();
    context.strokeStyle = "brown";
    context.fillStyle = "brown";
    context.lineWidth = camDist**(1/2)*25/w;

    for (let i = 0; i < 2; i++) {
        context.beginPath();
        moveTo([goldenRatio, -1/goldenRatio ,0]);
        lineTo([goldenRatio-.2, -1.5, 0]);
        lineTo([0, -3, 0]);
        lineTo([0, -2, 1/goldenRatio]);
        lineTo([0, -goldenRatio, 1/goldenRatio]);
        mat4.rotateY(camMat, camMat, pi);
        context.stroke();
        context.closePath();
    }

    context.beginPath();
    context.lineWidth = camDist**(1/2)*50/w;
    moveTo([0,-3,0]);
    lineTo([0,-10,0]);
    context.stroke();
    context.closePath();


    context.restore();
    mat4.copy(camMat, tempMat);
}

function drawPolyhedron(points, filled) {
    if (filled) {
         context.beginPath();
         moveTo(points[0][0]);
         for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[i].length; j++) {
                lineTo(points[i][j]);
                context.fill();
            }
            lineTo(points[i][0]);
        }
        context.closePath();
    }

    for (let i = 0; i < points.length; i++) {
        context.beginPath();
        moveTo(points[i][0]);
        for (let j = 1; j < points[i].length; j++) {
            lineTo(points[i][j]);
        }
        lineTo(points[i][0]);
        context.stroke();
        context.closePath();
    }
}

function drawAxes() {
    context.save();
    context.lineWidth = camDist*3/w;
    context.beginPath();
    context.strokeStyle = "red";
    moveTo([0,0,0]);
    lineTo([1,0,0]);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.strokeStyle = "green";
    moveTo([0,0,0]);
    lineTo([0,1,0]);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.strokeStyle = "blue";
    moveTo([0,0,0]);
    lineTo([0,0,1]);
    context.stroke();
    context.closePath();

    context.restore();
}

function moveTo(loc) {
    let res = vec3.create();
    vec3.transformMat4(res,loc,camMat);
    context.moveTo(res[0],res[1]);
}

function lineTo(loc) {
    let res = vec3.create();
    vec3.transformMat4(res,loc,camMat);
    context.lineTo(res[0],res[1]);
}

function updateCamMat() {
    let lookMat = mat4.create();
    let eye = [sin(camAngle), camHeight, cos(camAngle)];
    let up = [0, 1, 0];
    mat4.lookAt(lookMat, eye, target, up);

    let projMat = mat4.create();
    mat4.ortho(projMat, -1, 1, -1, 1, 0, camDist);

    mat4.multiply(camMat, projMat, lookMat);
}

function startStop() {
    running = !running;
    if (!running) { startButton.value = "start"; }
    else {
        startButton.value = "stop"
        draw();
    };
}

let dodecaPoints = [
    [
    [1, 1, 1],
    [1/goldenRatio, 0, goldenRatio],
    [1, -1, 1],
    [goldenRatio, -1/goldenRatio, 0],
    [goldenRatio, 1/goldenRatio, 0],
    ]
    ,
    [
    [1, 1, -1],
    [1/goldenRatio, 0, -goldenRatio],
    [1, -1, -1],
    [goldenRatio, -1/goldenRatio, 0],
    [goldenRatio, 1/goldenRatio, 0],
    ]
    ,
    [
    [-1, 1, 1],
    [-1/goldenRatio, 0, goldenRatio],
    [-1, -1, 1],
    [-goldenRatio, -1/goldenRatio, 0],
    [-goldenRatio, 1/goldenRatio, 0],
    ]
    ,
    [
    [-1, 1, -1],
    [-1/goldenRatio, 0, -goldenRatio],
    [-1, -1, -1],
    [-goldenRatio, -1/goldenRatio, 0],
    [-goldenRatio, 1/goldenRatio, 0],
    ]
    ,
    [
    [1/goldenRatio, 0, goldenRatio],
    [-1/goldenRatio, 0, goldenRatio],
    [-1, 1, 1],
    [0, goldenRatio, 1/goldenRatio],
    [1, 1, 1],
    ]
    ,
    [
    [1/goldenRatio, 0, -goldenRatio],
    [-1/goldenRatio, 0, -goldenRatio],
    [-1, 1, -1],
    [0, goldenRatio, -1/goldenRatio],
    [1, 1, -1],
    ]
    ,
    [
    [1/goldenRatio, 0, goldenRatio],
    [-1/goldenRatio, 0, goldenRatio],
    [-1, -1, 1],
    [0, -goldenRatio, 1/goldenRatio],
    [1, -1, 1],
    ]
    ,
    [
    [1/goldenRatio, 0, -goldenRatio],
    [-1/goldenRatio, 0, -goldenRatio],
    [-1, -1, -1],
    [0, -goldenRatio, -1/goldenRatio],
    [1, -1, -1],
    ]
    ,
    [
        [0, -goldenRatio, 1/goldenRatio],
        [0, -goldenRatio, -1/goldenRatio]
    ]
    ,
    [
        [0, goldenRatio, 1/goldenRatio],
        [0, goldenRatio, -1/goldenRatio]
    ]
];

let icosaPoints = [
    [
        [1, goldenRatio, 0],
        [0, 1, goldenRatio],
        [goldenRatio, 0, 1]
    ]    
    ,
    [
        [1, goldenRatio, 0],
        [0, 1, -goldenRatio],
        [goldenRatio, 0, -1]
    ]    
    ,
    [
        [1, -goldenRatio, 0],
        [0, -1, goldenRatio],
        [goldenRatio, 0, 1]
    ]    
    ,
    [
        [1, -goldenRatio, 0],
        [0, -1, -goldenRatio],
        [goldenRatio, 0, -1]
    ]
    ,
    [
        [-1, goldenRatio, 0],
        [0, 1, goldenRatio],
        [-goldenRatio, 0, 1]
    ]
    ,
    [
        [-1, goldenRatio, 0],
        [0, 1, -goldenRatio],
        [-goldenRatio, 0, -1]
    ]
    ,
    [
        [-1, -goldenRatio, 0],
        [0, -1, goldenRatio],
        [-goldenRatio, 0, 1]
    ]
    ,
    [
        [-1, -goldenRatio, 0],
        [0, -1, -goldenRatio],
        [-goldenRatio, 0, -1]
    ]
    ,
    [
    [0, 1, goldenRatio],
    [0, -1, goldenRatio]
    ]
    ,
    [
    [0, 1, -goldenRatio],
    [0, -1, -goldenRatio]
    ]
    ,
    [
    [goldenRatio, 0, 1],
    [goldenRatio, 0, -1]
    ]
    ,
    [
    [-goldenRatio, 0, 1],
    [-goldenRatio, 0, -1]
    ]
    ,
    [
    [1, goldenRatio, 0],
    [-1, goldenRatio, 0]
    ]
    ,
    [
    [1, -goldenRatio, 0],
    [-1, -goldenRatio, 0]
    ]
];