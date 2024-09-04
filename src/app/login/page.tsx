import { LogInPage } from "../components/auth/LogInPage";
import { getUser } from "actions/getUser";
import { redirect } from 'next/navigation';
const LoginPage = async () => {
  const session = await getUser();
  return <>{!session ? <LogInPage /> :  redirect(process.env.NEXTAUTH_URL) }</>;
};

export default LoginPage;
