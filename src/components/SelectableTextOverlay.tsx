import React, {useContext} from 'react';
import {AppContext} from '../contexts/AppContext';
import {getFontString} from '../utils';
import {DEFAULT_FONT_STATE, DEFAULT_PARTICLES_TEXT} from '../constants';

export const SelectableTextOverlay: React.FC<{textRef: React.RefObject<HTMLDivElement | null>}> = ({textRef}) => {
  const appProps = useContext(AppContext);
  const fontState = appProps?.font ?? DEFAULT_FONT_STATE;
  const text = appProps?.text ?? DEFAULT_PARTICLES_TEXT;

  const fontString = getFontString(fontState);

  return (

    <div
      ref={textRef}
      className="selectable-text"
      style={{
        font: fontString,
        letterSpacing: fontState.letterSpacing ? `${fontState.letterSpacing}rem` : 'normal',
        fontStyle: fontState.italic ? 'italic' : 'normal',
        fontWeight: fontState.weight,
        fontFamily: fontState.fontFamily,
        fontSize: `${fontState.fontSize}px`,
      }}
      onMouseDown={(e) => {
        // Ensure text selection works properly
        e.stopPropagation();
      }}
    >
      {text}
    </div>
  );
};
