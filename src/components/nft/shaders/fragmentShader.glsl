uniform float time;
varying vec3 vPosition;

void main() {
  float intensity = 0.5 + 0.5 * sin(vPosition.x * 10.0 + time);
  gl_FragColor = vec4(intensity, intensity, intensity, 1.0);
}