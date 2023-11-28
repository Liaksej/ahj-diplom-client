"use server";

import { signIn, signOut } from "@/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const { token } = (await response.json()) as { token: string };
    cookies().set("token", token, {
      httpOnly: false,
      sameSite: "lax",
      path: "/dashboard",
      maxAge: Date.now() + 24 * 60 * 60 * 1000,
    });
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialSignin";
    }
    throw error;
  }
}

export async function signOutAll() {
  cookies().delete("token");
  await signOut();
}

export async function sendMessageToServer(formData: FormData) {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/send-message/", {
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      return revalidatePath("/dashboard");
    } else {
      console.error(response);
    }
  } catch (error) {
    return { error };
  }
}
