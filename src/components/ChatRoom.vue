<template>
  <div v-if="!showChat" class="fixed bottom-10 right-4 z-50 bg-[#bbbbbbde] p-3 rounded-full shadow-lg">
    <img  src="../assets/img/typing.png" alt="Chat Icon" class="w-8 h-8 cursor-pointer" @click="showChat = !showChat">
  </div>
  <div v-if="showChat" class="model-frame bg-white shadow-lg rounded-lg">
    <div class="model">
      <div class="model-header flex justify-center items-center relative w-full p-4">
        <button class=" absolute left-5" v-if="inMessage" @click="inMessage = false">
          <svg xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">

          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>

        </svg>
        </button>
        <p class="font-bold text-xl">{{inMessage ? roomName : '聊天室列表'}}</p>
        <button class="absolute right-5" @click="showChat = false">
          <svg xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">

            <path d="M18 6L6 18"/>
            <path d="M6 6l12 12"/>

          </svg>
        </button>
      </div>
      <div v-if="!inMessage" class="p-4 chatlist-content">
        <div v-for="item in travelList" :key="item" class="mb-3 message-list p-2 rounded-lg border border-[#c3c3c3]" @click="showMessage(item)">
          <p class="font-bold text-lg text-[#4A587F]">{{ item.travelName }}</p>
          <p class=" text-[#616161]">{{ item.memberIds.length }}位成員</p>
        </div>
      </div>
      <div v-if="inMessage">
        <div ref="chatBody" class="chat-content p-4">
          <div v-for="(msg, index) in messages" :key="index">
            <div v-if="shouldShowDateDivider(index)" class="flex justify-center mb-2">
              <p class="text-[#494949] text-xs bg-gray-200 rounded-full px-3 py-1">
                {{ formatDateLabel(msg.createdAt) }}
              </p>
            </div>
            <div v-if="msg.senderId === 'system'" class="flex justify-center mb-2">
              <p class="text-[#494949] text-xs bg-gray-200 rounded-full px-3 py-1">
                {{ msg.content }}
              </p>
            </div>
            <div class="flex justify-start mb-2" v-if="msg.senderId !== userID && msg.senderId !== 'system'">
              <div>
                <p class="text-[#494949]">{{ msg.senderName || msg.senderId }}</p>
                <p class="chatList bg-[#8a94a5] text-white py-1 px-3 rounded-2xl text-left w-fit">{{ msg.content }}</p>
                <p class="text-[#494949] text-xs text-right">{{ formatTimestamp(msg.createdAt) }}</p>
              </div>
            </div>
            <div class="flex justify-end mb-2" v-if="msg.senderId === userID">
              <div>
                <p class="text-[#494949]">{{ msg.senderName || msg.senderId }}</p>
                <p class="chatList bg-[#a6a1ff] text-white py-1 px-3 rounded-2xl mb-4 text-right w-fit">{{ msg.content }}</p>
                <p class="text-[#494949] text-xs text-right">{{ formatTimestamp(msg.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="model-footer flex justify-center items-center relative p-2" v-if="inMessage">
        <input type="text" placeholder="輸入訊息..." v-model="newMessage" class="w-full p-2 border rounded-lg bg-white" />
        <button class="ml-2 bg-[#676767] text-white px-4 py-2 rounded-lg text-nowrap" @click="sendMessage()">發送</button>
      </div>
    </div>
  </div>
</template>

<script>
import { listenToMessages, sendMessage, getSharedTravelList } from "@/firestoreService";
export default {
  data() {
    return {
      showChat: false,
      inMessage: false,
      message: '',
      messages: [],
      isOpen: false,
      newMessage: "",
      roomId: '',
      roomName: '',
      userID: '',
      userName: '',
      travelList: []
    };
  },
  created() {
    console.log('53');
   // 存使用者跟資料在localStorage
    this.userName = localStorage.getItem('liffDisplayName') || '使用者名稱';
    this.userID = localStorage.getItem('liffUserId') || '222222';
    const value = localStorage.getItem('travelList');
    if (!value) {
      this.fetchMyTravelList();
    } else {
      this.travelList = JSON.parse(localStorage.getItem('travelList')) || [];
    }
  },
  updated() {
    this.scrollToBottom();
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe(); // 停止監聽
  },
  methods: {
    formatDateLabel(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

      const now = new Date();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const diffDays = Math.floor((now - date) / oneDayMs);

      // 今天
      if (diffDays === 0 && date.getDate() === now.getDate()) {
        return "今天";
      }

      // 昨天
      const yesterday = new Date(now.getTime() - oneDayMs);
      if (
        diffDays === 1 &&
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth()
      ) {
        return "昨天";
      }

      // 一週內
      if (diffDays < 7) {
        return date.toLocaleDateString("zh-TW", { weekday: "short" }); // 週一、週二...
      }

      // 更早，格式化為 YYYY/MM/DD
      return date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    formatDateOnly(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate();
      return date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      });
    },
    shouldShowDateDivider(index) {
      if (index === 0) return true;
      const current = this.formatDateOnly(this.messages[index].createdAt);
      const previous = this.formatDateOnly(this.messages[index - 1].createdAt);
      return current !== previous;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatBody;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    async fetchMyTravelList () {
      const travelList = await getSharedTravelList(this.userID);
      console.log('目前的 traveleList:', travelList);
      this.travelList = travelList;
      localStorage.setItem('travelList', JSON.stringify(this.travelList));
    },
    showMessage(item) {
      if (this.unsubscribe) this.unsubscribe();
      this.messages = []
      this.inMessage = true;
      this.roomId = item.id; // 假設每個聊天室有唯一的 ID
      this.roomName = item.travelName;
      this.unsubscribe = listenToMessages(this.roomId, (msgs) => {
      this.messages = msgs;
    });
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
    async sendMessage() {
      console.log('80');
      const content = this.newMessage.trim();
      console.log('object', content);
      if (!content) return;
      await sendMessage(this.roomId, this.userID, this.userName, content);
      this.newMessage = "";
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate();
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  },
}
</script>

<style lang="scss" scoped>
.chat-float {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 999;
}
.model-frame {
  z-index: 99;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .model{
    position: absolute;
    bottom: 0;
    background: #ffffff;
    border-radius: 22px 22px 0 0;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    color: #616161;
    height: 80vh;
    width: 100%;
    max-width: 500px;
    .model-header{
      box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.3);
    }
    .model-footer{
      box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.3);
    }
  }
  .chat-content{
    height: calc( 80vh - 118px);
    overflow-y: scroll;
  }
  .chatlist-content{
    height: calc( 80vh - 60px);
    overflow-y: scroll;
  }
}
</style>