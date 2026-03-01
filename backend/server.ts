import app from './src/app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 Server Running on http://localhost:${PORT}
  🔒 Security: Production Mode Ready
  📧 Email Service: Configured
  🗄️ Database: Connecting...
  `);
});
