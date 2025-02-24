import {SNIPPET_QUERY_PARAM} from './constants';

const isSnippet = (x: unknown): x is {code: string} =>
  x !== null &&
  typeof x === 'object' &&
  'code' in x &&
  x.code !== null &&
  (typeof x.code === 'string' || typeof x.code === 'object');

export const loadJsonFromSnippet = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const snippet = urlParams.get(SNIPPET_QUERY_PARAM);
  if (snippet) {
    try {
      const response = await fetch(
        `https://www.wix.com/_serverless/wix-style-react-playground/snippet/${snippet}`
      );
      const data = await response.json();
      if (isSnippet(data)) {
        if (typeof data.code === 'string') {
          return JSON.parse(data.code);
        }
        return data.code;
      }
      console.error("Couldn't parse snippet properly");
    } catch (error) {
      console.error('Error fetching snippet:', error);
    }
  }
};

export const saveJsonToSnippet = async (json: object): Promise<string> => {
  const endpoint =
    'https://www.wix.com/_serverless/wix-style-react-playground/snippet';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: json,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data.id;
};

export const copySnippetUrlToClipboard = async (snippetId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(SNIPPET_QUERY_PARAM, snippetId);
  return navigator.clipboard.writeText(url.toString());
};
