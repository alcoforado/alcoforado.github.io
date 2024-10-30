# version 300 es

layout (location=0) in vec2 position;
layout (location=1) in vec4 vColor;
uniform int pointSize;
out vec4 fColor;

void main() {
    fColor=vColor;
    gl_Position=vec4(position,0.2,1);
    gl_PointSize=2.0;
    
}
