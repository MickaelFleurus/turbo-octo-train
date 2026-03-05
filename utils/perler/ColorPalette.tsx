import React from 'react';

export const colorPalettes: Record<string, string[]> = {
    "Hama - Solid": [
        '#ECEDED',
        '#F0E8B9',
        '#F0B901',
        '#E64F27',
        '#B63136',
        '#E1889F',
        '#694A82',
        '#2C4690',
        '#305CB0',
        '#256847',
        '#49AE89',
        '#534137',
        '#C02435',
        '#37B876',
        '#83888A',
        '#2E2F31',
        '#D8D2CE',
        '#7F332A',
        '#A5693F',
        '#A52D36',
        '#683E9A',
        '#87593D',
        '#DE9B90',
        '#DEB48B',
        '#363F38',
        '#B9395E',
        '#592F38',
        '#6797AE',
        '#FF208D',
        '#FF3956',
        '#E5EF13',
        '#FF2833',
        '#2353B0',
        '#06B73C',
        '#FD8600',
        '#F1F21C',
        '#FE630B',
        '#2659B2',
        '#0CBD51',
        '#F0EA37',
        '#EE6972',
        '#886DB9',
        '#629ED7',
        '#83CB70',
        '#CF70B7',
        '#4998BC',
    ],
};


type ColorPaletteUIProps = {
    useCustomColorPalette: boolean;
    setUseCustomColorPalette: (value: boolean) => void;
    selectedPalette: string[];
    setSelectedPalette: (value: string[]) => void;
};


export const ColorPaletteUI: React.FC<ColorPaletteUIProps> = ({
    useCustomColorPalette,
    setUseCustomColorPalette,
    selectedPalette,
    setSelectedPalette,
}) => {
    return (
        <>
            <fieldset className="border box-border" style={{ padding: '1rem' }}>
                <legend>Custom color palette: </legend>

                <div id="CustomColorPalette" style={{ display: 'flex', gap: '2rem' }}>
                    <label htmlFor="useCustomColorPaletteBox">Use custom color palette:</label>
                    <input
                        type="checkbox"
                        id="useCustomColorPaletteBox"
                        value={useCustomColorPalette.toString()}
                        onChange={event => setUseCustomColorPalette(event.target.checked)}
                    />
                </div>

                {useCustomColorPalette &&
                    <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                        <div>
                            <h4>Color Palette:</h4>
                            {Object.entries(colorPalettes).map(([key, colors]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedPalette(colors)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        marginRight: '0.5rem',
                                        marginBottom: '0.5rem',
                                        backgroundColor: selectedPalette === colors ? '#3b82f6' : '#e5e7eb',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer',
                                        fontWeight: selectedPalette === colors ? 'bold' : 'normal',
                                        color: '#000',
                                    }}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </div>
                }
            </fieldset>
        </>
    );
};
