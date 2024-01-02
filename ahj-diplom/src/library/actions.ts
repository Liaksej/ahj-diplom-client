"use server";

import { cookies } from "next/headers";

async function fetcher(method: string, url: string, body?: any) {
  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    method: method,
    headers: { Cookie: "email=" + cookies().get("email")?.value },
    body: body,
  });
}

export async function sendMessageToServer(formData: FormData) {
  try {
    const response = await fetcher("POST", "/send-message/", formData);
    if (!response.ok) {
      console.error(response);
      return { error: response.statusText };
    }
  } catch (error) {
    return { error };
  }
}

export async function deleteMessageFromServer(formData: FormData) {
  const body = JSON.stringify({ id: formData.get("id") });
  try {
    const response = await fetcher("DELETE", "/send-message/", body);
    if (!response.ok) {
      console.error(response);
      return { error: response.statusText };
    }
  } catch (error) {
    return { error };
  }
}
