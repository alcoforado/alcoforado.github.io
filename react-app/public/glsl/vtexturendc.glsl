# version 300 es
layout (location=0) in vec2 position;
layout (location=1) in vec2 texUV;
out vec2 texUVOut;
void main() {
    gl_Position=vec4(position,0.2,1);
    texUVOut=texUV;
 }
