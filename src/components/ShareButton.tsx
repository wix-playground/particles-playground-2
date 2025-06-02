import {useContext, useState} from "react";
import {COPY_SHAREABLE_LINK_TEXT, GENERATING_LINK_TEXT, COPIED_TEXT} from "../constants";
import {AppContext} from "../contexts/AppContext";
import {saveJsonToSnippet, copySnippetUrlToClipboard} from "../snippet";

export const ShareButton = () => {
  const appProps = useContext(AppContext);

  const [shareButtonText, setShareButtonText] = useState(
    COPY_SHAREABLE_LINK_TEXT
  );


  const handleShareClick = async () => {
    if (appProps) {
      setShareButtonText(GENERATING_LINK_TEXT);
      const id = await saveJsonToSnippet(appProps);
      await copySnippetUrlToClipboard(id).then(() => {
        setShareButtonText(COPIED_TEXT);
        setTimeout(() => {
          setShareButtonText(COPY_SHAREABLE_LINK_TEXT);
        }, 2000);
      });
    }
  };
  return <button className="share-button" disabled={!appProps} onClick={handleShareClick} style={{width: '100%'}}>
    {shareButtonText}
  </button>;
};
