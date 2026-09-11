export class AuthError extends Error {
  type: string;
  constructor(type = "CredentialsSignin") {
    super(type);
    this.type = type;
    this.name = "AuthError";
  }
}

export default function NextAuth() {
  return {
    handlers: { GET: () => {}, POST: () => {} },
    auth: () => {},
    signIn: () => {},
    signOut: () => {},
    unstable_update: () => {},
  };
}

