import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { extractQuery } from "next-auth-lightning-provider/react";
import CompleteWrapper from "@/components/CompleteWrapper";
import ExposedHook from "@/components/ExposedHook";
import CustomComponents from "@/components/CustomComponents";
import PlainJSX from "@/components/PlainJSX";

export default function LoginPage() {
  const { isReady, query } = useRouter();
  const session = useSession();

  const { redirectUri, state } = extractQuery(query);

  if (!isReady) {
    return <div>loading...</div>;
  }

  if (session.data) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        You are already logged in
      </div>
    );
  }

  if (!redirectUri || !state) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        Missing query params
      </div>
    );
  }

  return (
    <div>
      <p style={{ textAlign: "center", fontWeight: 500, fontSize: 20 }}>
        There are 4 main ways to render a custom Lightning login page.
      </p>
      <div style={{ display: "flex", flexBasis: "25%" }}>
        <div>
          <CompleteWrapper redirectUri={redirectUri} state={state} />
          <p style={{ padding: 20 }}>
            The complete wrapper is the easiest, but least customizable. It does
            everything for you. You can simple import it in your page layout and
            let it do the rest.
          </p>
        </div>
        <div>
          <ExposedHook redirectUri={redirectUri} state={state} />
          <p style={{ padding: 20 }}>
            The exposed hook approach is easy to implement and allows you to
            access the lnurl data from the `useLnUrl` hook, as well as giving
            you the ability to render a custom loading state.
          </p>
        </div>
        <div>
          <CustomComponents redirectUri={redirectUri} state={state} />
          <p style={{ padding: 20 }}>
            The custom components approach gives you access to all of individual
            elements of the loading UI via the helper components. This lets you
            compose your page in a highly flexible way.
          </p>
        </div>
        <div>
          <PlainJSX redirectUri={redirectUri} state={state} />
          <p style={{ padding: 20 }}>
            The plain JSX approach is the most customizable. You can compose the
            page however you wish using your own components in whichever way you
            want.
          </p>
        </div>
      </div>
    </div>
  );
}
