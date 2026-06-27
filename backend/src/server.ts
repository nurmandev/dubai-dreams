import app from "./app";
import { initializeDevPayGuard } from "./utils/devpay-guard";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize DevPayGuard SDK (non-blocking for local development)
    await initializeDevPayGuard();

    app.listen(PORT, () => {
      console.log(`
  🚀 Server Running on http://localhost:${PORT}
  🔒 Security: ${process.env.NODE_ENV === "production" ? "Production Mode Ready" : "Development Mode"}
  📧 Email Service: Configured
  🗄️ Database: Connecting...
  `);
    });
  } catch (error) {
    console.error("❌ Fatal error starting server:", error);
    process.exit(1);
  }
}

startServer();
