import {render, screen} from '@testing-library/react';
import {TextSettings} from '../../../components/Settings/TextSettings';
import {AppContext} from '../../../contexts/AppContext';
import {WorkerContext} from '../../../contexts/WorkerContext';
import {DATA_TEST_IDS, DEFAULT_FONT_STATE, DEFAULT_APP_PROPS} from '../../../constants';
import {AppProps, FontState} from '../../../interfaces';

// Mock Worker class
class MockWorker {
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  postMessage = jest.fn();
  terminate = jest.fn();
  onmessage = null;
  onerror = null;
}

// Set global Worker class
(global as any).Worker = MockWorker;

// Helper function to create mock AppProps with overrides
const getMockAppProps = (override: Partial<AppProps> = {}): AppProps => {
  return {
    ...DEFAULT_APP_PROPS,
    ...override,
  };
};

describe('TextSettings', () => {
  test('renders with default font state when appProps.font is undefined', () => {
    // Create a mock AppProps with undefined font
    const mockAppProps = getMockAppProps({
      font: undefined as any, // Cast to any to simulate undefined font
    });

    // Create mock worker
    const mockWorker = new MockWorker() as unknown as Worker;

    // Render component with mocked context
    render(
      <AppContext.Provider value={mockAppProps}>
        <WorkerContext.Provider value={mockWorker}>
          <TextSettings />
        </WorkerContext.Provider>
      </AppContext.Provider>
    );

    // Check if font family select has the default value
    const fontFamilySelect = screen.getByTestId(DATA_TEST_IDS.FONT_FAMILY_SELECT) as HTMLSelectElement;
    expect(fontFamilySelect.value).toBe(DEFAULT_FONT_STATE.fontFamily);

    // Check if font weight select has the default value
    const fontWeightSelect = screen.getByTestId(DATA_TEST_IDS.FONT_WEIGHT_SELECT) as HTMLSelectElement;
    expect(Number(fontWeightSelect.value)).toBe(DEFAULT_FONT_STATE.weight);

    // Check if font size input has the default value
    const fontSizeInput = screen.getByTestId(DATA_TEST_IDS.FONT_SIZE_INPUT) as HTMLInputElement;
    expect(Number(fontSizeInput.value)).toBe(DEFAULT_FONT_STATE.fontSize);

    const textInput = screen.getByTestId(DATA_TEST_IDS.TEXT_INPUT) as HTMLInputElement;
    expect(textInput.value).toBe(mockAppProps.text);
  });


  test('renders with font state when appProps.font is defined', () => {
    const mockFontState: FontState = {
      italic: false,
      weight: 400,
      fontSize: 96,
      fontFamily: "UnifrakturMaguntia",
    }
    const mockAppProps = getMockAppProps({
      font: mockFontState,
    });

    // Create mock worker
    const mockWorker = new MockWorker() as unknown as Worker;

    // Render component with mocked context
    render(
      <AppContext.Provider value={mockAppProps}>
        <WorkerContext.Provider value={mockWorker}>
          <TextSettings />
        </WorkerContext.Provider>
      </AppContext.Provider>
    );

    // Check if font family select has the default value
    const fontFamilySelect = screen.getByTestId(DATA_TEST_IDS.FONT_FAMILY_SELECT) as HTMLSelectElement;
    expect(fontFamilySelect.value).toBe(mockFontState.fontFamily);

    // Check if font weight select has the default value
    const fontWeightSelect = screen.getByTestId(DATA_TEST_IDS.FONT_WEIGHT_SELECT) as HTMLSelectElement;
    expect(Number(fontWeightSelect.value)).toBe(mockFontState.weight);

    // Check if font size input has the default value
    const fontSizeInput = screen.getByTestId(DATA_TEST_IDS.FONT_SIZE_INPUT) as HTMLInputElement;
    expect(Number(fontSizeInput.value)).toBe(mockFontState.fontSize);

  });
});

