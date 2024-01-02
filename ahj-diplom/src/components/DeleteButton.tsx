import { ReactNode, useContext } from "react";
import { deleteMessageFromServer } from "@/library/actions";
import { WebSocketContext } from "@/context";
import Spinner from "@/components/Spinner";
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
      <div className="flex flex-row-reverse space-x-2 items-center">
        <button type="submit">{children}</button>
        <SpinForDelete />
      </div>
    </form>
  );
}

function SpinForDelete() {
  const { pending } = useFormStatus();
  return (
    <div className={clsx(!pending && "w-[1.1rem]")}>
      {pending && <Spinner width="1.1rem" height="1.1rem" />}
    </div>
  );
}