import {useState} from 'react';
import {
  AI_PROMPT_TOOLTIP_TEXT,
  COPIED_TEXT,
  COPY_AI_PROMPT_TEXT,
  COPY_ERROR_TEXT,
  EXAMPLE_AI_PROMPT,
} from '../../constants';

export const CopyPromptButton = () => {
  const [buttonText, setButtonText] = useState(COPY_AI_PROMPT_TEXT);
  return (
    <button
      title={AI_PROMPT_TOOLTIP_TEXT}
      onClick={() => {
        navigator.clipboard.writeText(EXAMPLE_AI_PROMPT).then(
          () => {
            /* clipboard successfully set */
            setButtonText(COPIED_TEXT);
            setTimeout(() => {
              setButtonText(COPY_AI_PROMPT_TEXT);
            }, 2000);
          },
          () => {
            /* clipboard write failed */
            setButtonText(COPY_ERROR_TEXT);
            setTimeout(() => {
              setButtonText(COPY_AI_PROMPT_TEXT);
            }, 2000);
          }
        );
      }}
    >
      {buttonText}
    </button>
  );
};
