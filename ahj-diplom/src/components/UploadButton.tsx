import { ChangeEvent, ReactNode, useContext } from "react";
import UserContext from "@/context";

export default function UploadButton({
  children,
  inputName,
}: {
  children: ReactNode;
  inputName: string;
}) {
  const context = useContext(UserContext);
  const handlerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      context.dispatch({ type: "setFile", payload: event.target.files[0] });
    }
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        id={inputName}
        type="file"
        onChange={handlerFileChange}
      />
      <button onClick={() => document.getElementById(inputName)?.click()}>
        {children}
      </button>
    </>
  );
}
