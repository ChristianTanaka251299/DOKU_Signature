const crypto = require("crypto");

// Variabel yang Anda sediakan
var client_id = "BRN-0210-1730515688330";
var request_id = "cc682442-6c22-493e-8121-b9ef6b3fa728";
var request_timestamp = "2024-11-15T06:30:36Z";
var request_target = "/checkout/v1/payment"; // tanpa domain, hanya path
var secret_key = "SK-9IT2zBMCQoYaa6Sch8B0";

// Fungsi untuk Menghasilkan Digest
function generateDigest(jsonBody) {
  const jsonStringHash256 = crypto
    .createHash("sha256")
    .update(jsonBody, "utf-8")
    .digest();
  const bufferFromJsonStringHash256 = Buffer.from(jsonStringHash256);
  return bufferFromJsonStringHash256.toString("base64");
}

// Fungsi untuk Menghasilkan Signature
function generateSignature(
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  digest,
  secret
) {
  // Menyiapkan Komponen Signature
  console.log("----- Komponen Signature -----");
  let componentSignature = "Client-Id:" + clientId;
  componentSignature += "\n";
  componentSignature += "Request-Id:" + requestId;
  componentSignature += "\n";
  componentSignature += "Request-Timestamp:" + requestTimestamp;
  componentSignature += "\n";
  componentSignature += "Request-Target:" + requestTarget;

  // Jika Body Dikirim (untuk metode selain GET/DELETE)
  if (digest) {
    componentSignature += "\n";
    componentSignature += "Digest:" + digest;
  }

  console.log(componentSignature);
  console.log();

  // Menghitung HMAC-SHA256 dan mengonversi hasilnya ke Base64
  const hmac256Value = crypto
    .createHmac("sha256", secret)
    .update(componentSignature)
    .digest();

  const bufferFromHmac256Value = Buffer.from(hmac256Value);
  const signature = bufferFromHmac256Value.toString("base64");

  // Menggabungkan dengan Prefix HMACSHA256=
  return "HMACSHA256=" + signature;
}

// Contoh JSON Body (untuk metode POST/PUT)
console.log("----- Digest -----");
const jsonBody = JSON.stringify({
  order: {
    invoice_number: "INV-20210124-0001",
    amount: 150000,
  },
  virtual_account_info: {
    expired_time: 60,
    reusable_status: false,
    info1: "Merchant Demo Store",
  },
  customer: {
    name: "Taufik Ismail",
    email: "taufik@example.com",
  },
});

// Menghasilkan Digest dari JSON Body
const digest = generateDigest(jsonBody);
console.log(digest);
console.log();

// Menghasilkan Header Signature menggunakan variabel Anda
const headerSignature = generateSignature(
  client_id,
  request_id,
  request_timestamp,
  request_target,
  digest, // Biarkan kosong jika menggunakan metode GET/DELETE
  secret_key
);

console.log("----- Header Signature -----");
console.log(headerSignature);
