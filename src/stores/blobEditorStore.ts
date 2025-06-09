import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BlobEditorState {
  // Geometry parameters
  widthSegments: number;
  heightSegments: number;
  radius: number;

  // Scale parameters
  scaleX: number;
  scaleY: number;
  scaleZ: number; // Color parameters
  colors: string[];
  gradientDirection: "horizontal" | "vertical";
  gradientMultiply: number;
  gradientIntersection: number;
  // Material parameters
  roughness: number;
  metalness: number;
  // Environment map parameters
  environmentMapEnabled: boolean;
  environmentMapType:
    | "studio"
    | "city"
    | "dawn"
    | "night"
    | "warehouse"
    | "forest";
  environmentMapIntensity: number;
  showEnvironmentBackground: boolean;
  // Lighting parameters
  lightIntensity: number;
  bloomEnabled: boolean;
  bloomIntensity: number;
    // Wireframe
  wireframeEnabled: boolean;
  
  // Camera controls
  autoRotateEnabled: boolean;
  autoRotateSpeed: number;

  // Strip parameters
  horizontalStrips: boolean;
  horizontalStripColor: string;
  horizontalStripWidth: number;
  horizontalStripCount: number;

  verticalStrips: boolean;
  verticalStripColor: string;
  verticalStripWidth: number;
  verticalStripCount: number;

  // Reset function
  resetAllSettings: () => void;
  // Actions
  setWidthSegments: (value: number) => void;
  setHeightSegments: (value: number) => void;
  setRadius: (value: number) => void;
  setScaleX: (value: number) => void;
  setScaleY: (value: number) => void;
  setScaleZ: (value: number) => void;
  // Color actions
  setColors: (colors: string[]) => void;
  addColor: (color: string) => void;
  removeColor: (index: number) => void;
  updateColor: (index: number, color: string) => void;
  setGradientDirection: (direction: "horizontal" | "vertical") => void;
  setGradientMultiply: (value: number) => void;
  setGradientIntersection: (value: number) => void;
  // Material actions
  setRoughness: (value: number) => void;
  setMetalness: (value: number) => void;

  // Environment map actions
  setEnvironmentMapEnabled: (value: boolean) => void;
  setEnvironmentMapType: (
    value: "studio" | "city" | "dawn" | "night" | "warehouse" | "forest"
  ) => void;
  setEnvironmentMapIntensity: (value: number) => void;
  setShowEnvironmentBackground: (value: boolean) => void;

  // Strip actions
  setHorizontalStrips: (value: boolean) => void;
  setHorizontalStripColor: (value: string) => void;
  setHorizontalStripWidth: (value: number) => void;
  setHorizontalStripCount: (value: number) => void;
  setVerticalStrips: (value: boolean) => void;
  setVerticalStripColor: (value: string) => void;
  setVerticalStripWidth: (value: number) => void;
  setVerticalStripCount: (value: number) => void;
  // Lighting actions
  setLightIntensity: (value: number) => void;
  setBloomEnabled: (value: boolean) => void;
  setBloomIntensity: (value: number) => void;
    // Wireframe action
  setWireframeEnabled: (value: boolean) => void;
  
  // Camera control actions
  setAutoRotateEnabled: (value: boolean) => void;
  setAutoRotateSpeed: (value: number) => void;
}

