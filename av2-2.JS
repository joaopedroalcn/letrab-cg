var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

// Verifique se o WebGL está disponível no navegador
if (!gl) {
    alert('WebGL não está disponível no seu navegador');
}

var points = [];
var delaunayTriangles = [];

function randomizePoints() {
    points = [];
    delaunayTriangles = [];
    for (var i = 0; i < 20; i++) {
        var x = Math.random() * 2 - 1; // Gerar coordenada X entre -1 e 1
        var y = Math.random() * 2 - 1; // Gerar coordenada Y entre -1 e 1
        points.push(x, y);
    }

    drawPoints();
}

function clearPoints() {
    points = [];
    delaunayTriangles = [];
    drawPoints();
}

function performDelaunayTriangulation() {
    if (points.length < 3) {
        alert('Pelo menos 3 pontos são necessários para a triangulação de Delaunay');
        return;
    }

    var delaunay = new Delaunator(points);

    delaunayTriangles = delaunay.triangles;

    drawTriangles();
}

function drawPoints() {
    // Limpar o canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Definir a cor dos pontos como verde
    gl.colorMask(true, true, true, true);
    gl.clearColor(0.0, 1.0, 0.0, 1.0);

    // Carregar os pontos para o buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    // Criar um shader para desenhar os pontos
    var vertexShaderSource = `
        attribute vec2 position;

        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
            gl_PointSize = 5.0;
        }
    `;
    var fragmentShaderSource = `
        void main() {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.useProgram(program);

    var positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Desenhar os pontos
    gl.drawArrays(gl.POINTS, 0, points.length / 2);
}

function drawTriangles() {
    // Limpar o canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Definir a cor dos triângulos como vermelho
    gl.colorMask(true, true, true, true);
    gl.clearColor(1.0, 0.0, 0.0, 1.0);

    // Carregar os triângulos para o buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(delaunayTriangles), gl.STATIC_DRAW);

    // Criar um shader para desenhar as linhas dos triângulos
    var vertexShaderSource = `
        attribute vec2 position;

        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;
    var fragmentShaderSource = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.useProgram(program);

    var positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Desenhar as linhas dos triângulos
    gl.drawElements(gl.LINE_LOOP, delaunayTriangles.length, gl.UNSIGNED_SHORT, 0);
}
