const admin = require("firebase-admin");

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`缺少環境變數：${name}`);
  }

  return value;
}

function getServiceAccount() {
  const rawValue = getRequiredEnv(
    "FIREBASE_SERVICE_ACCOUNT"
  );

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT 不是有效的 JSON"
    );
  }
}

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert(
      getServiceAccount()
    ),
  });
}

function isLineUserId(value) {
  return (
    typeof value === "string" &&
    /^U[a-zA-Z0-9]{20,}$/.test(value)
  );
}

async function pushLineMessage(
  lineUserId,
  message,
  channelAccessToken
) {
  const response = await fetch(
    "https://api.line.me/v2/bot/message/push",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      }),
    }
  );

  const responseBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `LINE API ${response.status}: ${responseBody}`
    );
  }
}

async function main() {
  initializeFirebase();

  const channelAccessToken = getRequiredEnv(
    "LINE_CHANNEL_ACCESS_TOKEN"
  );

  const db = admin.firestore();

  console.log("開始讀取 Firestore trips 集合");

  /*
   * 第二階段只取一筆旅程測試。
   * 之後第三階段才會改成查詢三天後的旅程。
   */
  const snapshot = await db
    .collection("trips")
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.log("Firestore 目前沒有旅程");
    return;
  }

  const travelDocument = snapshot.docs[0];
  const travel = travelDocument.data();

  const travelName =
    travel.travelName || "未命名旅程";

  const memberIds = Array.isArray(travel.memberIds)
    ? travel.memberIds
    : [];

  const validMemberIds = [
    ...new Set(memberIds.filter(isLineUserId)),
  ];

  console.log(`測試旅程：${travelName}`);
  console.log(`有效 LINE 成員數：${validMemberIds.length}`);

  if (validMemberIds.length === 0) {
    throw new Error(
      "這筆旅程沒有有效的 LINE user ID。請檢查 memberIds 是否為 U 開頭的 ID。"
    );
  }

  /*
   * 第二階段只傳給第一位有效成員，
   * 避免測試時一次傳給所有人。
   */
  const targetUserId = validMemberIds[0];

  await pushLineMessage(
    targetUserId,
    `LINE 推播測試成功！「${travelName}」已成功連接 GitHub Actions。`,
    channelAccessToken
  );

  console.log("LINE 測試訊息傳送完成");
}

main()
  .then(() => {
    console.log("程式執行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("執行失敗：", error.message);
    process.exit(1);
  });