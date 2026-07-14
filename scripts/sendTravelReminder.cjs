const admin = require("firebase-admin");

function getServiceAccount() {
  const serviceAccountText =
    process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountText) {
    throw new Error(
      "缺少 FIREBASE_SERVICE_ACCOUNT 環境變數"
    );
  }

  try {
    return JSON.parse(serviceAccountText);
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

async function main() {
  initializeFirebase();

  const db = admin.firestore();

  console.log("開始讀取 Firestore trips 集合");

  const snapshot = await db
    .collection("trips")
    .limit(10)
    .get();

  console.log(`讀到 ${snapshot.size} 筆旅程`);

  snapshot.forEach((document) => {
    const travel = document.data();

    console.log({
      id: document.id,
      travelName: travel.travelName,
      startDate: travel.startDate,
      memberIds: travel.memberIds,
    });
  });
}

main()
  .then(() => {
    console.log("Firestore 測試完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("執行失敗：", error);
    process.exit(1);
  });