import React from "react";

export const colorPalettes: Record<string, string[]> = {
  "Hama - Solid": [
    "#ECEDED",
    "#F0E8B9",
    "#F0B901",
    "#E64F27",
    "#B63136",
    "#E1889F",
    "#694A82",
    "#2C4690",
    "#305CB0",
    "#256847",
    "#49AE89",
    "#534137",
    "#C02435",
    "#37B876",
    "#83888A",
    "#2E2F31",
    "#D8D2CE",
    "#7F332A",
    "#A5693F",
    "#A52D36",
    "#683E9A",
    "#87593D",
    "#DE9B90",
    "#DEB48B",
    "#363F38",
    "#B9395E",
    "#592F38",
    "#6797AE",
    "#FF208D",
    "#FF3956",
    "#E5EF13",
    "#FF2833",
    "#2353B0",
    "#06B73C",
    "#FD8600",
    "#F1F21C",
    "#FE630B",
    "#2659B2",
    "#0CBD51",
    "#F0EA37",
    "#EE6972",
    "#886DB9",
    "#629ED7",
    "#83CB70",
    "#CF70B7",
    "#4998BC",
  ],
  "Black and White": ["#000000", "#ffffff"],
  "Red and Blue": ["#ff0000", "#0000ff"],
};

type ColorPaletteUIProps = {
  useCustomColorPalette: boolean;
  setUseCustomColorPalette: (value: boolean) => void;
  selectedPalette: string[];
  setSelectedPalette: (value: string[]) => void;
  colorCount: Map<string, number>;
};

export const ColorPaletteUI = (param: ColorPaletteUIProps) => (
  <>
    <div className="bg-mist-900 rounded-[10px] border border-gray-500 flex flex-col space-y-4 ">
      <h2 className="p-2 text-lg font-semibold border-b">
        Custom color palette
      </h2>
      <div id="CustomColorPalette" className="mb-0 p-2">
        <label htmlFor="useCustomColorPaletteBox" className="mr-3">
          Use custom color palette:
        </label>
        <input
          type="checkbox"
          id="useCustomColorPaletteBox"
          value={param.useCustomColorPalette.toString()}
          onChange={(event) =>
            param.setUseCustomColorPalette(event.target.checked)
          }
        />
      </div>
      {param.useCustomColorPalette && (
        <div>
          <h4 className="p-2">Color Palette:</h4>
          <div className="flex flex-row gap-2 p-2">
            {Object.entries(colorPalettes).map(([key, colors]) => (
              <button
                key={key}
                onClick={() => param.setSelectedPalette(colors)}
                className="p-1 mb-0.5 rounded-lg cursor-pointer bg-gray-300 active:bg-blue-600 font-normal active:font-bold text-black"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}
      {param.colorCount.size > 0 && (
        <div className="p-2">
          <h4 className="mb-2">Color Count:</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(param.colorCount.entries()).map(([color, count]) => (
              <div key={color} className="flex items-center gap-1">
                <div
                  className="w-4 h-4 border-2 border-white"
                  style={{ backgroundColor: color }}
                />
                <span>: {count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
);
