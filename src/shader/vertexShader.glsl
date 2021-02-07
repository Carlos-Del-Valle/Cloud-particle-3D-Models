// attribute vec3 position;
attribute vec3 aRandom;

varying vec3 vPosition;

uniform float uTime;
uniform float uScale;

void main() {
    vPosition = position;

    vec3 pos = position;

    float time = uTime * 4.;
    pos.x += sin(time * aRandom.x) * 0.01;
    pos.y += cos(time * aRandom.y) * 0.01;
    pos.z += cos(time * aRandom.z) * 0.01;

    pos.x *= uScale + sin(pos.y * 4. + time) * (1. - uScale);
    pos.y *= uScale + cos(pos.z * 4. + time) * (1. - uScale);
    pos.z *= uScale + cos(pos.x * 4. + time) * (1. - uScale);

    pos *= uScale;


    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
    gl_PointSize = 8.0 / length(viewMatrix * worldPosition);
}