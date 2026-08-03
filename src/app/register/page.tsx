import { RegisterPage } from "@/components/auth/RegisterPage";

// Middleware already redirects authenticated users away from /register.
// This is a server component — no client-side session check needed.
const Register = () => {
  return <RegisterPage />;
};

export default Register;
