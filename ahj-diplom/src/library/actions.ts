"use server";

import { cookies } from "next/headers";

export async function sendMessageToServer(formData: FormData) {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/send-message/", {
      method: "POST",
      headers: {
        Cookie: "email=" + cookies().get("email")?.value,
      },
      body: formData,
    });
    if (!response.ok) {
      console.error(response);
      return { error: response.statusText };
    }
  } catch (error) {
    return { error };
  }
}
