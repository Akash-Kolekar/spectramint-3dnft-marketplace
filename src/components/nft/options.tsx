"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useModelViewSettingsStore } from "@/stores/modelViewSettingsStore";
import { useSearchParams } from "next/navigation";
import ColorPicker from "../ui/color-picker";
import { Slider } from "../ui/slider";

type Props = {};

const EditorSidebar = (props: Props) => {
  const {
    orbitControls,
    setOrbitControls,
    pivotControls,
    setPivotControls,
    backgroundColor,
    setBackgroundColor,
    autoRotate,
    setAutoRotate,
    environmentBackground,
    setEnvironmentBackground,
    bloomIntensity,
    setBloomIntensity,
    showEnvironment,
    setShowEnvironment,
  } = useModelViewSettingsStore();

  // Handle changes for each control
  const handleOrbitControlsChange = (checked: boolean) => {
    setOrbitControls(checked);
  };

  const handlePivotControlsChange = (checked: boolean) => {
    setPivotControls(checked);
  };

  const handleAutoRotateChange = (checked: boolean) => {
    setAutoRotate(checked);
  };

  const handleEnvironmentBackgroundChange = (checked: boolean) => {
    setEnvironmentBackground(checked);
  };

  const handleShowEnvironmentChange = (checked: boolean) => {
    setShowEnvironment(checked);
  };

  return (
    <div className=" bg-background border-border border rounded-sm p-3">
      {/* <h1 className="font-bold mb-3">Options</h1> */}{" "}
      <ul className="space-y-2">
        {/* Camera Controls Section */}
        <li className="flex items-center space-x-2">
          <Switch
            id="orbit-controls"
            checked={orbitControls}
            onCheckedChange={handleOrbitControlsChange}
          />
          <Label className="cursor-pointer" htmlFor="orbit-controls">
            Orbit Controls
          </Label>
        </li>

        <li className="flex items-center space-x-2">
          <Switch
            id="auto-rotate"
            checked={autoRotate}
            onCheckedChange={handleAutoRotateChange}
          />
          <Label className="cursor-pointer" htmlFor="auto-rotate">
            Auto Rotate
          </Label>
        </li>

        <li className="flex items-center space-x-2">
          <Switch
            id="pivot-controls"
            checked={pivotControls}
            onCheckedChange={handlePivotControlsChange}
          />
          <Label className="cursor-pointer" htmlFor="pivot-controls">
            Pivot Controls
          </Label>
        </li>

        {/* Environment Controls Section */}
        <li className="flex items-center space-x-2">
          <Switch
            id="show-environment"
            checked={showEnvironment}
            onCheckedChange={handleShowEnvironmentChange}
          />
          <Label className="cursor-pointer" htmlFor="show-environment">
            Show Environment
          </Label>
        </li>

        <li className="flex items-center space-x-2">
          <Switch
            id="environment-background"
            checked={environmentBackground}
            onCheckedChange={handleEnvironmentBackgroundChange}
            disabled={!showEnvironment}
          />
          <Label
            className={`cursor-pointer ${
              !showEnvironment ? "text-muted-foreground" : ""
            }`}
            htmlFor="environment-background"
          >
            Environment as Background
          </Label>
        </li>

        <li className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bloom-intensity">Bloom Intensity</Label>
            <span className="text-sm text-muted-foreground">
              {bloomIntensity.toFixed(2)}
            </span>
          </div>
          <Slider
            id="bloom-intensity"
            min={0}
            max={1}
            step={0.01}
            value={[bloomIntensity]}
            onValueChange={(value) => setBloomIntensity(value[0])}
          />
        </li>

        <li className="">
          <ColorPicker
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          />
        </li>
      </ul>
    </div>
  );
};

export default EditorSidebar;
