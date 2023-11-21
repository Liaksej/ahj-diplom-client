import { ChangeEvent, useContext } from "react";
import UserContext from "@/context";
import UploadButton from "@/components/UploadButton";

export default function ImageUploadButton() {
  const context = useContext(UserContext);
  const handlerImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      context.dispatch({ type: "setFile", payload: event.target.files[0] });
    }
  };
  return (
    <>
      <input
        style={{ display: "none" }}
        id="hiddenImageInput"
        type="file"
        onChange={handlerImageChange}
      />
      <UploadButton inputId={"hiddenImageInput"}>Image</UploadButton>
    </>
  );
}
