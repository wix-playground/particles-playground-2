import { useEffect, useRef } from 'react';

type UseResizeObserverParams = {
  elementRef: React.RefObject<HTMLElement | null>;
  onResize: () => void;
};

export const useResizeObserver = (params: UseResizeObserverParams) => {
  const { elementRef, onResize } = params;
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    resizeObserverRef.current ??= new ResizeObserver(onResize);

    const resizeObserver = resizeObserverRef.current;

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [onResize, elementRef]);
};
