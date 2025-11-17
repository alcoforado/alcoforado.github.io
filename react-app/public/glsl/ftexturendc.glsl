# version 300 es
precision mediump float;
uniform sampler2D sampler;
out vec4 color;
in vec2 texUVOut;
void main() {
    color=texture(sampler,texUVOut);
 }
