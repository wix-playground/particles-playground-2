import React, {useCallback, useContext, useMemo} from 'react';
import {FontFamily, FontState} from '../../../interfaces';
import {AppContext} from '../../../contexts/AppContext';
import {useWorkerActions} from '../../../hooks/useWorkerActions';
import {DATA_TEST_IDS, DEFAULT_FONT_STATE} from '../../../constants';
import {getSettingsConfig} from '../../../settings-config';

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
  Belinda: {weight: 400, hasItalic: false},
  DIN: {weight: 400, hasItalic: true},
};

export const FontSettings = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();
  const {min: MIN_FONT_SIZE, max: MAX_FONT_SIZE, step: FONT_SIZE_STEP} = useMemo(() => getSettingsConfig().fontSize, []);

  const fontState = appProps?.font ?? DEFAULT_FONT_STATE;

  const setFontState = useCallback(
    (font: Partial<FontState>) => {
      workerActions?.updateFont({...fontState, ...font} as FontState);
    },
    [workerActions, fontState]
  );

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

  // Handle font family change
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontFamily = e.target.value as FontFamily;

    const fontWeightConfig = fontConfig[newFontFamily].weight;
    const newWeight = Array.isArray(fontWeightConfig)
      ? fontWeightConfig[0]
      : fontWeightConfig;

    setFontState({
      fontFamily: newFontFamily,
      weight: newWeight,
      italic: false, // Reset italic when changing font family
    });
  };

  // Handle font weight change
  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontState({
      weight: parseInt(e.target.value),
    });
  };

  // Handle italic toggle
  const handleItalicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontState({
      italic: e.target.checked,
    });
  };

  // Handle font size change
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontState({
      fontSize: parseInt(e.target.value),
    });
  };

  if (!fontState) {
    return;
  }

  return (
    <>
      {/* Font Family */}
      <div className="control-group">
        <label htmlFor="font-family">Font Family:</label>
        <select
          data-testid={DATA_TEST_IDS.FONT_FAMILY_SELECT}
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

      {/* Font Weight */}
      <div className="control-group">
        <label htmlFor="font-weight">Font Weight:</label>
        <select
          data-testid={DATA_TEST_IDS.FONT_WEIGHT_SELECT}
          id="font-weight"
          value={fontState?.weight}
          onChange={handleWeightChange}
        >
          {generateWeightOptions(fontState.fontFamily).map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
      </div>

      {/* Font Italic */}
      {fontConfig[fontState.fontFamily].hasItalic && (
        <div className="control-group">
          <label htmlFor="font-italic">
            <input
              type="checkbox"
              data-testid={DATA_TEST_IDS.FONT_ITALIC_CHECKBOX}
              id="font-italic"
              checked={fontState.italic}
              onChange={handleItalicChange}
            />
            Italic
          </label>
        </div>
      )}

      {/* Font Size */}
      <div className="control-group">
        <label htmlFor="font-size">Font Size (px):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={FONT_SIZE_STEP}
            value={fontState.fontSize}
            onChange={handleFontSizeChange}
          />
          <input
            data-testid={DATA_TEST_IDS.FONT_SIZE_INPUT}
            type="number"
            id="font-size"
            value={fontState.fontSize}
            onChange={handleFontSizeChange}
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={FONT_SIZE_STEP}
          />
        </div>
      </div>
    </>
  );
};
