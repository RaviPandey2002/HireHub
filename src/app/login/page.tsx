import { LogInPage } from "../components/auth/LogInPage";

// Middleware already redirects authenticated users away from /login.
// No DB call needed here.
export const maxDuration = 60;

const LoginPage = () => {
  return <LogInPage />;
};

export default LoginPage;
