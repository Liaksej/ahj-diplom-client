"use server";

import { cookies } from "next/headers";

export async function sendMessageToServer(formData: FormData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/send-message/`,
      {
        method: "POST",
        headers: {
          Cookie: "email=" + cookies().get("email")?.value,
        },
        body: formData,
      },
    );
    if (!response.ok) {
      console.error(response);
      return { error: response.statusText };
    }
  } catch (error) {
    return { error };
  }
}
