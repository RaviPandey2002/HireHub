import { Button } from "@/components/ui/button";
import { auth, signOut } from "auth";


const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      Settings Page
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut();

        }}
      >
        <Button className="bg-black text-white h-10 w-30">SignOut</Button>
      </form>
    </div>
  );
};

export default SettingsPage;
