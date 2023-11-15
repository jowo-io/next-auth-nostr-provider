import {
  Button,
  CopyCode,
  Loading,
  QrCode,
  Title,
  useLnUrl,
} from "next-auth-lightning-provider/react";

export default function CustomComponents({
  redirectUri,
  state,
}: {
  redirectUri: string;
  state: string;
}) {
  const { lnurl } = useLnUrl({ redirectUri, state });

  if (!lnurl) {
    return <Loading />;
  }

  return (
    <div
      style={{
        textAlign: "center",
        background: "#fff",
        color: "#000",
        padding: "20px 30px",
        borderRadius: 20,
      }}
    >
      <Title
        style={{
          fontSize: 20,
          color: "#000",
          marginTop: 0,
          marginBottom: 15,
        }}
      >
        Custom Components
      </Title>
      <QrCode
        lnurl={lnurl}
        style={{
          display: "block",
          overflow: "hidden",
          borderRadius: 5,
          width: "100%",
          height: "auto",
        }}
      />
      <CopyCode
        lnurl={lnurl}
        style={{
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
          userSelect: "all",
          marginTop: 10,
          marginBottom: 10,
        }}
      />
      <Button
        lnurl={lnurl}
        style={{
          alignItems: "center",
          backgroundColor: "#f2f2f2",
          textDecoration: "none",
          border: `2px solid rgba(110, 110, 110, 0.3)`,
          borderRadius: 10,
          color: "#000",
          display: "flex",
          fontSize: "1.1rem",
          fontWeight: "500",
          justifyContent: "center",
          minHeight: "30px",
          padding: ".75rem 1rem",
          position: "relative",
        }}
      />
    </div>
  );
}
