import { signOutAll } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function Logout() {
  const [code, action] = useFormState(signOutAll, undefined);
  return (
    <div>
      <form action={action}>
        <button type="submit">Logout</button>
        <div className="flex h-8 items-end space-x-1">
          {Boolean(code) && (
            <>
              <p aria-live="polite" className="text-sm text-red-500">
                Invalid credentials
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
