import { LogInPage } from "../components/auth/LogInPage";

// Middleware already redirects authenticated users away from /login.
// No DB call needed here.
const LoginPage = () => {
  return <LogInPage />;
};

export default LoginPage;
