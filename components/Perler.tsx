"use client";

import { useState, useEffect, useRef } from "react";

import { GridParametersUI } from "@/utils/perler/GridParameter";
import { ColorPaletteUI, colorPalettes } from "@/utils/perler/ColorPalette";
import { ImageDisplay } from "@/utils/perler/ImageDisplay";
import { PerlerButton } from "@/utils/perler/Button";

import "react-resizable/css/styles.css";
import { color } from "framer-motion";

type Size = [number, number];

export default function Perler() {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const baseGridColor: string = "#000000";
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [baseImageSize, setBaseImageSize] = useState<number[]>([]);
  const [pixelatedImage, setPixelatedImage] = useState<string | null>(null);
  const [gridOverlay, setGridOverlay] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [pixelGroupSize, setPixelGroupSize] = useState<number>(0);
  const [tempPixelSize, setTempPixelSize] = useState<number>(10);

  const [showGridPattern, setShowGridPattern] = useState<boolean>(false);
  const [gridMainColor, setGridMainColor] = useState<string>(baseGridColor);
  const [gridBaseWidth, setGridBaseWidth] = useState<number>(1);

  const [majorGridStyleEnabled, setMajorGridStyleEnabled] =
    useState<boolean>(false);
  const [majorGridSpacing, setMajorGridSpacing] = useState<number>(5);
  const [majorGridWidth, setMajorGridWidth] = useState<number>(2);
  const [majorGridColor, setMajorGridColor] = useState<string>(gridMainColor);

  const [useCustomColorPalette, setUseCustomColorPalette] =
    useState<boolean>(false);
  const [selectedPalette, setSelectedPalette] = useState<string[]>(
    colorPalettes["Hama - Solid"],
  );
  const colorCountRef = useRef<Map<string, number>>(new Map());

  const [isInProgress, setIsInProgress] = useState<boolean>(false);

  const fileNameRef = useRef<string>("");

  const quantizeImage = (
    imageSrc: string,
    palette: string[],
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions that are multiples of pixelSize
        const smallWidth = Math.ceil(img.width / pixelGroupSize);
        const smallHeight = Math.ceil(img.height / pixelGroupSize);

        // Create small canvas for downsampling
        const smallCanvas = document.createElement("canvas");
        smallCanvas.width = smallWidth;
        smallCanvas.height = smallHeight;
        const smallCtx = smallCanvas.getContext("2d")!;
        smallCtx.drawImage(img, 0, 0, smallWidth, smallHeight);

        // Get image data
        const imageData = smallCtx.getImageData(
          0,
          0,
          smallCanvas.width,
          smallCanvas.height,
        );
        const data = imageData.data;
        let colorCount = new Map<string, number>();

        // Convert each pixel to nearest palette color
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Find closest color in palette
          let closestColor = palette[0];
          let minDistance = Infinity;

          palette.forEach((color) => {
            const paletteR = parseInt(color.slice(1, 3), 16);
            const paletteG = parseInt(color.slice(3, 5), 16);
            const paletteB = parseInt(color.slice(5, 7), 16);

            const distance = Math.sqrt(
              Math.pow(r - paletteR, 2) +
                Math.pow(g - paletteG, 2) +
                Math.pow(b - paletteB, 2),
            );

            if (distance < minDistance) {
              minDistance = distance;
              closestColor = color;
            }
          });

          const colorHex =
            "#" +
            closestColor.slice(1, 3) +
            closestColor.slice(3, 5) +
            closestColor.slice(5, 7);
          colorCount.set(colorHex, (colorCount.get(colorHex) ?? 0) + 1);

          // Set pixel to closest palette color
          const paletteR = parseInt(closestColor.slice(1, 3), 16);
          const paletteG = parseInt(closestColor.slice(3, 5), 16);
          const paletteB = parseInt(closestColor.slice(5, 7), 16);

          data[i] = paletteR;
          data[i + 1] = paletteG;
          data[i + 2] = paletteB;
        }
        smallCtx.putImageData(imageData, 0, 0);

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(smallCanvas, 0, 0, img.width, img.height);
        colorCountRef.current = colorCount;

        resolve(canvas.toDataURL());
      };
      img.src = imageSrc;
    });
  };

  const drawGrid = (width: number, height: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      ctx.strokeStyle = gridMainColor;
      ctx.lineWidth = gridBaseWidth;

      for (let x = pixelGroupSize; x <= width; x += pixelGroupSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = pixelGroupSize; y <= height; y += pixelGroupSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (majorGridStyleEnabled) {
        ctx.strokeStyle = majorGridColor;
        ctx.lineWidth = majorGridWidth;
        for (
          let x = pixelGroupSize * majorGridSpacing;
          x <= width;
          x += pixelGroupSize * majorGridSpacing
        ) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (
          let y = pixelGroupSize * majorGridSpacing;
          y <= height;
          y += pixelGroupSize * majorGridSpacing
        ) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      resolve(canvas.toDataURL());
    });
  };

  const pixelateImage = (
    imageSrc: string,
  ): Promise<{
    dataUrl: string;
    width: number;
    height: number;
  }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Calculate dimensions that are multiples of pixelSize
        const smallWidth = Math.ceil(img.width / pixelGroupSize);
        const smallHeight = Math.ceil(img.height / pixelGroupSize);
        const smallCanvas = document.createElement("canvas");
        smallCanvas.width = smallWidth;
        smallCanvas.height = smallHeight;
        const smallCtx = smallCanvas.getContext("2d")!;
        smallCtx.drawImage(img, 0, 0, smallWidth, smallHeight);

        const finalWidth = smallWidth * pixelGroupSize;
        const finalHeight = smallHeight * pixelGroupSize;
        setBaseImageSize([finalWidth, finalHeight]); // For the UI

        const canvas = document.createElement("canvas");
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(smallCanvas, 0, 0, finalWidth, finalHeight);

        resolve({
          dataUrl: canvas.toDataURL(),
          width: finalWidth,
          height: finalHeight,
        });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageSrc;
    });
  };

  const blendImages = (
    image1Src: string,
    image2Src: string,
    blendMode: string = "multiply",
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img1 = new Image();
      const img2 = new Image();
      let loadedCount = 0;

      const onLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(img1.width, img2.width);
          canvas.height = Math.max(img1.height, img2.height);
          const ctx = canvas.getContext("2d")!;

          // Draw first image
          ctx.drawImage(img1, 0, 0);

          // Set blend mode and opacity
          ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
          ctx.globalAlpha = 1.0;

          // Draw second image
          ctx.drawImage(img2, 0, 0);

          resolve(canvas.toDataURL());
        }
      };

      img1.onload = onLoad;
      img2.onload = onLoad;
      img1.onerror = () => reject(new Error("Failed to load image 1"));
      img2.onerror = () => reject(new Error("Failed to load image 2"));

      img1.src = image1Src;
      img2.src = image2Src;
    });
  };

  const pixelateQuantizedAndAddGrid = async () => {
    if (baseImage) {
      (async () => {
        try {
          const pixelated = await pixelateImage(baseImage);
          const quantized = useCustomColorPalette
            ? await quantizeImage(pixelated.dataUrl, selectedPalette)
            : pixelated.dataUrl;
          setPixelatedImage(quantized);

          if (showGridPattern) {
            const grid = await drawGrid(pixelated.width, pixelated.height);
            if (grid) {
              setGridOverlay(grid);
              const result = await blendImages(quantized, grid);
              setResultImage(result);
            }
          } else {
            setResultImage(null);
          }
        } catch (error) {
          console.error("Pixelation failed:", error);
        }
      })();
    }
  };

  const updateGrid = async () => {
    if (pixelatedImage) {
      (async () => {
        try {
          if (showGridPattern) {
            const grid = await drawGrid(baseImageSize[0], baseImageSize[1]);
            if (grid) {
              setGridOverlay(grid);
              const result = await blendImages(pixelatedImage, grid);
              setResultImage(result);
            }
          } else {
            setResultImage(null);
          }
        } catch (error) {
          console.error("Grid update failed:", error);
        }
      })();
    }
  };

  const getBeadsCount = () => {
    return (
      (baseImageSize[0] / pixelGroupSize) * (baseImageSize[1] / pixelGroupSize)
    );
  };

  const getPixelatedImageSize = () => {
    return [
      baseImageSize[0] / pixelGroupSize,
      baseImageSize[1] / pixelGroupSize,
    ];
  };

  // Need to re-run everything
  useEffect(() => {
    if (!isInProgress) {
      setIsInProgress(true);
      pixelateQuantizedAndAddGrid();
      setIsInProgress(false);
    }
  }, [pixelGroupSize]);

  // Need to re-run only the grid
  useEffect(() => {
    if (!isInProgress) {
      setIsInProgress(true);
      if (!pixelatedImage) {
        pixelateQuantizedAndAddGrid();
      } else {
        updateGrid();
      }
      setIsInProgress(false);
    }
  }, [
    showGridPattern,
    gridMainColor,
    gridBaseWidth,
    majorGridColor,
    majorGridSpacing,
    majorGridStyleEnabled,
    majorGridWidth,
  ]);

  useEffect(() => {
    if (!isInProgress) pixelateQuantizedAndAddGrid();
  }, [useCustomColorPalette, selectedPalette]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPixelatedImage(null);
      setResultImage(null);
      fileNameRef.current = file.name.split(".")[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBaseImage(event.target?.result as string);
        setPixelGroupSize(tempPixelSize);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    if (!pixelatedImage) return;

    const link = document.createElement("a");
    link.href = resultImage || pixelatedImage;
    link.download = `perler-design-${fileNameRef.current}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="mb-8 p-8 bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Perler Bead Designer
        </h1>

        <div className="mb-8 flex justify-center">
          <PerlerButton
            label={"Upload picture"}
            onClick={() => inputFile.current?.click()}
          />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            ref={inputFile}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        {baseImage && (
          <div>
            <div className="flex gap-8 mb-8 box-border p-6  bg-mist-900 rounded-4xl border border-gray-500 max-w-4xl mx-auto">
              <ImageDisplay image={baseImage} label={"Original:"} />
              <ImageDisplay
                image={resultImage || pixelatedImage || baseImage}
                label={"Result:"}
                inProgress={isInProgress}
              />
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold whitespace-nowrap">
                Parameters
              </h2>
              <div className="flex-1 border-t border-gray-400"></div>
            </div>
            <div className="flex flex-wrap gap-3 justify-evenly">
              <div className="bg-mist-900 rounded-[10px] border border-gray-500 flex flex-col space-y-6">
                <h2 className=" p-2 text-lg font-semibold border-b">
                  Grid Settings
                </h2>
                <div className="flex flex-row items-center pl-3 pb-3 gap-3">
                  <h4>Pixel group size </h4>
                  <input
                    type="range"
                    id="pixelSizeSlider"
                    name="Pixel Size"
                    min="2"
                    max="150"
                    value={tempPixelSize}
                    step="1"
                    onChange={(event) =>
                      setTempPixelSize(event.target.valueAsNumber)
                    }
                    onMouseUp={(event) =>
                      setPixelGroupSize(
                        (event.target as HTMLInputElement).valueAsNumber,
                      )
                    }
                    onTouchEnd={(event) =>
                      setPixelGroupSize(
                        (event.target as HTMLInputElement).valueAsNumber,
                      )
                    }
                  />
                  <input
                    type="number"
                    id="PixelGroupSize"
                    name="PixelGroupSize"
                    value={tempPixelSize}
                    min="2"
                    max="150"
                    onChange={(event) =>
                      setTempPixelSize(event.target.valueAsNumber)
                    }
                    onBlur={(event) =>
                      setPixelGroupSize(event.target.valueAsNumber)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setPixelGroupSize(
                          (event.target as HTMLInputElement).valueAsNumber,
                        );
                      }
                    }}
                  />
                </div>
                <div className="text-gray-400">
                  <h2 className=" p-2 text-lg font-semibold border-b border-b-gray-500"></h2>
                  <p>
                    Bead count: {getBeadsCount()} • Dimensions:{" "}
                    {getPixelatedImageSize()[0]} X {getPixelatedImageSize()[1]}
                  </p>
                </div>
              </div>

              <GridParametersUI
                showGridPattern={showGridPattern}
                setShowGridPattern={setShowGridPattern}
                gridMainColor={gridMainColor}
                setGridMainColor={setGridMainColor}
                gridBaseWidth={gridBaseWidth}
                setGridBaseWidth={setGridBaseWidth}
                majorGridStyleEnabled={majorGridStyleEnabled}
                setMajorGridStyleEnabled={setMajorGridStyleEnabled}
                majorGridSpacing={majorGridSpacing}
                setMajorGridSpacing={setMajorGridSpacing}
                majorGridWidth={majorGridWidth}
                setMajorGridWidth={setMajorGridWidth}
                majorGridColor={majorGridColor}
                setMajorGridColor={setMajorGridColor}
              />
              <ColorPaletteUI
                useCustomColorPalette={useCustomColorPalette}
                setUseCustomColorPalette={setUseCustomColorPalette}
                selectedPalette={selectedPalette}
                setSelectedPalette={setSelectedPalette}
                colorCount={colorCountRef.current}
              />
            </div>

            <div
              className={`m-4 flex justify-center {(pixelatedImage || resultImage) ? : "invisible" }`}
            >
              <PerlerButton label={"Download result"} onClick={downloadImage} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
