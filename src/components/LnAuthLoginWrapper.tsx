import useLnUrl from "../hooks/useLnUrl.js";
import Loading from "./Loading.js";
import Lightning from "./LnAuthLogin.js";

export default function LnAuthLoginWrapper({
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
