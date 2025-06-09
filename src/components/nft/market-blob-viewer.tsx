"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  Environment,
  useEnvironment,
} from "@react-three/drei";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// Raw shader code
const vertexShader = `
uniform vec3 scale;
varying vec3 vPosition;
varying vec2 vUv;
  
void main() {
  // Apply individual axis scaling to the vertex position
  vec3 scaledPosition = position * scale;
  
  vPosition = scaledPosition;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
}
`;

const fragmentShader = `
uniform float time;
varying vec3 vPosition;
varying vec2 vUv;

// Color uniforms
uniform vec3 colors[6];
uniform int colorCount;
uniform bool isHorizontalGradient;
uniform float gradientMultiply;
uniform float gradientIntersection;

// Material uniforms
uniform float roughness;
uniform float metalness;
uniform float envMapIntensity;
uniform bool useEnvMap;

// Strip uniforms
uniform bool horizontalStrips;
uniform vec3 horizontalStripColor;
uniform float horizontalStripWidth;
uniform float horizontalStripCount;

uniform bool verticalStrips;
uniform vec3 verticalStripColor;
uniform float verticalStripWidth;
uniform float verticalStripCount;

// Gradient interpolation function
vec3 getGradientColor(float t) {
  // Apply gradient multiply to create repeating patterns
  float adjustedT = fract(t * gradientMultiply);
  
  // Ensure t is in [0, 1]
  adjustedT = clamp(adjustedT, 0.0, 1.0);
  
  // For a single color, just return it
  if (colorCount <= 1) {
    return colors[0];
  }
  
  // Apply intersection adjustment
  // When gradientIntersection is 0, colors blend smoothly
  // When gradientIntersection is 1, colors have sharp boundaries
  float sharpness = gradientIntersection;
  
  // For multiple colors, find the right segment and interpolate
  float segmentLength = 1.0 / float(colorCount - 1);
  int segment = int(adjustedT / segmentLength);
  
  // Ensure we don't go out of bounds
  segment = min(segment, colorCount - 2);
  
  // Calculate local t within segment
  float localT = (adjustedT - float(segment) * segmentLength) / segmentLength;
  
  // Apply sharpness to localT for more defined color boundaries
  if (sharpness > 0.0) {
    // This creates sharper transitions between colors
    localT = smoothstep(sharpness * 0.5, 1.0 - sharpness * 0.5, localT);
  }
  
  // Interpolate between the two colors in this segment
  return mix(colors[segment], colors[segment + 1], localT);
}

void main() {
  // Create animated wave patterns
  float wave1 = sin(vUv.x * 10.0 + time);
  float wave2 = sin(vUv.y * 8.0 + time * 0.8);
  float wave3 = sin(vPosition.z * 6.0 + time * 1.2);
  
  // Combine waves
  float combinedWaves = (wave1 + wave2 + wave3) / 3.0;
  
  // Use either horizontal or vertical UV coordinate for the gradient
  float gradientCoord = isHorizontalGradient ? vUv.x : vUv.y;
  
  // Get color from gradient
  vec3 gradientColor = getGradientColor(gradientCoord);
    // Mix colors based on waves and position
  vec3 finalColor = gradientColor;
  
  // Add wave influence
  finalColor = mix(finalColor, finalColor * (1.0 + combinedWaves * 0.3), 0.5);
    // Apply environment map effect when enabled
  // This simulates how the material would interact with the environment
  if (useEnvMap) {
    // For environment map simulation we'll create a fake reflection vector
    // Normal would typically come from vertex shader in a real PBR setup
    vec3 normal = normalize(vec3(
      sin(vPosition.x * 10.0 + time) * 0.2,
      sin(vPosition.y * 8.0 + time * 0.8) * 0.2,
      cos(vPosition.z * 6.0 + time * 1.2)
    ));
    
    // Fake view vector pointing towards camera
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    
    // Create fake reflection vector
    vec3 reflection = reflect(viewDir, normal);
    
    // Create fake environment reflection color based on the reflection vector
    // This simulates what an environment map would look like
    vec3 envReflection = vec3(
      0.5 + 0.5 * reflection.x,
      0.5 + 0.5 * reflection.y,
      0.5 + 0.5 * reflection.z
    );
    
    // Apply environment map intensity
    envReflection *= envMapIntensity;
    
    // Blend environment reflection with material color based on metalness and roughness
    float reflectionStrength = (1.0 - roughness) * max(0.2, metalness);
    
    // Metals reflect environment with their own color tint
    if (metalness > 0.0) {
      envReflection = mix(envReflection, envReflection * finalColor, metalness);
    }
    
    // Apply the environment reflection
    finalColor = mix(finalColor, finalColor + envReflection, reflectionStrength);
  } else {
    // Standard metalness effect when no environment map is used
    if (metalness > 0.0) {
      // Simulate metallic reflections by enhancing high points in wave
      float reflectionStrength = max(0.0, combinedWaves) * metalness;
      // Metals tint their reflections with their own color
      vec3 metallicReflection = mix(vec3(1.0), finalColor, 0.6) * reflectionStrength;
      finalColor = mix(finalColor, finalColor + metallicReflection, metalness);
    }
  }
  
  // Apply roughness effect - rougher surfaces appear more diffuse and less shiny
  // Lower roughness makes highlights more concentrated and sharper
  float roughnessEffect = 1.0 - roughness; // Invert for clearer effect control
  
  // Add pulsing glow affected by roughness
  float pulse = 0.5 + 0.5 * sin(time * 0.5);
  // Rougher surfaces have more diffuse and less specular reflection
  float adjustedGlow = pulse * 0.2 * roughnessEffect;
  finalColor += adjustedGlow;
  
  // Apply horizontal strips if enabled
  if (horizontalStrips) {
    float yStrip = fract(vUv.y * horizontalStripCount);
    if (yStrip < horizontalStripWidth || yStrip > (1.0 - horizontalStripWidth)) {
      finalColor = horizontalStripColor;
    }
  }
  
  // Apply vertical strips if enabled
  if (verticalStrips) {
    float xStrip = fract(vUv.x * verticalStripCount);
    if (xStrip < verticalStripWidth || xStrip > (1.0 - verticalStripWidth)) {
      finalColor = verticalStripColor;
    }
  }
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const Blob = ({ data }: any) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const standardMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Create a texture for the standard material when using environment maps
  const gradientTexture = useRef<THREE.Texture | null>(null);
  useEffect(() => {
    if (data.environmentMapEnabled) {
      // Create a canvas for the gradient texture
      const canvas = document.createElement("canvas");
      canvas.width = 1024; // Higher resolution for better quality
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create gradient based on direction
        let gradient;
        if (data.gradientDirection === "horizontal") {
          gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        } else {
          gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        }

        // For single color or no colors, create a solid fill
        if (data.colors.length <= 1) {
          ctx.fillStyle = data.colors.length === 1 ? data.colors[0] : "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // Add color stops for multiple colors
          data.colors.forEach((color: any, index: number) => {
            // Apply gradient multiplication by repeating color stops
            const repeatCount = Math.max(
              1,
              Math.min(10, data.gradientMultiply)
            );

            // Apply intersection parameter - when high, create sharper boundaries with double stops
            const intersectionFactor = data.gradientIntersection;

            for (let i = 0; i < repeatCount; i++) {
              const basePosition =
                (index / (data.colors.length - 1) + i) / repeatCount;

              if (basePosition <= 1) {
                if (
                  intersectionFactor > 0 &&
                  index > 0 &&
                  index < data.colors.length - 1
                ) {
                  // Create sharper transitions with multiple close color stops
                  const sharpnessFactor = intersectionFactor * 0.03;
                  gradient.addColorStop(
                    Math.max(0, basePosition - sharpnessFactor),
                    color
                  );
                  gradient.addColorStop(basePosition, color);
                  gradient.addColorStop(
                    Math.min(1, basePosition + sharpnessFactor),
                    color
                  );
                } else {
                  // Normal color stop
                  gradient.addColorStop(basePosition, color);
                }
              }
            }
          });

          // Fill with gradient
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Add strips if enabled
        if (data.horizontalStrips) {
          ctx.fillStyle = data.horizontalStripColor;
          const stripHeight = canvas.height / data.horizontalStripCount;
          const actualStripWidth = stripHeight * data.horizontalStripWidth;

          for (let i = 0; i < data.horizontalStripCount; i++) {
            const y = i * stripHeight;
            ctx.fillRect(0, y, canvas.width, actualStripWidth);
            ctx.fillRect(
              0,
              y + stripHeight - actualStripWidth,
              canvas.width,
              actualStripWidth
            );
          }
        }

        if (data.verticalStrips) {
          ctx.fillStyle = data.verticalStripColor;
          const stripWidth = canvas.width / data.verticalStripCount;
          const actualStripWidth = stripWidth * data.verticalStripWidth;

          for (let i = 0; i < data.verticalStripCount; i++) {
            const x = i * stripWidth;
            ctx.fillRect(x, 0, actualStripWidth, canvas.height);
            ctx.fillRect(
              x + stripWidth - actualStripWidth,
              0,
              actualStripWidth,
              canvas.height
            );
          }
        }

        // Create texture from canvas
        if (gradientTexture.current) {
          gradientTexture.current.dispose();
        }

        gradientTexture.current = new THREE.CanvasTexture(canvas);
        gradientTexture.current.needsUpdate = true;

        // Apply texture to material if it exists
        if (standardMaterialRef.current) {
          standardMaterialRef.current.map = gradientTexture.current;
          standardMaterialRef.current.needsUpdate = true;
        }
      }
    }

    return () => {
      if (gradientTexture.current) {
        gradientTexture.current.dispose();
      }
    };
  }, [
    data.colors,
    data.environmentMapEnabled,
    data.gradientDirection,
    data.gradientMultiply,
    data.horizontalStrips,
    data.horizontalStripColor,
    data.horizontalStripWidth,
    data.horizontalStripCount,
    data.verticalStrips,
    data.verticalStripColor,
    data.verticalStripWidth,
    data.verticalStripCount,
  ]);

  // Helper function to convert a hex color string to RGB vector
  const hexToRgb = (hex: string): THREE.Vector3 => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new THREE.Vector3(r, g, b);
  }; // Create uniforms for the shader
  const uniforms = useRef({
    time: { value: 0 },
    radius: { value: data.radius },
    resolution: {
      value: new THREE.Vector2(data.widthSegments, data.heightSegments),
    },
    scale: { value: new THREE.Vector3(data.scaleX, data.scaleY, data.scaleZ) },

    // Color uniforms
    colors: {
      value: Array(6)
        .fill(null)
        .map((_, i) =>
          i < data.colors.length
            ? hexToRgb(data.colors[i])
            : new THREE.Vector3(0, 0, 0)
        ),
    },
    colorCount: { value: data.colors.length },
    isHorizontalGradient: { value: data.gradientDirection === "horizontal" },
    gradientMultiply: { value: data.gradientMultiply },
    gradientIntersection: { value: data.gradientIntersection },

    // Material uniforms
    roughness: { value: data.roughness },
    metalness: { value: data.metalness },

    // Environment map uniforms
    envMapIntensity: { value: data.environmentMapIntensity },
    useEnvMap: { value: data.environmentMapEnabled },

    // Horizontal strip uniforms
    horizontalStrips: { value: data.horizontalStrips },
    horizontalStripColor: { value: hexToRgb(data.horizontalStripColor) },
    horizontalStripWidth: { value: data.horizontalStripWidth },
    horizontalStripCount: { value: data.horizontalStripCount },

    // Vertical strip uniforms
    verticalStrips: { value: data.verticalStrips },
    verticalStripColor: { value: hexToRgb(data.verticalStripColor) },
    verticalStripWidth: { value: data.verticalStripWidth },
    verticalStripCount: { value: data.verticalStripCount },
  });

  // Update uniforms when parameters change
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.radius.value = data.radius;
      materialRef.current.uniforms.resolution.value.set(
        data.widthSegments,
        data.heightSegments
      );
      materialRef.current.uniforms.scale.value.set(
        data.scaleX,
        data.scaleY,
        data.scaleZ
      ); // Update color uniforms
      for (let i = 0; i < 6; i++) {
        if (i < data.colors.length) {
          materialRef.current.uniforms.colors.value[i] = hexToRgb(
            data.colors[i]
          );
        } else {
          materialRef.current.uniforms.colors.value[i] = new THREE.Vector3(
            0,
            0,
            0
          );
        }
      }
      materialRef.current.uniforms.colorCount.value = data.colors.length;
      materialRef.current.uniforms.isHorizontalGradient.value =
        data.gradientDirection === "horizontal";
      materialRef.current.uniforms.gradientMultiply.value =
        data.gradientMultiply;
      materialRef.current.uniforms.gradientIntersection.value =
        data.gradientIntersection; // Update material uniforms
      materialRef.current.uniforms.roughness.value = data.roughness;
      materialRef.current.uniforms.metalness.value = data.metalness;

      // Update environment map uniforms
      materialRef.current.uniforms.envMapIntensity.value =
        data.environmentMapIntensity;
      materialRef.current.uniforms.useEnvMap.value = data.environmentMapEnabled;

      // Update strip uniforms
      materialRef.current.uniforms.horizontalStrips.value =
        data.horizontalStrips;
      materialRef.current.uniforms.horizontalStripColor.value = hexToRgb(
        data.horizontalStripColor
      );
      materialRef.current.uniforms.horizontalStripWidth.value =
        data.horizontalStripWidth;
      materialRef.current.uniforms.horizontalStripCount.value =
        data.horizontalStripCount;

      materialRef.current.uniforms.verticalStrips.value = data.verticalStrips;
      materialRef.current.uniforms.verticalStripColor.value = hexToRgb(
        data.verticalStripColor
      );
      materialRef.current.uniforms.verticalStripWidth.value =
        data.verticalStripWidth;
      materialRef.current.uniforms.verticalStripCount.value =
        data.verticalStripCount;
    }
  });
  return (
    <mesh scale={[data.scaleX, data.scaleY, data.scaleZ]}>
      <sphereGeometry
        args={[data.radius, data.widthSegments, data.heightSegments]}
      />
      {data.environmentMapEnabled ? (
        <meshStandardMaterial
          ref={standardMaterialRef}
          metalness={data.metalness}
          roughness={data.roughness}
          envMapIntensity={data.environmentMapIntensity}
          wireframe={data.wireframeEnabled}
          // Use the first color as base color if no gradient texture is available yet
          color={data.colors.length > 0 ? data.colors[0] : "#ffffff"}
        />
      ) : (
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms.current}
          transparent
          wireframe={data.wireframeEnabled}
        />
      )}
    </mesh>
  );
};

// Function component to render environment
const EnvironmentMap = ({ data }: any) => {
  if (!data.environmentMapEnabled) return null;

  return (
    <Environment
      preset={data.environmentMapType}
      background={data.showEnvironmentBackground}
      resolution={256} // Lower resolution for better performance
    />
  );
};

const MarketBlobView = ({ data }: any) => {
  return (
    <>
      <Canvas gl={{ antialias: true }} camera={{ position: [2, 2, 2] }}>
        {data.bloomEnabled && (
          <EffectComposer>
            <Bloom
              mipmapBlur
              intensity={data.bloomIntensity}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        )}

        {/* lights */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[0, 10, 0]}
          intensity={data.lightIntensity}
        />

        {/* Environment map */}
        <Suspense
          fallback={
            <Center>
              <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#2a6af7" wireframe />
              </mesh>
            </Center>
          }
        >
          <EnvironmentMap data={data} />
        </Suspense>

        <OrbitControls
          makeDefault
          autoRotate={data.autoRotateEnabled}
          autoRotateSpeed={data.autoRotateSpeed}
          enablePan={false}
        />
        <Suspense
          fallback={
            <Center>
              <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#2a6af7" wireframe />
              </mesh>
            </Center>
          }
        >
          <Center>
            <Blob data={data} />
          </Center>
        </Suspense>
      </Canvas>
    </>
  );
};

export default MarketBlobView;
