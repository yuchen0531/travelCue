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
  } catch {
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
    value.startsWith("U") &&
    value.length >= 20
  );
}

function getTaiwanDateAfterDays(days) {
  const todayText = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(new Date());

  const [year, month, day] = todayText
    .split("-")
    .map(Number);

  const targetDate = new Date(
    Date.UTC(year, month - 1, day + days)
  );

  return targetDate.toISOString().slice(0, 10);
}

function getReminderMessage(days, travelName) {
  if (days === 7) {
    return `✈️ 距離「${travelName}」出發還有 7 天，記得確認護照、住宿與交通喔！`;
  }

  if (days === 3) {
    return `🧳 距離「${travelName}」出發只剩 3 天，記得開始整理行李！`;
  }

  return `🎉 明天就是「${travelName}」的出發日，祝你旅途愉快！`;
}

async function pushLineMessage(
  lineUserId,
  text,
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
            text,
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

async function processReminder(
  db,
  days,
  channelAccessToken
) {
  const targetDate = getTaiwanDateAfterDays(days);

  console.log(
    `查詢 ${targetDate} 出發的旅程，準備傳送 ${days} 天前提醒`
  );

  const snapshot = await db
    .collection("trips")
    .where("startDate", "==", targetDate)
    .get();

  if (snapshot.empty) {
    console.log(
      `${targetDate} 沒有符合的旅程`
    );
    return;
  }

  for (const tripDocument of snapshot.docs) {
    const trip = tripDocument.data();

    const travelName =
      trip.travelName || "未命名旅程";

    const memberIds = Array.isArray(trip.memberIds)
      ? trip.memberIds
      : [];

    const validMemberIds = [
      ...new Set(memberIds.filter(isLineUserId)),
    ];

    const message = getReminderMessage(
      days,
      travelName
    );

    for (const memberId of validMemberIds) {
      /*
       * 同一旅程、同一出發日期、同一提醒天數、
       * 同一位成員，只會成功傳一次。
       */
      const reminderLogId = [
        tripDocument.id,
        targetDate,
        `${days}days`,
        memberId,
      ].join("_");

      const reminderLogRef = db
        .collection("lineReminderLogs")
        .doc(reminderLogId);

      const reminderLogSnapshot =
        await reminderLogRef.get();

      if (reminderLogSnapshot.exists) {
        console.log(
          `${travelName} 的 ${days} 天提醒已傳過，略過`
        );
        continue;
      }

      try {
        await pushLineMessage(
          memberId,
          message,
          channelAccessToken
        );

        await reminderLogRef.set({
          tripId: tripDocument.id,
          travelName,
          startDate: targetDate,
          reminderDays: days,
          memberId,
          sentAt:
            admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(
          `已傳送「${travelName}」${days} 天前提醒`
        );
      } catch (error) {
        console.error(
          `傳送「${travelName}」給成員失敗：`,
          error.message
        );
      }
    }
  }
}

async function main() {
  initializeFirebase();

  const channelAccessToken = getRequiredEnv(
    "LINE_CHANNEL_ACCESS_TOKEN"
  );

  const db = admin.firestore();

  for (const days of [7, 3, 1]) {
    await processReminder(
      db,
      days,
      channelAccessToken
    );
  }

  console.log("7、3、1 天前提醒檢查完成");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(
      "程式執行失敗：",
      error
    );

    process.exit(1);
  });