export const useBlobEditorStore = create<BlobEditorState>()(
  persist(
    (set) => ({
      // Default values
      widthSegments: 32,
      heightSegments: 16,
      radius: 1,

      // Default scale values (1.0 = no scaling)
      scaleX: 1.0,
      scaleY: 1.0,
      scaleZ: 1.0, // Default color values
      colors: ["#2a6af7", "#9c27b0"], // Default initial colors: blue and purple
      gradientDirection: "horizontal",
      gradientMultiply: 1.0,
      gradientIntersection: 0.5,
      // Default material values
      roughness: 0.5, // Medium roughness
      metalness: 0.0, // Non-metallic by default      // Default environment map settings
      environmentMapEnabled: false,
      environmentMapType: "studio",
      environmentMapIntensity: 1.0,
      showEnvironmentBackground: false,      // Default lighting settings
      lightIntensity: 3.0,
      bloomEnabled: false,
      bloomIntensity: 0.5,
        // Default wireframe setting
      wireframeEnabled: false,
      
      // Default camera control settings
      autoRotateEnabled: true,
      autoRotateSpeed: 1.0,

      // Default strip values
      horizontalStrips: false,
      horizontalStripColor: "#000000",
      horizontalStripWidth: 0.05,
      horizontalStripCount: 5,

      verticalStrips: false,
      verticalStripColor: "#000000",
      verticalStripWidth: 0.05,
      verticalStripCount: 8,

      // Actions
      setWidthSegments: (value: number) => set({ widthSegments: value }),
      setHeightSegments: (value: number) => set({ heightSegments: value }),
      setRadius: (value: number) => set({ radius: value }),
      setScaleX: (value: number) => set({ scaleX: value }),
      setScaleY: (value: number) => set({ scaleY: value }),
      setScaleZ: (value: number) => set({ scaleZ: value }),

      // Color actions
      setColors: (colors: string[]) => set({ colors }),
      addColor: (color: string) =>
        set((state) => ({
          colors:
            state.colors.length < 6 ? [...state.colors, color] : state.colors,
        })),
      removeColor: (index: number) =>
        set((state) => ({
          colors:
            state.colors.length > 1
              ? state.colors.filter((_, i) => i !== index)
              : state.colors,
        })),
      updateColor: (index: number, color: string) =>
        set((state) => ({
          colors: state.colors.map((c, i) => (i === index ? color : c)),
        })),
      setGradientDirection: (direction: "horizontal" | "vertical") =>
        set({ gradientDirection: direction }),
      setGradientMultiply: (value: number) => set({ gradientMultiply: value }),
      setGradientIntersection: (value: number) =>
        set({ gradientIntersection: value }),
      // Material actions
      setRoughness: (value: number) => set({ roughness: value }),
      setMetalness: (value: number) => set({ metalness: value }),

      // Environment map actions
      setEnvironmentMapEnabled: (value: boolean) =>
        set({ environmentMapEnabled: value }),
      setEnvironmentMapType: (
        value: "studio" | "city" | "dawn" | "night" | "warehouse" | "forest"
      ) => set({ environmentMapType: value }),
      setEnvironmentMapIntensity: (value: number) =>
        set({ environmentMapIntensity: value }),
      setShowEnvironmentBackground: (value: boolean) =>
        set({ showEnvironmentBackground: value }),

      // Strip actions
      setHorizontalStrips: (value: boolean) => set({ horizontalStrips: value }),
      setHorizontalStripColor: (value: string) =>
        set({ horizontalStripColor: value }),
      setHorizontalStripWidth: (value: number) =>
        set({ horizontalStripWidth: value }),
      setHorizontalStripCount: (value: number) =>
        set({ horizontalStripCount: value }),
      setVerticalStrips: (value: boolean) => set({ verticalStrips: value }),
      setVerticalStripColor: (value: string) =>
        set({ verticalStripColor: value }),
      setVerticalStripWidth: (value: number) =>
        set({ verticalStripWidth: value }),
      setVerticalStripCount: (value: number) =>
        set({ verticalStripCount: value }),      // Lighting actions
      setLightIntensity: (value: number) => set({ lightIntensity: value }),
      setBloomEnabled: (value: boolean) => set({ bloomEnabled: value }),
      setBloomIntensity: (value: number) => set({ bloomIntensity: value }),
        // Wireframe action
      setWireframeEnabled: (value: boolean) => set({ wireframeEnabled: value }),
      
      // Camera control actions
      setAutoRotateEnabled: (value: boolean) => set({ autoRotateEnabled: value }),
      setAutoRotateSpeed: (value: number) => set({ autoRotateSpeed: value }),

      // Reset all settings to default values
      resetAllSettings: () =>
        set({
          widthSegments: 32,
          heightSegments: 16,
          radius: 1,
          scaleX: 1.0,
          scaleY: 1.0,
          scaleZ: 1.0,
          colors: ["#2a6af7", "#9c27b0"],
          gradientDirection: "horizontal",
          gradientMultiply: 1.0,
          gradientIntersection: 0.5,
          roughness: 0.5,
          metalness: 0.0,          environmentMapEnabled: false,
          environmentMapType: "studio",
          environmentMapIntensity: 1.0,
          showEnvironmentBackground: false,
          lightIntensity: 3.0,          bloomEnabled: false,
          bloomIntensity: 0.5,
          wireframeEnabled: false,
          autoRotateEnabled: true,
          autoRotateSpeed: 1.0,
          horizontalStrips: false,
          horizontalStripColor: "#000000",
          horizontalStripWidth: 0.05,
          horizontalStripCount: 5,
          verticalStrips: false,
          verticalStripColor: "#000000",
          verticalStripWidth: 0.05,
          verticalStripCount: 8,
        }),
    }),
    {
      name: "blob-editor-storage", // unique name for the storage
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);
