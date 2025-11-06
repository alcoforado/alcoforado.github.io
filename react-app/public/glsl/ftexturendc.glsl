# version 300 es
precision mediump float;
uniform sampler2D sampler;
out vec4 color;
in vec2 texCoordV
void main() {
    color=texture2D(sampler,texCoordV)
 }
