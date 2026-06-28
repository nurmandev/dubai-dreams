import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 Server Running on http://localhost:${PORT}
  🔒 Security: ${process.env.NODE_ENV === "production" ? "Production Mode Ready" : "Development Mode"}
  📧 Email Service: Configured
  🗄️ Database: Connecting...
  `);
});
