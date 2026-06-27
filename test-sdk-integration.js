#!/usr/bin/env node

/**
 * SDK Integration Test Script
 * Tests the DevPayGuard SDK integration in the backend
 */

const http = require("http");

function makeRequest(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 8000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(responseData),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
          });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log("🧪 DevPayGuard SDK Integration Tests\n");
  console.log("Testing Backend Server: http://localhost:8000\n");

  try {
    // Test 1: Health Check
    console.log("📋 Test 1: Health Check");
    const healthRes = await makeRequest("/health");
    console.log(`Status: ${healthRes.status}`);
    console.log(`Response: ${JSON.stringify(healthRes.data)}\n`);

    // Test 2: SDK Status
    console.log("📋 Test 2: SDK Status");
    const sdkRes = await makeRequest("/api/devpay/sdk-status");
    console.log(`Status: ${sdkRes.status}`);
    console.log(`Response:`, sdkRes.data);
    console.log();

    // Test 3: Payment Status
    console.log("📋 Test 3: Payment Status");
    const paymentRes = await makeRequest("/api/devpay/payment-status");
    console.log(`Status: ${paymentRes.status}`);
    console.log(`Response:`, paymentRes.data);
    console.log();

    // Test 4: Check Feature Access
    console.log("📋 Test 4: Check Feature Access");
    const featureRes = await makeRequest("/api/devpay/check-feature", "POST", {
      featureCode: "advanced_reports",
    });
    console.log(`Status: ${featureRes.status}`);
    console.log(`Response:`, featureRes.data);
    console.log();

    console.log("✅ All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n⚠️  Make sure the backend server is running:");
    console.log("   cd backend && npm run dev");
  }
}

runTests();
