varying vec3 vPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
  vec2 uvPoint = gl_PointCoord - vec2(0.5);

  vec3 color = vec3(1., 0., 0.);
  color = vec3(1., 1., 0.);

  // color = vec3(vPosition.x, vPosition.y, vPosition.z);
  // vec3 color1 = vec3(0.132, 0.34, 0.5);
  // vec3 color2 = vec3(150./255., 130./255., 210./255.);
  
  float depth = vPosition.z * .5 + .5;
  color = mix(uColor1, uColor2, depth);

  gl_FragColor = vec4(color, depth * .3 + .2);
}