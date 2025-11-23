// Simple Wallet Creator - Following Crossmint Official Docs
import React, { useState } from "react";
import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";

export function SimpleWalletCreator() {
  const { user, login } = useAuth();
  const { wallet, getOrCreateWallet } = useWallet();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Step 1: Authenticate with email
      console.log("[Wallet] Authenticating user...");
      await login("email");

      // Step 2: Wait for auth to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 3: Create wallet for Stellar
      console.log("[Wallet] Creating Stellar wallet...");
      await getOrCreateWallet({
        chain: "stellar",
        signer: {
          type: "email",
          email: email,
        },
      });

      setSuccess(true);
      console.log("[Wallet] ✅ Wallet created successfully!");
    } catch (err: any) {
      console.error("[Wallet] Error:", err);
      setError(err.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  // Show success screen
  if (success && wallet?.address) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h1 style={styles.successTitle}>Wallet Created Successfully!</h1>
          <p style={styles.successText}>
            Welcome, <strong>{name}</strong>!
          </p>

          <div style={styles.walletInfo}>
            <label style={styles.label}>Your Stellar Wallet Address:</label>
            <div style={styles.addressBox}>
              <code style={styles.address}>{wallet.address}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(wallet.address || "");
                  alert("Address copied!");
                }}
                style={styles.copyButton}
              >
                📋
              </button>
            </div>
          </div>

          <div style={styles.infoBox}>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Network:</strong> Stellar Testnet
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={styles.resetButton}
          >
            Create Another Wallet
          </button>
        </div>
      </div>
    );
  }

  // Show form
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Your Stellar Wallet</h1>
        <p style={styles.subtitle}>
          Enter your name and email to get started with VisionMe
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button
            type="submit"
            disabled={loading || !name || !email}
            style={{
              ...styles.button,
              opacity: loading || !name || !email ? 0.6 : 1,
            }}
          >
            {loading ? "Creating Wallet..." : "Create Wallet"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Powered by <strong>Crossmint</strong> + <strong>Stellar</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  successCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  successIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
  },
  successTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    textAlign: "center",
  },
  successText: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#7C3AED",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "10px",
  },
  resetButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#6B7280",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
  errorBox: {
    padding: "12px 16px",
    backgroundColor: "#FEE2E2",
    border: "1px solid #FCA5A5",
    borderRadius: "8px",
    color: "#991B1B",
    fontSize: "14px",
  },
  walletInfo: {
    marginTop: "30px",
    marginBottom: "20px",
    textAlign: "left",
  },
  addressBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    marginTop: "8px",
  },
  address: {
    flex: 1,
    fontSize: "13px",
    fontFamily: "monospace",
    color: "#374151",
    wordBreak: "break-all",
  },
  copyButton: {
    padding: "8px 12px",
    backgroundColor: "#7C3AED",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  infoBox: {
    padding: "16px",
    backgroundColor: "#EFF6FF",
    borderRadius: "8px",
    textAlign: "left",
    fontSize: "14px",
    color: "#1E40AF",
  },
  footer: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #E5E7EB",
  },
  footerText: {
    fontSize: "14px",
    color: "#6B7280",
    textAlign: "center",
  },
};
