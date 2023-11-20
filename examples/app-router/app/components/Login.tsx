"use client";

import { Session } from "next-auth";
import { signOut, signIn } from "next-auth/react";

export const Login = async ({ session }: { session: Session | null }) => {
  return (
    <div>
      {session ? (
        <button onClick={() => signOut()}>Log out</button>
      ) : (
        <button onClick={() => signIn()}>Log in</button>
      )}
    </div>
  );
};
