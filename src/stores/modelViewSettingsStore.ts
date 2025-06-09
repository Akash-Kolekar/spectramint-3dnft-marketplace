import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ModelViewSettingsState {
  orbitControls: boolean;
  pivotControls: boolean;
  backgroundColor: string;
  autoRotate: boolean;
  environmentBackground: boolean;
  bloomIntensity: number;
  showEnvironment: boolean;
  setOrbitControls: (value: boolean) => void;
  setPivotControls: (value: boolean) => void;
  setBackgroundColor: (value: string) => void;
  setAutoRotate: (value: boolean) => void;
  setEnvironmentBackground: (value: boolean) => void;
  setBloomIntensity: (value: number) => void;
  setShowEnvironment: (value: boolean) => void;
}

export const useModelViewSettingsStore = create<ModelViewSettingsState>()(
  persist(
    (set) => ({
      orbitControls: false, // default value
      pivotControls: false, // default value
      backgroundColor: "transparent",
      autoRotate: true, // default value
      environmentBackground: true, // default value
      bloomIntensity: 0.1, // default value
      showEnvironment: true, // default value
      setOrbitControls: (value: boolean) => set({ orbitControls: value }),
      setPivotControls: (value: boolean) => set({ pivotControls: value }),
      setBackgroundColor: (value: string) => set({ backgroundColor: value }),
      setAutoRotate: (value: boolean) => set({ autoRotate: value }),
      setEnvironmentBackground: (value: boolean) =>
        set({ environmentBackground: value }),
      setBloomIntensity: (value: number) => set({ bloomIntensity: value }),
      setShowEnvironment: (value: boolean) => set({ showEnvironment: value }),
    }),
    {
      name: "model-view-settings", // unique name for the localStorage key
      storage: createJSONStorage(() => localStorage), // Use createJSONStorage to specify localStorage
    }
  )
);
