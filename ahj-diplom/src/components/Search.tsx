import { useContext } from "react";
import { WebSocketContext } from "@/context";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const { dispatch } = useContext(WebSocketContext);

  const handleSearch = useDebouncedCallback(
    (event) =>
      dispatch({ type: "setSearchParam", payload: event.target.value }),
    300,
  );

  return (
    <div className="border">
      <input type="text" onChange={handleSearch} />
    </div>
  );
}
