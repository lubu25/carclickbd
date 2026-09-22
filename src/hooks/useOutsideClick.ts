import { useEffect, useRef } from "react";

type OutsideClickHandler = (event: MouseEvent) => void;

const useOutsideClick = (callback: OutsideClickHandler) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [callback]);

  return ref;
};

export default useOutsideClick;
