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


function Buffer(gl,program,componentNames)
{
    this.VBuffer = gl.createBuffer()
    this.IBuffer = gl.createBuffer()
    this.Attributes=[]

    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.DYNAMIC_DRAW);
    

    for(var i=0;i<componentNames.length;i++)
    {
        this.Attributes.push(gl.getAttribLocation(program, componentNames[i]));
    }
}




ShaderColor2D = function (gl) {
    verticeShaderSource = "\
     attribute vec2 a_position;\
     attribute vec4 a_color;\
     varying vec4 f_color;\
    void main() {\
        gl_PointSize=1.0;\
        gl_Position = vec4(a_position, 0, 1);\
        f_color=a_color;\
    }";
    pixelShaderSource = "\
    varying mediump vec4 f_color;\
    void main() {\
    gl_FragColor = f_color;  \
}";

    var vertexShader   = glUtils.loadShader(gl, verticeShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = glUtils.loadShader(gl, pixelShaderSource, gl.FRAGMENT_SHADER);
    var program        = glUtils.createProgram(gl, [vertexShader, fragmentShader]);





    return {
        program: program,

        shapes: [],

        points: [],
        
        lineStrips: [],


        triaBuffer: new Buffer(gl,program,["a_position","a_color"]),
        pointBuffer: new Buffer(gl, program, ["a_position", "a_color"]),
        lineBuffer: new Buffer(gl,program,["a_position", "a_color"]),

        draw: function () {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.flush();

            gl.useProgram(program);


            
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triaBuffer.VBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triaBuffer.IBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
            gl.enableVertexAttribArray(this.triaBuffer.Attributes[0]);
            gl.enableVertexAttribArray(this.triaBuffer.Attributes[1]);
            gl.vertexAttribPointer(this.triaBuffer.Attributes[0], 2, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(this.triaBuffer.Attributes[1], 4, gl.FLOAT, false, 24, 2 * 4);


            // draw
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);



            pointsV = [];
            for (var i = 0; i < this.points.length; i++) {
                pointsV.push(this.points[i].x);
                pointsV.push(this.points[i].y);
                pointsV.push(1.0);
                pointsV.push(1.0);
                pointsV.push(1.0);
                pointsV.push(1.0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer.VBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsV), gl.DYNAMIC_DRAW);
            gl.enableVertexAttribArray(this.pointBuffer.Attributes[0]);
            gl.enableVertexAttribArray(this.pointBuffer.Attributes[1]);
            gl.vertexAttribPointer(this.pointBuffer.Attributes[0], 2, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(this.pointBuffer.Attributes[1], 4, gl.FLOAT, false, 24, 2 * 4);
            gl.drawArrays(gl.POINTS, 0, this.points.length)
            gl.flush()



            linesV = [];
            if (this.lineStrips.length != 0) {
                for (var i = 0; i < this.lineStrips.length; i++) {
                    var lS = this.lineStrips[i];

                    for (var j = 0; j < lS.length - 1 ; j++) {
                        linesV.push(lS[j].x);
                        linesV.push(lS[j].y);
                        linesV.push(lS[j].color.r);
                        linesV.push(lS[j].color.g);
                        linesV.push(lS[j].color.b);
                        linesV.push(lS[j].color.a);

                        linesV.push(lS[j+1].x);
                        linesV.push(lS[j+1].y);
                        linesV.push(lS[j+1].color.r);
                        linesV.push(lS[j+1].color.g);
                        linesV.push(lS[j+1].color.b);
                        linesV.push(lS[j+1].color.a);

                    }

                }


                gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer.VBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesV), gl.DYNAMIC_DRAW);
                gl.enableVertexAttribArray(this.lineBuffer.Attributes[0]);
                gl.enableVertexAttribArray(this.lineBuffer.Attributes[1]);
                gl.vertexAttribPointer(this.lineBuffer.Attributes[0], 2, gl.FLOAT, false, 24, 0);
                gl.vertexAttribPointer(this.lineBuffer.Attributes[1], 4, gl.FLOAT, false, 24, 2 * 4);
                gl.drawArrays(gl.LINES, 0, linesV.length/6)
                gl.flush()
            }


        }
    }
}
