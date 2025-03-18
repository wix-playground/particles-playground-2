import React, {useState, useEffect} from 'react';
import {FontFamily} from '../../interfaces';

type FontState = {
  fontFamily: FontFamily;
  fontSize: number;
  italic: boolean;
  weight: number;
  letterSpacing: number; // number in px
};

const fontConfig: Record<
  FontFamily,
  {weight: number[] | number; hasItalic: boolean; width?: number[]}
> = {
  Arial: {weight: [200, 800], hasItalic: true},
  'Pirata One': {weight: 400, hasItalic: false},
  Poppins: {weight: [100, 900], hasItalic: true},
  'Press Start 2P': {weight: 400, hasItalic: false},
  Modak: {weight: 400, hasItalic: false},
  UnifrakturMaguntia: {weight: 400, hasItalic: false},
  Junge: {weight: 400, hasItalic: false},
  Ojuju: {weight: [200, 800], hasItalic: true},
  Syne: {weight: [400, 800], hasItalic: true},
  Sora: {weight: [100, 800], hasItalic: true},
  K2D: {weight: [100, 800], hasItalic: true},
  Playfair: {weight: [300, 900], hasItalic: true, width: [87.5, 112.5]},
  'Luxurious Script': {weight: 400, hasItalic: false},
  Fraunces: {weight: [100, 900], hasItalic: true},
};

export const FontSettings1 = () => {
  // Default font state
  const [fontState, setFontState] = useState<FontState>({
    fontFamily: 'Arial',
    fontSize: 16,
    italic: false,
    weight: 400,
    letterSpacing: 0,
  });

  // Generate weight options for fonts with weight ranges
  const generateWeightOptions = (font: FontFamily) => {
    const config = fontConfig[font];
    if (Array.isArray(config.weight)) {
      const [min, max] = config.weight;
      const options = [];
      for (let weight = min; weight <= max; weight += 100) {
        options.push(weight);
      }
      return options;
    }
    return [config.weight];
  };

  // Update weight when font family changes
  useEffect(() => {
    const fontWeightConfig = fontConfig[fontState.fontFamily].weight;
    const newWeight = Array.isArray(fontWeightConfig)
      ? fontWeightConfig[0]
      : fontWeightConfig;

    setFontState((prevState) => ({
      ...prevState,
      weight: newWeight,
      italic: false, // Reset italic when changing font family
    }));
  }, [fontState.fontFamily]);

  // Handle font family change
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontFamily = e.target.value as FontFamily;
    setFontState((prevState) => ({
      ...prevState,
      fontFamily: newFontFamily,
    }));
  };

  // Handle font weight change
  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontState((prevState) => ({
      ...prevState,
      weight: parseInt(e.target.value),
    }));
  };

  // Handle italic toggle
  const handleItalicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontState((prevState) => ({
      ...prevState,
      italic: e.target.checked,
    }));
  };

  // Handle font size change
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontState((prevState) => ({
      ...prevState,
      fontSize: parseInt(e.target.value),
    }));
  };

  // Handle letter spacing change
  const handleLetterSpacingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFontState((prevState) => ({
      ...prevState,
      letterSpacing: parseInt(e.target.value),
    }));
  };

  // Generate the preview style
  const previewStyle = {
    fontFamily: fontState.fontFamily,
    fontSize: `${fontState.fontSize}px`,
    fontWeight: fontState.weight,
    fontStyle: fontState.italic ? 'italic' : 'normal',
    letterSpacing: `${fontState.letterSpacing}px`,
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  return (
    <div className="font-settings">
      <h2>Font Settings</h2>

      <div className="setting-group">
        <label htmlFor="font-family">Font Family:</label>
        <select
          id="font-family"
          value={fontState.fontFamily}
          onChange={handleFontFamilyChange}
        >
          {Object.keys(fontConfig).map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="font-weight">Font Weight:</label>
        <select
          id="font-weight"
          value={fontState.weight}
          onChange={handleWeightChange}
        >
          {generateWeightOptions(fontState.fontFamily).map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
      </div>

      {fontConfig[fontState.fontFamily].hasItalic && (
        <div className="setting-group">
          <label htmlFor="font-italic">
            <input
              type="checkbox"
              id="font-italic"
              checked={fontState.italic}
              onChange={handleItalicChange}
            />
            Italic
          </label>
        </div>
      )}

      <div className="setting-group">
        <label htmlFor="font-size">Font Size (px):</label>
        <input
          type="number"
          id="font-size"
          value={fontState.fontSize}
          onChange={handleFontSizeChange}
          min="8"
          max="72"
        />
      </div>

      <div className="setting-group">
        <label htmlFor="letter-spacing">Letter Spacing (px):</label>
        <input
          type="number"
          id="letter-spacing"
          value={fontState.letterSpacing}
          onChange={handleLetterSpacingChange}
          min="-5"
          max="20"
        />
      </div>

      <div className="font-preview" style={previewStyle}>
        The quick brown fox jumps over the lazy dog.
      </div>

      {/* <div className="current-settings">
        <h3>Current Font Settings:</h3>
        <pre>{JSON.stringify(fontState, null, 2)}</pre>
      </div> */}
    </div>
  );
};
