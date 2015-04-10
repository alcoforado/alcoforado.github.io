precision highp float;
attribute vec3 position;

struct VoronoiPoints {
 vec2 position; 
};

const int vpLength=50;
uniform VoronoiPoints VPs[vpLength];
uniform float lY;

varying vec2 fPosition;




void main()
{
  float result=1000.0;
  for(int i=0;i<vpLength;i++)
  {
    float newY = ((fPosition.x - VPs[i].position.x)*(fPosition.x - VPs[i].position.x)/
                  (VPs[i].position.y  - lY) + (VPs[i].position.y+lY))/2.0; 
  
    result = max(result,newY);
  
  }
  gl_Position = vec4(fPosition.x,result,0.2,1.0);
}


