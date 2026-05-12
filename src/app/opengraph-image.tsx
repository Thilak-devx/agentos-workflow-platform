import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 18% 14%, rgba(56,189,248,0.28), transparent 22%), radial-gradient(circle at 84% 16%, rgba(99,102,241,0.26), transparent 24%), linear-gradient(180deg, #07111d 0%, #040913 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: 28,
              }}
            >
              AO
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                AgentOS
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.48)",
                }}
              >
                Autonomous operations command center
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 42 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  fontSize: 18,
                  color: "rgba(167,243,208,0.95)",
                }}
              >
                Production-ready AI treasury orchestration
              </div>
              <div
                style={{
                  fontSize: 68,
                  lineHeight: 1.05,
                  fontWeight: 700,
                  letterSpacing: "-0.06em",
                  maxWidth: 680,
                }}
              >
                Operate agents, workflows, and treasury from one live system.
              </div>
              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.62)",
                  maxWidth: 720,
                }}
              >
                Built for modern AI operations teams with governed execution,
                realtime coordination, and Solana-native treasury visibility.
              </div>
            </div>

            <div
              style={{
                width: 320,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                ["Agents online", "18"],
                ["Treasury confidence", "97%"],
                ["Settlements today", "16"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "22px 24px",
                    borderRadius: 26,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.42)",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 38,
                      fontWeight: 700,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
