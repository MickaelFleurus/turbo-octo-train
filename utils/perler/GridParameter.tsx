import React from "react";

type GridParametersUIProps = {
  showGridPattern: boolean;
  setShowGridPattern: (value: boolean) => void;
  gridMainColor: string;
  setGridMainColor: (value: string) => void;
  gridBaseWidth: number;
  setGridBaseWidth: (value: number) => void;
  majorGridStyleEnabled: boolean;
  setMajorGridStyleEnabled: (value: boolean) => void;
  majorGridSpacing: number;
  setMajorGridSpacing: (value: number) => void;
  majorGridWidth: number;
  setMajorGridWidth: (value: number) => void;
  majorGridColor: string;
  setMajorGridColor: (value: string) => void;
};

export const GridParametersUI: React.FC<GridParametersUIProps> = ({
  showGridPattern,
  setShowGridPattern,
  gridMainColor,
  setGridMainColor,
  gridBaseWidth,
  setGridBaseWidth,
  majorGridStyleEnabled,
  setMajorGridStyleEnabled,
  majorGridSpacing,
  setMajorGridSpacing,
  majorGridWidth,
  setMajorGridWidth,
  majorGridColor,
  setMajorGridColor,
}) => {
  return (
    <>
      <div className="bg-mist-900 rounded-[10px] border border-gray-500 flex flex-col space-y-6">
        <h2 className=" p-2 text-lg font-semibold border-b">
          Grid pattern parameters
        </h2>
        <div className="flex flex-col pl-3 pb-3 gap-3">
          <div id="GridPattern" className="flex ">
            <label htmlFor="gridPatternCheckbox" className="mr-3">
              {" "}
              Show grid pattern:{" "}
            </label>
            <input
              type="checkbox"
              id="gridPatternCheckbox"
              checked={showGridPattern}
              onChange={(event) => setShowGridPattern(event.target.checked)}
            />
          </div>
          <div className={`pl-3 ${!showGridPattern ? "invisible" : ""}`}>
            <div className="flex gap-3 flex-col">
              <div className="flex flex-row items-center gap-3">
                <h4>Grid line width </h4>
                <input
                  type="range"
                  id="pixelSizeSlider"
                  name="Pixel Size"
                  min="1"
                  max="20"
                  value={gridBaseWidth}
                  step="1"
                  onChange={(event) =>
                    setGridBaseWidth(event.target.valueAsNumber)
                  }
                />
                <input
                  type="number"
                  id="PixelGroupSize"
                  name="PixelGroupSize"
                  value={gridBaseWidth}
                  min="1"
                  max="20"
                  onChange={(event) =>
                    setGridBaseWidth(event.target.valueAsNumber)
                  }
                />
              </div>
              <div className="flex-row gap-3 items-center">
                <label htmlFor="gridColor"> Grid color: </label>
                <input
                  type="color"
                  id="gridColor"
                  value={gridMainColor}
                  onChange={(event) => setGridMainColor(event.target.value)}
                />
              </div>
              <div id="GridPattern" className="">
                <label htmlFor="majorGridStyleEnabled" className="mr-3">
                  Define major grid line style:
                </label>
                <input
                  type="checkbox"
                  id="majorGridStyleEnabled"
                  checked={majorGridStyleEnabled}
                  onChange={(event) =>
                    setMajorGridStyleEnabled(event.target.checked)
                  }
                />
              </div>
              <div
                className={`pl-3 flex flex-col gap-3 ${!majorGridStyleEnabled ? "invisible" : ""}`}
              >
                <div className="flex flex-row items-center gap-3">
                  <label htmlFor="majorGridSpacing">Major grid spacing </label>
                  <input
                    type="range"
                    id="pixelSizeSlider"
                    name="Pixel Size"
                    min="1"
                    max="20"
                    value={majorGridSpacing}
                    step="1"
                    onChange={(event) =>
                      setMajorGridSpacing(event.target.valueAsNumber)
                    }
                  />
                  <input
                    type="number"
                    id="majorGridSpacing"
                    name="PixelGroupSize"
                    value={majorGridSpacing}
                    min="1"
                    max="20"
                    onChange={(event) =>
                      setMajorGridSpacing(event.target.valueAsNumber)
                    }
                  />
                </div>
                <div className="flex flex-row items-center gap-3">
                  <label htmlFor="majorGridWidth"> Major grid width </label>
                  <input
                    type="range"
                    id="pixelSizeSlider"
                    name="Pixel Size"
                    min="1"
                    max="20"
                    value={majorGridWidth}
                    step="1"
                    onChange={(event) =>
                      setMajorGridWidth(event.target.valueAsNumber)
                    }
                  />
                  <input
                    type="number"
                    id="majorGridWidth"
                    value={majorGridWidth}
                    min="2"
                    max="20"
                    onChange={(event) =>
                      setMajorGridWidth(event.target.valueAsNumber)
                    }
                  />
                </div>
                <div className="flex-row gap-3 items-center">
                  <label htmlFor="majorGridColor"> Major grid color: </label>
                  <input
                    type="color"
                    id="majorGridColor"
                    value={majorGridColor}
                    onChange={(event) => setMajorGridColor(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
