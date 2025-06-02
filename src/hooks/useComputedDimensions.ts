import {useState, useCallback} from "react";
import {useResizeObserver} from "./useResizeObserver";

export const useComputedDimensions = ({elementRef}: {elementRef: React.RefObject<HTMLElement | null>, }) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const onResize = useCallback(() => {
    if (elementRef.current) {
      const boundingClientRect = elementRef.current.getBoundingClientRect();
      setDimensions({
        width: boundingClientRect.width,
        height: boundingClientRect.height,
      });
    }
  }, [elementRef]);

  useResizeObserver({
    elementRef,
    onResize,
  });

  return dimensions;
}
