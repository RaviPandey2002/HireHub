import { auth, signOut } from "auth";
import { Button } from "@/components/ui/button";

const SettingsPage = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        Settings
      </h1>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold dark:text-white">Account</h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>
            <span className="font-medium text-gray-900 dark:text-white">Name: </span>
            {user?.name ?? "—"}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-white">Email: </span>
            {user?.email ?? "—"}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-white">Role: </span>
            {user?.role ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant="destructive" className="h-10 px-6">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
