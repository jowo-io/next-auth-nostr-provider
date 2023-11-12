import Lightning from "./Lightning";
import useLightningUrl from "../hooks/useLightningUrl";
import Loading from "./Loading";

export default function AuthPage({
  clientId,
  redirectUri,
  state,
}: {
  clientId: string;
  redirectUri: string;
  state: string;
}) {
  const { lnurl } = useLightningUrl({ clientId, redirectUri, state });

  if (!lnurl) {
    return <Loading />;
  }

  return (
    <div>
      <Lightning lnurl={lnurl} />
    </div>
  );
}
