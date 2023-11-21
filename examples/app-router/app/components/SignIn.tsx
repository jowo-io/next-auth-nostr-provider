"use client";

import { Session } from "next-auth";
import { signOut, signIn } from "next-auth/react";

export const SignIn = async ({ session }: { session: Session | null }) => {
  return (
    <div>
      {session ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </div>
  );
};
