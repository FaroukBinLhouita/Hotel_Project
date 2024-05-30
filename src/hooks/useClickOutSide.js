import { useEffect, useRef } from "react";

export function useClickOutSide(handler, listen = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handlerClick(e) {
        if (ref.current && !ref.current.contains(e.target)) handler();
      }

      document.addEventListener("click", handlerClick, listen);
      return () => document.removeEventListener("click", handlerClick, true);
    },
    [handler, listen]
  );

  return ref;
}
