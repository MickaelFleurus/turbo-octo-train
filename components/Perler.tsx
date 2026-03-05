"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { GridParametersUI } from '@/utils/perler/GridParameter';
import { ColorPaletteUI, colorPalettes } from '@/utils/perler/ColorPalette';

type Size = [number, number];

export default function Perler() {
    const baseGridColor: string = "#000";
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [baseImageSize, setBaseImageSize] = useState<number[]>([]);
    const [pixelatedImage, setPixelatedImage] = useState<string | null>(null);
    const [gridOverlay, setGridOverlay] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [pixelGroupSize, setPixelGroupSize] = useState<number>(1);

    const [showGridPattern, setShowGridPattern] = useState<boolean>(false);
    const [gridMainColor, setGridMainColor] = useState<string>(baseGridColor);
    const [gridBaseWidth, setGridBaseWidth] = useState<number>(1);

    const [majorGridStyleEnabled, setMajorGridStyleEnabled] = useState<boolean>(false);
    const [majorGridSpacing, setMajorGridSpacing] = useState<number>(5);
    const [majorGridWidth, setMajorGridWidth] = useState<number>(2);
    const [majorGridColor, setMajorGridColor] = useState<string>(gridMainColor);

    const [useCustomColorPalette, setUseCustomColorPalette] = useState<boolean>(false);
    const [selectedPalette, setSelectedPalette] = useState<string[]>(colorPalettes["Hama - Solid"]);

    const [isInProgress, setIsInProgress] = useState<boolean>(false);

    const fileNameRef = useRef<string>("");


    const quantizeImage = (imageSrc: string, palette: string[]): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Get image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Convert each pixel to nearest palette color
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Find closest color in palette
                    let closestColor = palette[0];
                    let minDistance = Infinity;

                    palette.forEach(color => {
                        const paletteR = parseInt(color.slice(1, 3), 16);
                        const paletteG = parseInt(color.slice(3, 5), 16);
                        const paletteB = parseInt(color.slice(5, 7), 16);

                        const distance = Math.sqrt(
                            Math.pow(r - paletteR, 2) +
                            Math.pow(g - paletteG, 2) +
                            Math.pow(b - paletteB, 2)
                        );

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestColor = color;
                        }
                    });

                    // Set pixel to closest palette color
                    const paletteR = parseInt(closestColor.slice(1, 3), 16);
                    const paletteG = parseInt(closestColor.slice(3, 5), 16);
                    const paletteB = parseInt(closestColor.slice(5, 7), 16);

                    data[i] = paletteR;
                    data[i + 1] = paletteG;
                    data[i + 2] = paletteB;
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.src = imageSrc;
        });
    };

    const drawGrid = (): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = baseImageSize[0];
            canvas.height = baseImageSize[1];
            const ctx = canvas.getContext('2d')!;

            ctx.strokeStyle = gridMainColor;
            ctx.lineWidth = gridBaseWidth;

            for (let x = pixelGroupSize; x < baseImageSize[0]; x += pixelGroupSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, baseImageSize[1]);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = pixelGroupSize; y < baseImageSize[1]; y += pixelGroupSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(baseImageSize[0], y);
                ctx.stroke();
            }

            if (majorGridStyleEnabled) {
                ctx.strokeStyle = majorGridColor;
                ctx.lineWidth = majorGridWidth;
                for (let x = pixelGroupSize * majorGridSpacing; x < baseImageSize[0]; x += pixelGroupSize * majorGridSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, baseImageSize[1]);
                    ctx.stroke();
                }

                // Horizontal lines
                for (let y = pixelGroupSize * majorGridSpacing; y < baseImageSize[1]; y += pixelGroupSize * majorGridSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(baseImageSize[0], y);
                    ctx.stroke();
                }
            }

            resolve(canvas.toDataURL());
        });
    };

    const pixelateImage = (imageSrc: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Calculate dimensions that are multiples of pixelSize
                const smallWidth = Math.ceil(img.width / pixelGroupSize);
                const smallHeight = Math.ceil(img.height / pixelGroupSize);

                // Create small canvas for downsampling
                const smallCanvas = document.createElement('canvas');
                smallCanvas.width = smallWidth;
                smallCanvas.height = smallHeight;
                const smallCtx = smallCanvas.getContext('2d')!;
                smallCtx.drawImage(img, 0, 0, smallWidth, smallHeight);

                // Create final canvas with cropped dimensions
                const finalWidth = smallWidth * pixelGroupSize;
                const finalHeight = smallHeight * pixelGroupSize;
                setBaseImageSize([finalWidth, finalHeight]);

                const canvas = document.createElement('canvas');
                canvas.width = finalWidth;
                canvas.height = finalHeight;
                const ctx = canvas.getContext('2d')!;

                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(smallCanvas, 0, 0, finalWidth, finalHeight);

                resolve(canvas.toDataURL());
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageSrc;
        });
    };

    const blendImages = (image1Src: string, image2Src: string, blendMode: string = 'multiply'): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (gridOverlay == null || pixelateImage == null)
                reject();

            const img1 = new Image();
            const img2 = new Image();
            let loadedCount = 0;

            const onLoad = () => {
                loadedCount++;
                if (loadedCount === 2) {
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.max(img1.width, img2.width);
                    canvas.height = Math.max(img1.height, img2.height);
                    const ctx = canvas.getContext('2d')!;

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
            img1.onerror = () => reject(new Error('Failed to load image 1'));
            img2.onerror = () => reject(new Error('Failed to load image 2'));

            img1.src = image1Src;
            img2.src = image2Src;
        });
    };

    const pixelateQuantizedAndAddGrid = async () => {
        if (baseImage) {
            try {
                setIsInProgress(true);
                const pixelated = await pixelateImage(baseImage);
                const quantized = useCustomColorPalette ? await quantizeImage(pixelated, selectedPalette) : pixelated;
                setPixelatedImage(quantized);

                if (showGridPattern) {
                    const grid = showGridPattern ? await drawGrid() : null;
                    if (grid) {
                        setGridOverlay(grid);
                        const result = await blendImages(quantized, grid);
                        setResultImage(result);
                    }
                } else {
                    setResultImage(null);
                }

            } catch (error) {
                console.error('Pixelation failed:', error);
            }
            setIsInProgress(false);
        } else {
            console.log('No image selected');
            setIsInProgress(false);
        }
    };


    const updateGrid = async () => {
        if (pixelatedImage) {
            try {
                setIsInProgress(true);
                if (showGridPattern) {
                    const grid = showGridPattern ? await drawGrid() : null;
                    if (grid) {
                        setGridOverlay(grid);
                        const result = await blendImages(pixelatedImage, grid);
                        setResultImage(result);
                    }
                } else {
                    setResultImage(null);
                }

            } catch (error) {
                console.error('Grid update failed:', error);
            }
            setIsInProgress(false);
        } else {
            console.log('No image selected');
        }
    };

    // Need to re-run everything
    useEffect(() => {
        if (!isInProgress) {
            pixelateQuantizedAndAddGrid();
        }
    }, [pixelGroupSize]);

    // Need to re-run only the grid
    useEffect(() => {
        if (!isInProgress) {
            updateGrid();
        }
    }, [showGridPattern, gridMainColor, gridBaseWidth, majorGridColor, majorGridSpacing, majorGridStyleEnabled, majorGridWidth]);

    useEffect(() => {
        if (!isInProgress)
            pixelateQuantizedAndAddGrid();
    }, [useCustomColorPalette, selectedPalette]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            fileNameRef.current = file.name.split('.')[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setBaseImage(event.target?.result as string);
                pixelateQuantizedAndAddGrid();
            };
            setIsInProgress(true);
            reader.readAsDataURL(file);
        }
    };

    const downloadImage = () => {
        if (!pixelatedImage) return;

        const link = document.createElement('a');
        link.href = resultImage || pixelatedImage;
        link.download = `perler-design-${fileNameRef.current}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main style={{ marginBottom: "2rem", padding: "2rem" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h1 className="text-2xl font-bold mb-4">Perler Bead Designer</h1>

                <div style={{ marginBottom: "2rem" }}>
                    <label
                        htmlFor="image-upload"
                        style={{
                            display: 'inline-block',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Choose Image
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>

                {baseImage && (
                    <div>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ flex: 1 }}>
                                <h2 className="text-xl font-bold mb-2">Original:</h2>
                                <img
                                    src={baseImage}
                                    alt="BaseImage"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #e5e7eb'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 className="text-xl font-bold mb-2">Result:</h2>
                                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                    {isInProgress &&
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 10
                                        }}>
                                            <motion.div
                                                style={{
                                                    position: 'absolute',
                                                    width: "48px",
                                                    height: "48px",
                                                    border: "5px solid #FFF",
                                                    borderBottomColor: "transparent",
                                                    borderRadius: '50%',
                                                }}
                                                animate={{
                                                    rotate: [0, 360],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: Infinity,
                                                    ease: 'linear'
                                                }}


                                            >  </motion.div>
                                        </div>}
                                    {pixelatedImage && (
                                        <img
                                            src={resultImage || pixelatedImage}
                                            alt="ResultImage"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '400px',
                                                borderRadius: '0.375rem',
                                                border: '1px solid #e5e7eb'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                        {pixelatedImage && (
                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    onClick={downloadImage}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Download Image
                                </button>
                            </div>
                        )}

                        <fieldset className="border box-border" style={{ padding: '1rem' }} disabled={isInProgress}>
                            <legend>Parameters:</legend>
                            <div id="Pixelization" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                                <h4 style={{ flex: 1 }}>Pixel group size: </h4>
                                <input
                                    type="range"
                                    id="pixelSizeSlider"
                                    name="Pixel Size"
                                    min="1"
                                    max="1000"
                                    value={pixelGroupSize}
                                    step="1"
                                    onChange={event => setPixelGroupSize(event.target.valueAsNumber)}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    id="PixelGroupSize"
                                    name="PixelGroupSize"
                                    min="10"
                                    max="1000"
                                    onChange={event => setPixelGroupSize(event.target.valueAsNumber)}
                                    value={pixelGroupSize} />
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
                            />
                        </fieldset>
                    </div >

                )
                }
            </div >
        </main >
    );
}
