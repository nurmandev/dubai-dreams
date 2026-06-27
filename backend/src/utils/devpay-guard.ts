import { DevPayGuard } from "devpay-guard-sdk";

let guardInstance: DevPayGuard | null = null;
let initializationError: Error | null = null;

export async function initializeDevPayGuard() {
  try {
    // Initialize DevPayGuard with local credentials
    guardInstance = await DevPayGuard.bootstrap({
      projectId: process.env.DEVPAY_PROJECT_ID!,
      secret: process.env.DEVPAY_PRIVATE_KEY!,
      apiBaseUrl: process.env.DEVPAY_API_BASE_URL!,
      publicKey: process.env.DEVPAY_PUBLIC_KEY!,
      appName: "Dubai Dreams Backend",
      environment: process.env.NODE_ENV || "development",
      pollingIntervalMs: 300000,
    });

    console.log("✅ DevPayGuard SDK initialized successfully");
    console.log(`📦 Project ID: ${process.env.DEVPAY_PROJECT_ID}`);
    console.log(`🔐 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌐 API Base: ${process.env.DEVPAY_API_BASE_URL}`);
    return guardInstance;
  } catch (error) {
    // For local development, allow server to start even if SDK initialization fails
    initializationError = error as Error;
    console.warn(
      "⚠️  DevPayGuard SDK initialization warning (non-blocking):",
      error,
    );
    console.log(
      "📝 Server will continue running. Some SDK features may be unavailable.",
    );
    return null;
  }
}

export function getDevPayGuard(): DevPayGuard | null {
  return guardInstance;
}

export function isDevPayPaid(): boolean {
  if (!guardInstance) {
    console.warn("DevPayGuard not initialized");
    return false;
  }
  return guardInstance.isPaid();
}

export function hasDevPayFeature(featureCode: string): boolean {
  if (!guardInstance) {
    console.warn("DevPayGuard not initialized");
    return false;
  }
  return guardInstance.hasFeature(featureCode);
}

export function getDevPayStatus() {
  if (!guardInstance) {
    console.warn("DevPayGuard not initialized");
    return null;
  }
  return guardInstance.getStatusSnapshot();
}

export function getSDKStatus() {
  return {
    initialized: guardInstance !== null,
    error: initializationError?.message || null,
    projectId: process.env.DEVPAY_PROJECT_ID,
    environment: process.env.NODE_ENV,
    apiBase: process.env.DEVPAY_API_BASE_URL,
  };
}
