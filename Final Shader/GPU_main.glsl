const vs = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec3 a_tangent;
in vec2 a_texcoord;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform vec3 u_viewWorldPosition;

out vec3 v_normal;
out vec3 v_tangent;
out vec3 v_surfaceToView;
out vec2 v_texcoord;
out vec4 v_color;

void main() {
  vec4 worldPosition = u_world * a_position;
  gl_Position = u_projection * u_view * worldPosition;
  v_surfaceToView = u_viewWorldPosition - worldPosition.xyz;

  mat3 normalMat = transpose(inverse(mat3(u_world)));
  v_normal = normalize(normalMat * a_normal);
  v_tangent = normalize(normalMat * a_tangent);

  // v_texcoord = a_texcoord;
  v_texcoord.s = cos(0.0f) * a_texcoord.s - sin(0.0f) * a_texcoord.t; 
  v_texcoord.t = sin(0.0f) * a_texcoord.s + cos(0.0f) * a_texcoord.t; 
  v_color = a_color;
}
`;

const fs = `#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_tangent;
in vec3 v_surfaceToView;
in vec2 v_texcoord;
in vec4 v_color;

uniform vec3 diffuse;
uniform sampler2D diffuseMap;
uniform vec3 ambient;
uniform vec3 emissive;
uniform vec3 specular;
uniform sampler2D specularMap;
uniform float shininess;
uniform sampler2D normalMap;
uniform float opacity;
uniform vec3 u_lightDirection;
uniform vec3 u_ambientLight;

out vec4 outColor;

uniform samplerCube u_texture;
uniform float u_time;

vec3 our_refract(vec3 I, vec3 N, float eta) {
  return vec3(0.0f, 0.0f, 0.0f);
}

/* Fresnel equations (1821) */
float fresnel(vec3 I, vec3 N, float eta) {
  float Rs = 0.0f
  float Rp = 0.0f;
  return 0.5f * (Rs + Rp);
}

/* Schlick's approximation (1994) */
float fresnel_schlick(vec3 I, vec3 N, float eta) {
  return mix(pow(1.0f + dot(I, N), 5.0f), 1.0f, pow((eta - 1.0f) / (eta + 1.0f), 2.0f));
}

void main() {
  vec3 normal = normalize(v_normal) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );
  vec3 tangent = normalize(v_tangent) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );
  vec3 bitangent = normalize(cross(normal, tangent));

  mat3 tbn = mat3(tangent, bitangent, normal);
  normal = texture(normalMap, v_texcoord).rgb * 2. - 1.;
  normal = normalize(tbn * normal);

  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(u_lightDirection + surfaceToViewDirection);

  float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
  float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);
  vec4 specularMapColor = texture(specularMap, v_texcoord);
  vec3 effectiveSpecular = specular * specularMapColor.rgb;

  vec4 diffuseMapColor = texture(diffuseMap, v_texcoord);
  vec3 effectiveDiffuse = diffuse * diffuseMapColor.rgb * v_color.rgb;
  float effectiveOpacity = opacity * diffuseMapColor.a * v_color.a;

  // outColor = vec4(
  //     emissive +
  //     ambient * u_ambientLight +
  //     effectiveDiffuse * fakeLight +
  //     effectiveSpecular * pow(specularLight, shininess),
  //     effectiveOpacity);

  vec3 reflectedColor =
      emissive +
      ambient * u_ambientLight +
      effectiveDiffuse * fakeLight +
      effectiveSpecular * pow(specularLight, shininess);
  
  // float n1 = 1.0f;     // Vacuum
  // float n1 = 1.0003f;  // Air
  // float n2 = 1.55f;    // Flint glass
  // float n2 = 2.417f;   // Diamond
  
  // Crown glass
  vec3 eta; // eta = n1 / n2
  eta.r = 1.0003f / 1.513f;
  eta.g = 1.0003f / 1.519f;
  eta.b = 1.0003f / 1.528f;
  // eta.r = 1.003f / (1.519f * 0.9f);
  // eta.g = 1.003f / (1.519f * 1.0f);
  // eta.b = 1.003f / (1.519f * 1.1f);

  vec3 I = -surfaceToViewDirection;
  vec3 N = normal;
  
  vec3 refractedColor;
  refractedColor.r = texture(u_texture, refract(I, N, eta.r)).r;
  refractedColor.g = texture(u_texture, refract(I, N, eta.g)).g;
  refractedColor.b = texture(u_texture, refract(I, N, eta.b)).b;
  
  vec3 Reff;
  Reff.r = fresnel(I, N, eta.r);
  Reff.g = fresnel(I, N, eta.g);
  Reff.b = fresnel(I, N, eta.b);

  outColor.r = mix(refractedColor.r, reflectedColor.r, 0.0f);
  outColor.g = mix(refractedColor.g, reflectedColor.g, 0.0f);
  outColor.b = mix(refractedColor.b, reflectedColor.b, 0.0f);
  // outColor.r = mix(refractedColor.r, reflectedColor.r, Reff.r);
  // outColor.g = mix(refractedColor.g, reflectedColor.g, Reff.g);
  // outColor.b = mix(refractedColor.b, reflectedColor.b, Reff.b);
  // outColor.r = mix(refractedColor.r, reflectedColor.r, clamp(u_time, Reff.r, 1.0f));
  // outColor.g = mix(refractedColor.g, reflectedColor.g, clamp(u_time, Reff.r, 1.0f));
  // outColor.b = mix(refractedColor.b, reflectedColor.b, clamp(u_time, Reff.r, 1.0f));
  outColor.a = effectiveOpacity;
}
`;

var skyboxVertexShaderSource = `#version 300 es
in vec4 a_position;
out vec4 v_position;
void main() {
  v_position = a_position;
  gl_Position = vec4(a_position.xy, 1, 1);
}
`;

var skyboxFragmentShaderSource = `#version 300 es
precision highp float;

uniform samplerCube u_skybox;
uniform mat4 u_viewDirectionProjectionInverse;

in vec4 v_position;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  vec4 t = u_viewDirectionProjectionInverse * v_position;
  outColor = texture(u_skybox, normalize(t.xyz / t.w));
}
`;
