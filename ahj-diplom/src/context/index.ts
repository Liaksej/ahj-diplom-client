import { createContext, Dispatch } from "react";
import { Action, State } from "@/hooks/useMessages";

interface UserContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

const UserContext = createContext<UserContextType>({
  state: {
    messageHistory: [],
    file: null,
    filePreview: null,
    isModalOpen: false,
  },
  dispatch: () => {},
});

export default UserContext;
