"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  OrbitControls,
  PivotControls,
  Center,
  Environment,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { useModelViewSettingsStore } from "@/stores/modelViewSettingsStore";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Progress } from "@/components/ui/progress";

type Props = {
  modelUrl: string;
};

const Model = ({ modelUrl }: Props) => {
  const { pivotControls } = useModelViewSettingsStore();

  const group = useRef<THREE.Group>(null);

  // Load the GLTF model
  const { scene, materials, animations } = useGLTF(modelUrl);

  // Handle animations
  const { actions } = useAnimations(animations, group);

  React.useEffect(() => {
    // Play the animation if it exists
    if (actions) {
      actions[Object.keys(actions)[0]]?.play();
    }
  }, [actions]);

  useFrame(() => {
    // Ensure depthWrite is enabled for all mesh materials to fix transparency issues
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.depthWrite = true; // Ensures depth writing to avoid transparency
        // child.material.transparent = false; // Disable transparency if not needed
        child.material.toneMapped = false;
      }
    });
  });

  return (
    <Center>
      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        visible={pivotControls}
        disableRotations={!pivotControls}
        disableAxes={!pivotControls}
        disableScaling={true}
        disableSliders={!pivotControls}
      >
        <primitive ref={group} object={scene} />
      </PivotControls>
    </Center>
  );
};

const CreateModelView = ({ modelUrl }: Props) => {
  const {
    orbitControls,
    backgroundColor,
    autoRotate,
    environmentBackground,
    bloomIntensity,
    showEnvironment,
  } = useModelViewSettingsStore();

  const { progress } = useProgress();

  useEffect(() => {
    console.log(Math.round(progress));
  }, [progress]);

  return (
    <>
      {/* <Leva hideCopyButton={true} /> */}
      <div
        className="h-full w-full bg-background flex items-center flex-col gap-2 justify-center"
        style={{ display: progress === 100 ? "none" : "flex" }}
      >
        <Progress value={progress} className="w-[60%] h-4" />
        <h6>{`Loading: ${Math.round(progress)}%`}</h6>
      </div>
      <Canvas gl={{ antialias: true }} camera={{ position: [5, 3, 5] }}>
        {backgroundColor !== "transparent" && (
          <color args={[backgroundColor]} attach={"background"} />
        )}{" "}
        {/* postprocessing */}
        <EffectComposer>
          <Bloom mipmapBlur intensity={bloomIntensity} />
        </EffectComposer>{" "}
        {/** todos
         *
         * add environment for reflections
         *
         */}
        {showEnvironment && (
          <Environment
            files="/royal_esplanade_4k.hdr"
            background={environmentBackground}
          />
        )}
        {/* lights */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 10, 0]} intensity={3} />
        {/* front lights */}
        {/* <directionalLight position={[-10, 10, 10]} intensity={3} />
        <directionalLight position={[0, 10, 10]} intensity={3} />
        <directionalLight position={[10, 10, 10]} intensity={3} /> */}
        {/* back lights */}
        {/* <directionalLight position={[-10, 10, -10]} intensity={3} />
        <directionalLight position={[0, 10, -10]} intensity={3} />
        <directionalLight position={[10, 10, -10]} intensity={3} /> */}
        {/* Environment */}
        <Suspense fallback={null}>
          {/* <Environment preset="city" background={false} /> */}
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          enablePan={false}
          enableRotate={orbitControls}
          enableZoom={orbitControls}
        />
        <Suspense>
          <Model modelUrl={modelUrl} />
        </Suspense>
      </Canvas>
    </>
  );
};

export default CreateModelView;
