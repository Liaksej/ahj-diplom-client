import { useContext, useRef } from "react";
import { WebSocketContext } from "@/context";
import { useDebouncedCallback } from "use-debounce";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Search() {
  const { dispatch } = useContext(WebSocketContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = useDebouncedCallback(
    (event) =>
      dispatch({ type: "setSearchParam", payload: event.target.value }),
    300,
  );

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      dispatch({ type: "setSearchParam", payload: "" });
    }
  };
  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="border rounded-xl px-2 text-purple-950"
        type="text"
        onChange={handleSearch}
        placeholder="Search..."
      />
      <button
        type="button"
        onClick={clearInput}
        className="pr-2"
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <XMarkIcon className="w-5 h-5 text-purple-200 hover:bg-purple-50 rounded-full" />
      </button>
    </div>
  );
}
