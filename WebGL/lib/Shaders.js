Shader2D = function(gl)
{
    verticeShaderSource = "\
     attribute vec2 a_position;\
     varying vec2 f_color;\
    void main() {\
        gl_Position = vec4(a_position, 0, 1);\
        f_color=a_position;\
    }";
    pixelShaderSource = "\
    varying mediump vec2 f_color;\
    void main() {\
    gl_FragColor = vec4((f_color.x+1.0)/2.0,(f_color.y+1.0)/2.0,0,1);  \
}";

    var  vertexShader   =  glUtils.loadShader(gl, verticeShaderSource, gl.VERTEX_SHADER);
    var  fragmentShader =  glUtils.loadShader(gl, pixelShaderSource,gl.FRAGMENT_SHADER) 
    var program = glUtils.createProgram(gl, [vertexShader, fragmentShader]);
            
        
        

    return {
        program: program,
    
        shapes: [], 

        draw: function() {
            gl.useProgram(program);

            // look up where the vertex data needs to go.
            var positionLocation = gl.getAttribLocation(program, "a_position");

            // Create a buffer and put a single clipspace rectangle in
            // it (2 triangles)
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            var iBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer)

            var vertices = [];
            var indices = [];
            for (var i = 0; i < this.shapes.length; i++)
            {
                vertices= vertices.concat(this.shapes[i].writeVertices());
                indices = indices.concat(this.shapes[i].writeIndices());
            }

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
            gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(vertices), gl.STATIC_DRAW);

            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            // draw
            gl.drawElements(gl.TRIANGLES, indices.length,gl.UNSIGNED_SHORT,0);
        }
    }
}





ShaderColor2D = function (gl) {
    verticeShaderSource = "\
     attribute vec2 a_position;\
     attribute vec4 a_color;\
     varying vec4 f_color;\
    void main() {\
        gl_PointSize=10.0;\
        gl_Position = vec4(a_position, 0, 1);\
        f_color=a_color;\
    }";
    pixelShaderSource = "\
    varying mediump vec4 f_color;\
    void main() {\
    gl_FragColor = f_color;  \
}";

    var vertexShader = glUtils.loadShader(gl, verticeShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = glUtils.loadShader(gl, pixelShaderSource, gl.FRAGMENT_SHADER);
    var program = glUtils.createProgram(gl, [vertexShader, fragmentShader]);




    return {
        program: program,

        shapes: [],

        points: [],

        buffer: gl.createBuffer(),

        iBuffer: gl.createBuffer(),

        pointBuffer: gl.createBuffer(),

        draw: function () {
            gl.useProgram(program);

            // look up where the vertex data needs to go.
            var positionLocation = gl.getAttribLocation(program, "a_position");
            var colorLocation = gl.getAttribLocation(program, "a_color")

            
        //    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        //    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer)


            var vertices = [];
            var indices = [];
            var off = 0;
            for (var i = 0; i < this.shapes.length; i++) {
                var points = this.shapes[i].writeVertices();
                var colors = this.shapes[i].writeColors();
                if (points.length / 2 != colors.length / 4)
                    throw "Colors must be set for all points";
                var j = 0;
                var k = 0;
                while (j < points.length) {
                    vertices.push(points[j++]);
                    vertices.push(points[j++]);
                    vertices.push(colors[k++]);
                    vertices.push(colors[k++]);
                    vertices.push(colors[k++]);
                    vertices.push(colors[k++]);
                }
                var ind = this.shapes[i].writeIndices();
                for (var l = 0; l < ind.length ; l++) {
                    ind[l] += off;
                }
                off += points.length / 2;
                indices = indices.concat(ind);

            }


       //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        //    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW)
            gl.enableVertexAttribArray(positionLocation);
            gl.enableVertexAttribArray(colorLocation)
       //     gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 24, 0);
       //     gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 24, 2 * 4);

            // draw
        //    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);



            pointsV = [];
            for (var i = 0; i < this.points.length; i++) {
                pointsV.push(this.points[i].x);
                pointsV.push(this.points[i].y);
                pointsV.push(1.0);
                pointsV.push(1.0);
                pointsV.push(1.0);
                pointsV.push(1.0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsV), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 24, 2 * 4);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, this.points.length)
        }
    }
}
