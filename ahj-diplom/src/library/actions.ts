"use server";

import { signIn, signOut } from "@/auth";
import { cookies } from "next/headers";

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
      sameSite: "strict",
      path: "/dashboard",
      maxAge: 60 * 60 * 24 * 1000,
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
