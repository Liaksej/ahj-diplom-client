import { ReactNode, useContext } from "react";
import { deleteMessageFromServer } from "@/library/actions";
import { WebSocketContext } from "@/context";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";

export default function DeleteButton({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  const { dispatch } = useContext(WebSocketContext);
  const deleteHandler = async (formData: FormData) => {
    try {
      dispatch({ type: "deleteMessage", payload: id });
      await deleteMessageFromServer(formData);
      dispatch({ type: "setNewMessage", payload: `${Math.random()}` });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form action={deleteHandler}>
      <input type="hidden" name="id" value={id} />
      <ButtonSymbol>{children}</ButtonSymbol>
    </form>
  );
}

function ButtonSymbol({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <div
      className={clsx(
        "flex flex-row-reverse space-x-2 items-center",
        pending && "cursor-not-allowed animate-spin",
      )}
    >
      <button type="submit">{children}</button>
    </div>
  );
}
