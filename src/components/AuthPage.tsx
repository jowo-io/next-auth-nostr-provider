import useLnUrl from "../hooks/useLnUrl.js";
import Loading from "./Loading.js";
import Lightning from "./Lightning.js";

export default function AuthPage({
  clientId,
  redirectUri,
  state,
}: {
  clientId: string;
  redirectUri: string;
  state: string;
}) {
  const { lnurl } = useLnUrl({ clientId, redirectUri, state });

  if (!lnurl) {
    return <Loading />;
  }

  return (
    <div>
      <Lightning lnurl={lnurl} />
    </div>
  );
}
