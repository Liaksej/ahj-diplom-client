import { useContext } from "react";
import UserContext from "@/context";

export default function Search() {
  const { state, dispatch } = useContext(UserContext);
  return (
    <div className="border">
      <input
        type="text"
        value={state.searchParam || ""}
        onChange={(event) =>
          dispatch({ type: "setSearchParam", payload: event.target.value })
        }
      />
    </div>
  );
}
