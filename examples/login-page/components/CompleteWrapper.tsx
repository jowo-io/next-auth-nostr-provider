import { LnAuthLoginWrapper } from "next-auth-lightning-provider/react";

export default function CompleteWrapper({
  redirectUri,
  state,
}: {
  redirectUri: string;
  state: string;
}) {
  return (
    <LnAuthLoginWrapper
      title="Complete wrapper"
      redirectUri={redirectUri}
      state={state}
      theme={{
        wrapper: {
          textAlign: "center",
          background: "#fff",
          color: "#000",
          padding: "20px 30px",
          borderRadius: 20,
        },
        title: {
          fontSize: 20,
          color: "#000",
          marginTop: 0,
          marginBottom: 15,
        },
        qr: {
          display: "block",
          overflow: "hidden",
          borderRadius: 5,
          width: "100%",
          height: "auto",
        },
        copy: {
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
          userSelect: "all",
          marginTop: 10,
          marginBottom: 10,
        },
        button: {
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
        },
      }}
    />
  );
}
