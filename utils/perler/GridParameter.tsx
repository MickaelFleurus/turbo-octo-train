import React from 'react';

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
            <fieldset className="border box-border" style={{ padding: '1rem' }}>
                <legend>Grid pattern parameters: </legend>
                <div id="GridPattern" style={{ display: 'flex', gap: '2rem' }
                }>
                    <label htmlFor="gridPatternCheckbox" > Show grid pattern: </label>
                    < input
                        type="checkbox"
                        id="gridPatternCheckbox"
                        checked={showGridPattern}
                        onChange={event => setShowGridPattern(event.target.checked)}
                    />
                </div>
                {
                    showGridPattern &&
                    <div>
                        < div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexDirection: "column" }}>

                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <label htmlFor="gridColor" > Grid base color: </label>
                                < input
                                    type="color"
                                    id="gridColor"
                                    value={gridMainColor}
                                    onChange={event => setGridMainColor(event.target.value)}
                                />
                            </div>

                            < div style={{ display: 'flex', gap: '2rem' }}>
                                <label htmlFor="gridWidth" > Grid Width: </label>
                                < input
                                    type="number"
                                    id="gridWidth"
                                    value={gridBaseWidth}
                                    min="1"
                                    max="20"
                                    onChange={event => setGridBaseWidth(event.target.valueAsNumber)}
                                />
                            </div>
                        </div>
                        < div id="GridPattern" style={{ display: 'flex', gap: '2rem' }}>
                            <label htmlFor="majorGridStyleEnabled" > Define major grid line style: </label>
                            < input
                                type="checkbox"
                                id="majorGridStyleEnabled"
                                checked={majorGridStyleEnabled}
                                onChange={event => setMajorGridStyleEnabled(event.target.checked)}
                            />
                        </div>
                        {
                            majorGridStyleEnabled &&
                            <div style={{ display: 'flex', gap: '2rem', flexDirection: "column" }}>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <label htmlFor="gridWidth" > Major grid spacing: </label>
                                    < input
                                        type="number"
                                        id="majorGridSpacing"
                                        value={majorGridSpacing}
                                        min="2"
                                        max="20"
                                        onChange={event => setMajorGridSpacing(event.target.valueAsNumber)}
                                    />
                                </div>
                                < div style={{ display: 'flex', gap: '2rem' }
                                }>
                                    <label htmlFor="majorGridWidth" > Major grid width: </label>
                                    < input
                                        type="number"
                                        id="majorGridWidth"
                                        value={majorGridWidth}
                                        min="2"
                                        max="20"
                                        onChange={event => setMajorGridWidth(event.target.valueAsNumber)}
                                    />
                                </div>
                                < div style={{ display: 'flex', gap: '2rem' }}>
                                    <label htmlFor="majorGridColor" > Major grid color: </label>
                                    < input
                                        type="color"
                                        id="majorGridColor"
                                        value={majorGridColor}
                                        onChange={event => setMajorGridColor(event.target.value)}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                }
            </fieldset>
        </>
    );
};
