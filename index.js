const crypto = require("crypto");

var client_id = "BRN-0210-1730515688330";
var request_id = "cc682442-6c22-493e-8121-b9ef6b3fa728";
var request_timestamp = "2024-11-15T06:30:36Z";
var request_target = "/checkout/v1/payment"; // tanpa domain, hanya path
var secret_key = "SK-9IT2zBMCQoYaa6Sch8B0";

// Body JSON (untuk POST)
const body = JSON.stringify({
  order: {
    amount: 20000,
    invoice_number: "INV-20210231-0001",
  },
  payment: {
    payment_due_date: 60,
  },
});

// Buat Digest (untuk POST Request)
const digest = crypto.createHash("sha256").update(body).digest("base64");

// Susun string sesuai format dokumentasi
const signatureString =
  `Client-Id:${client_id}\n` +
  `Request-Id:${request_id}\n` +
  `Request-Timestamp:${request_timestamp}\n` +
  `Request-Target:${request_target}\n` +
  `Digest:${digest}`;

// Buat HMAC-SHA256 dan encode ke Base64 menggunakan secret_key
const signature = crypto
  .createHmac("sha256", secret_key)
  .update(signatureString)
  .digest("base64");

// Format signature dengan prefix HMACSHA256=
const formattedSignature = `HMACSHA256=${signature}`;

// Buat headers dengan signature yang diformat
const headers = {
  "Client-Id": client_id,
  "Request-Id": request_id,
  "Request-Timestamp": request_timestamp,
  "Request-Target": request_target,
  Digest: digest,
  Signature: formattedSignature,
};

console.log(headers);
