// src/services/firestoreService.js

import { db } from './firebaseConfig'; // 從你的 firebaseConfig.js 匯入 db 實例
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  arrayRemove
} from 'firebase/firestore';
import { getDatabase, ref, get } from "firebase/database";
/**
 * 將 JSON 資料寫入 Cloud Firestore 的特定文件。
 * 這個函數可以用來儲存你使用者的 travelList。
 *
 * @param {string} collectionName - 你想要寫入的集合名稱 (例如: 'users')。
 * @param {string} documentId - 該集合中特定文件的 ID (例如: 使用者的 LIFF User ID)。
 * @param {object} jsonData - 你要儲存的 JSON 物件。這個物件將成為該文件的內容。
 * 例如：`{ travelList: [...], lastUpdated: '...' }`
 * @param {boolean} [merge=false] - (可選) 如果為 true，新數據將會與現有文件數據合併。
 * 如果為 false (預設)，新數據將完全覆寫現有文件內容。
 * @returns {Promise<boolean>} - 如果寫入成功則返回 true，否則返回 false。
 */
export async function leaveTrip(tripId, userId) {
  try {
    const tripRef = doc(db, "trips", tripId);

    await updateDoc(tripRef, {
      memberIds: arrayRemove(userId),
    });

    console.log("✅ 已成功退出旅程");
    return true;
  } catch (error) {
    console.error("❌ 退出旅程失敗:", error);
    return false;
  }
}
export async function addSharedTravelItem(userId, travelItem) {
  try {
    const tripsRef = collection(db, "trips");

    const newItem = {
      ...travelItem,
      ownerId: userId,
      memberIds: [userId, '222222'],             // 初始共用成員，至少包含自己
      createdAt: serverTimestamp(),    // 建議加時間戳
    };

    const docRef = await addDoc(tripsRef, newItem);
    console.log("✅ 共用旅程新增成功，ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ 新增共用旅程失敗:", error);
    return null;
  }
}
// export async function addTravelItem(userId, travelItem) {
//   try {
//     const travelListRef = collection(db, "users", userId, "travelList");
//     const docRef = await addDoc(travelListRef, travelItem);
//     console.log("✅ 新增成功，ID:", docRef.id);
//     return docRef.id;
//   } catch (error) {
//     console.error("❌ 新增旅程失敗:", error);
//     return null;
//   }
// }
export async function joinTrip(tripId, userId) {
  try {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, {
      memberIds: arrayUnion(userId),
    });
    console.log("✅ 已成功加入共用旅程");
    return true;
  } catch (error) {
    console.error("❌ 加入旅程失敗:", error);
    return false;
  }
}
export async function deleteSharedTravelItem(travelId) {
  try {
    const docRef = doc(db, 'trips', travelId);
    await deleteDoc(docRef);
    console.log(`✅ 已成功刪除共用旅程 ID 為 ${travelId} 的項目`);
    return true;
  } catch (error) {
    console.error("❌ 刪除失敗:", error);
    return false;
  }
}
export async function sendSystemMessage(userId, travelId) {
  
}
// export async function deleteTravelItem(userId, travelId) {
//   try {
//     const docRef = doc(db, 'users', userId, 'travelList', travelId);
//     await deleteDoc(docRef);
//     onsole.log(`✅ 已成功刪除 travelList 中 ID 為 ${travelId} 的項目`);
//     return true;
//   } catch (error) {
//     console.error("❌ 刪除失敗:", error);
//     return false;
//   }
// }
// export async function updateTravelItem(userId, travelId, updatedData) {
//   try {
//     const travelDocRef = doc(db, "users", userId, "travelList", travelId);
//     await setDoc(travelDocRef, updatedData);
//     console.log("✅ 修改成功");
//     return true;
//   } catch (error) {
//     alert(error.code)
//     alert(error.message)
//     console.error("❌ 修改失敗:", error);
//     return false;
//   }
// }
export async function updateSharedTravelItem(travelId, updatedData) {
  try {
    const travelDocRef = doc(db, "trips", travelId);
    await setDoc(travelDocRef, updatedData, { merge: true }); // merge 保留其他欄位
    console.log("✅ 修改成功");
    return true;
  } catch (error) {
    console.error("❌ 修改失敗:", error);
    return false;
  }
}
// export async function getTravelList(userId) {
//   console.log(userId);
//   try {
//     const travelListRef = collection(db, "users", userId, "travelList");
//     const querySnapshot = await getDocs(travelListRef);
//     console.log('travelListRef', querySnapshot);
//     const result = [];
//     querySnapshot.forEach((doc) => {
//       result.push({ id: doc.id, ...doc.data() });
//     });
//     console.log(result);
//     return result;
//   } catch (error) {
//     console.error("❌ 讀取旅程失敗:", error);
//     return [];
//   }
// }
export function listenToTravelItem(travelId, callback) {
  const travelRef = doc(db, "trips", travelId);

  return onSnapshot(travelRef, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    callback({
      id: snap.id,
      ...snap.data()
    });
  });
}
export async function getSharedTravelList(userId) {
  console.log('object', userId);
  try {
    console.log('125', userId);
    const tripsRef = collection(db, "trips");
    console.log(tripsRef);
    const q = query(tripsRef, where("memberIds", "array-contains", userId));
    console.log(q);
    const querySnapshot = await getDocs(q);
    console.log('123', querySnapshot);
    const result = [];
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    console.log("✅ 查詢共用旅程成功：", result);
    return result;
  } catch (error) {
    console.error("❌ 查詢共用旅程失敗:", error);
    return [];
  }
}
export async function getOtherTravelList(travelId) {
  try {
    const tripRef = doc(db, `trips/${travelId}`);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      const tripData = tripSnap.data();
      console.log("取得資料成功", tripData);
      return tripData;
    } else {
      console.error("找不到行程");
      return null;
    }
  } catch (error) {
    console.error("讀取行程失敗:", error);
    return null;
  }
}

// 即時監聽特定聊天室訊息
export function listenToMessages(roomId, callback) {
  const messagesRef = collection(db, "chatRooms", roomId, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ 收到 ${roomId} 新訊息，共 ${messages.length} 則`);
    callback(messages);
  }, (error) => {
    console.error("❌ 聊天室監聽錯誤：", error);
  });
}

// 發送訊息到指定聊天室
export async function sendMessage(roomId, senderId, senderName, content) {
  try {
    const messagesRef = collection(db, "chatRooms", roomId, "messages");
    await addDoc(messagesRef, {
      content,
      senderId,
      senderName,
      createdAt: serverTimestamp()
    });
    console.log(`✅ 已發送訊息到聊天室 ${roomId}`);
  } catch (error) {
    console.error(`❌ 發送訊息失敗 (${roomId}):`, error);
  }
}