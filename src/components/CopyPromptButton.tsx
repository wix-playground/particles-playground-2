import {useState} from 'react';
import {EXAMPLE_AI_PROMPT} from '../constants';

export const CopyPromptButton = () => {
  const DEFAULT_TEXT = 'Copy AI prompt';
  const [buttonText, setButtonText] = useState('Copy AI prompt');
  return (
    <button
      title="Copy an AI friendly prompt to your clipboard and run it on a LLM to receive an AI generated movement function."
      onClick={() => {
        navigator.clipboard.writeText(EXAMPLE_AI_PROMPT).then(
          () => {
            /* clipboard successfully set */
            setButtonText('Copied!');
            setTimeout(() => {
              setButtonText(DEFAULT_TEXT);
            }, 2000);
          },
          () => {
            /* clipboard write failed */
            setButtonText('Copy error, try again');
            setTimeout(() => {
              setButtonText(DEFAULT_TEXT);
            }, 2000);
          }
        );
      }}
    >
      {buttonText}
    </button>
  );
};
