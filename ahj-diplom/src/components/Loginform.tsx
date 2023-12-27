import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Loginform() {
  async function loginToServer(formData: FormData) {
    "use server";
    if (!formData.get("email")) {
      return;
    }
    cookies().set("email", formData.get("email") as string);
    redirect("/dashboard");
  }

  return (
    <form action={loginToServer} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1>Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
        </div>
        <LoginButton />
      </div>
    </form>
  );
}

function LoginButton() {
  return (
    <button className="mt-4 w-full rounded bg-blue-500 py-2 text-white">
      Log in
    </button>
  );
}
