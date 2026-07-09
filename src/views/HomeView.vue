<template>
  <div class="travelCardList relative bg-[#ffffff] min-h-screen pb-20 pt-[230px] relative">
    <div class="header fixed top-0 flex flex-col w-full  z-[99] justify-center items-start mb-4 py-5 px-5">
      <div class="flex justify-between items-center w-full mb-4">
        <p class="text-lg text-[#ffffff] tracking-wide">Hi~ <span class="text-xl">{{ userName }}</span></p>
        <div class="add-btn text-white tracking-wide flex items-center justify-center bg-[#ffffff26] rounded-full py-1 px-3" @click="$router.push('addtravelcard')">
          + 添加旅程
        </div>
      </div>
      <p class=" mb-6 text-[#ffffff] tracking-wide">{{ travelStatusText }} !</p>
      <div class="flex items-center bg-[#ffffff] rounded-2xl  left-5 right-5 py-3 absolute bottom-[-80px] justify-around mx-auto headerCard">
        <div class="flex flex-col items-center justify-center  w-1/3">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D96B44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="7" width="16" height="13" rx="2"/>
            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
            <path d="M4 12h16"/>
          </svg>
          <p class="my-1 text-sm">總旅程數</p>
          <p class="font-bold text-2xl text-[#3d4b71]">{{ travelList.length }}</p>
        </div>
        <div class="w-[1px] bg-[#00000014] h-[75px]"></div>
        <div class="flex flex-col items-center justify-center  w-1/3">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E6B8A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M3 12h18"/>
            <path d="M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"/>
          </svg>
          <p class="my-1 text-sm">造訪國家</p>
          <p class="font-bold text-2xl text-[#3d4b71]">{{countryAmount}} <span class="font-normal text-lg">個</span></p>
        </div>
        <div class="w-[1px] bg-[#00000014] h-[75px]"></div>
        <div class="flex flex-col items-center justify-center w-1/3">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A24C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
            <path d="M12 14v3l2 1"/>
          </svg>
          <p class="my-1 text-sm">總天數</p>
          <p class="font-bold text-2xl text-[#3d4b71]">{{ dayAmount }} <span class="font-normal text-lg">天</span></p>
        </div>
      </div>
    </div>
    <div class="mx-5 mb-3 flex items-center justify-between rounded-full bg-[#EEF1F7] font-bold tab text-[#6A7085]">
      <div class="p-2 w-1/3 text-center rounded-full" @click="tabChecked = 'now'" :class="{'bg-white': tabChecked === 'now','text-[#3d4b71]': tabChecked === 'now'}">進行中</div>
      <div class="p-2 w-1/3 text-center rounded-full" @click="tabChecked = 'comming'" :class="{'bg-white': tabChecked === 'comming','text-[#3d4b71]': tabChecked === 'comming'}">即將開始</div>
      <div class="p-2 w-1/3 text-center rounded-full" @click="tabChecked = 'end'" :class="{'bg-white': tabChecked === 'end','text-[#3d4b71]': tabChecked === 'end'}">已結束</div>
    </div>
    <div class="mt-20" v-if="filterList.length <= 0">
      <img src="../assets/img/header.png" class="w-3/5 mx-auto brightness-[0%]" alt="">
      <p class="text-center mt-2 text-[#838383]">目前沒有{{tabChecked === 'now' ? '進行中' : tabChecked === 'comming' ? '即將開始':'已結束'}}的旅程</p>
    </div>
    <div class="mx-3 mb-3 travelCard rounded-xl relative " v-for="(item, index) in filterList" :key="index" @click="showTravel(item.id)" :style="{ backgroundImage: `url(${getCountryImage(item)})` }">
      <div class="rounded-xl bg-[#0000005e] h-full w-full py-3 px-3 flex flex-col justify-center items-between relative"> 
        <div class="flex flex-col justify-center">
          <div class="flex justify-between items-center">
            <p class="rounded-lg  text-[#ffffff] text-sm text-center tracking-wide px-3 py-1 w-fit backdrop-blur-xs" :style="{ 'background': currentDate > item.endDate ? '#3b3b3ba1' : item.startDate > currentDate ? '#e34823c9' : '#c5960acf' }">{{ currentDate > item.endDate ? '已結束' : item.startDate > currentDate ? '即將開始' : '進行中' }}</p>

            <div class="flex items-center justify-center bg-[#ffffffe0] rounded-full p-1" @click.stop="moreOption(item)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3d4b71">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
            </svg>
            </div>
          </div>
          <p class="text-3xl text-[#ffffff] mt-3 font-bold">{{ item.travelName }}</p>
          <div class="mt-3 flex items-start justify-start gap-2 text-white">
            <svg
              class="shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>

            <p class="min-w-0 flex flex-wrap gap-y-1 text-white leading-snug">
              <span
                v-for="(country, index) in item.countries"
                :key="country"
                class="whitespace-nowrap"
              ><span v-if="index !== 0" class="mx-1">·</span>{{ transform(country) }}
              </span>
            </p>
          </div>
          <!-- <div class="dash-line my-3"></div> -->
          <div class="flex items-center mt-2">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <rect x="3" y="4" width="18" height="17" rx="2"></rect>

                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="16" y1="2" x2="16" y2="6"></line>

                <line x1="3" y1="10" x2="21" y2="10"></line>

              </svg>
              <p class="ml-2 text-[#ffffff] leading-none">{{ item.startDate }} ~ {{ item.endDate }}</p>
            </div>
          </div>
        </div>
        <div class="travelCard-bottom tracking-widest flex justify-between items-center w-full px-5 py-1 mt-4 rounded-xl bg-[#d1d1d182] text-white">
          <div class="flex items-center justify-start">
            <p>{{ item.dateList.length }} 天</p>
            <span class="mx-2 text-xs leading-none">|</span>
            <p>{{
                item.dateList.reduce((total, day) => {
                  return total + day.locationList.filter(
                    location => location.eventType === 'view'
                  ).length
                }, 0)
              }}
              個行程</p>
          </div> 
          
            <p class="travelCard-title text-sm ml-3 font-bold" :class="{ 'text-[#ffffff]': item.ownerId === userID, 'text-[#ffcd0b]': item.ownerId !== userID }">• {{ item.ownerId === userID ? '我的' : '共用' }}行程</p>
        </div>
      </div>
    </div>
  </div>
  <div class="z-[99] model-frame" ref="model" v-if="noticeMsg !== ''">
    <div class="notice-model px-3 py-8 text-xl" >
      <p class="mb-5 font-bold text-center">{{ noticeMsg }}</p>
      <div class="flex">
        <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#a9a9a9] text-white px-3 py-2 w-fit mr-3" @click="noticeMsg = ''">取消</p>
        <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#c95433] text-white px-3 py-2 w-fit" @click="comfirm()">確定</p>
      </div>
    </div>
  </div>
  <Transition name="bottom-sheet">
    <div
      v-if="isMoreOption"
      class="fixed inset-0 z-[99] bg-black/40 flex items-end"
      @click="isMoreOption = false; activeID = null"
    >
      <div
        ref="model"
        class="moreOption-model w-full p-5 text-xl flex flex-col items-center justify-center rounded-t-3xl bg-white"
        @click.stop
      >
        <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>

        <div class="flex items-center justify-start w-full" @click.stop="edit()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="#3d4b71"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>
          <p class="ml-4 py-3 w-full font-bold">編輯行程</p>
        </div>

        <div class="flex items-center justify-start w-full" v-if="activeTravel && activeTravel.ownerId === userID" @click.stop="share()">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
            viewBox="0 0 24 24" fill="none" stroke="#3d4b71"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
            <path d="M12 16V3"/>
            <path d="M7 8l5-5 5 5"/>
          </svg>
          <p class="ml-4 py-3 w-full font-bold">邀請好友一同編輯行程</p>
        </div>

        <div class="flex items-center justify-start w-full" v-if="activeTravel && activeTravel.ownerId === userID" @click="actionMode = 'delete';isMoreOption=false;noticeMsg = '確定刪除此行程嗎？'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="#fd8f45"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
          <p class="ml-4 py-3 w-full text-[#fd8f45] font-bold">刪除行程</p>
        </div>

        <div class="flex items-center justify-start w-full" v-if="activeTravel && activeTravel.ownerId !== userID" @click.stop="actionMode = 'leave'; isMoreOption=false;noticeMsg = '確定退出此行程嗎？'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="#a37c23"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="12" height="18" rx="1.5"/>
            <circle cx="11" cy="12" r="0.6" fill="#a37c23" stroke="none"/>
            <path d="M15 12h6"/>
            <path d="M18 9l3 3-3 3"/>
          </svg>
          <p class="ml-4 py-3 w-full text-[#a37c23] font-bold">退出行程</p>
        </div>
      </div>
    </div>
  </Transition>
  <Loading v-if="isLoading" />
  <ChatRoom />
</template>

<script>
import { ref, onMounted } from 'vue';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import Loading from '@/components/Loading.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { getSharedTravelList, deleteSharedTravelItem, leaveTrip } from '@/firestoreService';
import ChatRoom from '@/components/ChatRoom.vue';
const route = useRoute();
export default {
  data() {
    return {
      tabChecked: localStorage.getItem('travelTab') || 'now',
      isMoreOption: false,
      currentDate: new Date().toISOString().split('T')[0],
      barcode: null,
      qrcode: null,
      travelList: [],
      couponIndex: 0,
      isLoading: false,
      userName: '使用者名稱',
      userID : '',
      activeID: null,
      noticeMsg: '',
      actionMode: '',
      countryMap: {
        JP: { name: '日本', continent: 'Asia', flag: '🇯🇵' },
        KR: { name: '韓國', continent: 'Asia', flag: '🇰🇷' },
        TW: { name: '台灣', continent: 'Asia', flag: '🇹🇼' },
        CN: { name: '中國', continent: 'Asia', flag: '🇨🇳' },
        HK: { name: '香港', continent: 'Asia', flag: '🇭🇰' },
        MO: { name: '澳門', continent: 'Asia', flag: '🇲🇴' },
        MN: { name: '蒙古', continent: 'Asia', flag: '🇲🇳' },
        VN: { name: '越南', continent: 'Asia', flag: '🇻🇳' },
        TH: { name: '泰國', continent: 'Asia', flag: '🇹🇭' },
        SG: { name: '新加坡', continent: 'Asia', flag: '🇸🇬' },
        MY: { name: '馬來西亞', continent: 'Asia', flag: '🇲🇾' },
        NP: { name: '尼泊爾', continent: 'Asia', flag: '🇳🇵' },
        LK: { name: '斯里蘭卡', continent: 'Asia', flag: '🇱🇰' },
        MV: { name: '馬爾地夫', continent: 'Asia', flag: '🇲🇻' },
        SA: { name: '沙烏地阿拉伯', continent: 'Asia', flag: '🇸🇦' },
        QA: { name: '卡達', continent: 'Asia', flag: '🇶🇦' },
        TR: { name: '土耳其', continent: 'Asia', flag: '🇹🇷' },
        ID: { name: '印尼', continent: 'Asia', flag: '🇮🇩' },
        PH: { name: '菲律賓', continent: 'Asia', flag: '🇵🇭' },
        BN: { name: '汶萊', continent: 'Asia', flag: '🇧🇳' },
        BT: { name: '不丹', continent: 'Asia', flag: '🇧🇹' },
        AE: { name: '阿聯', continent: 'Asia', flag: '🇦🇪' },
        IL: { name: '以色列', continent: 'Asia', flag: '🇮🇱' },
        JO: { name: '約旦', continent: 'Asia', flag: '🇯🇴' },

        FI: { name: '芬蘭', continent: 'Europe', flag: '🇫🇮' },
        SE: { name: '瑞典', continent: 'Europe', flag: '🇸🇪' },
        NO: { name: '挪威', continent: 'Europe', flag: '🇳🇴' },
        DK: { name: '丹麥', continent: 'Europe', flag: '🇩🇰' },
        IS: { name: '冰島', continent: 'Europe', flag: '🇮🇸' },
        FR: { name: '法國', continent: 'Europe', flag: '🇫🇷' },
        IT: { name: '義大利', continent: 'Europe', flag: '🇮🇹' },
        DE: { name: '德國', continent: 'Europe', flag: '🇩🇪' },
        CH: { name: '瑞士', continent: 'Europe', flag: '🇨🇭' },
        AT: { name: '奧地利', continent: 'Europe', flag: '🇦🇹' },
        CZ: { name: '捷克', continent: 'Europe', flag: '🇨🇿' },
        SK: { name: '斯洛伐克', continent: 'Europe', flag: '🇸🇰' },
        HU: { name: '匈牙利', continent: 'Europe', flag: '🇭🇺' },
        PL: { name: '波蘭', continent: 'Europe', flag: '🇵🇱' },
        NL: { name: '荷蘭', continent: 'Europe', flag: '🇳🇱' },
        BE: { name: '比利時', continent: 'Europe', flag: '🇧🇪' },
        LU: { name: '盧森堡', continent: 'Europe', flag: '🇱🇺' },
        ES: { name: '西班牙', continent: 'Europe', flag: '🇪🇸' },
        PT: { name: '葡萄牙', continent: 'Europe', flag: '🇵🇹' },
        GB: { name: '英國', continent: 'Europe', flag: '🇬🇧' },
        IE: { name: '愛爾蘭', continent: 'Europe', flag: '🇮🇪' },
        GR: { name: '希臘', continent: 'Europe', flag: '🇬🇷' },
        HR: { name: '克羅埃西亞', continent: 'Europe', flag: '🇭🇷' },
        SI: { name: '斯洛維尼亞', continent: 'Europe', flag: '🇸🇮' },

        US: { name: '美國', continent: 'NorthAmerica', flag: '🇺🇸' },
        CA: { name: '加拿大', continent: 'NorthAmerica', flag: '🇨🇦' },
        MX: { name: '墨西哥', continent: 'NorthAmerica', flag: '🇲🇽' },
        CR: { name: '哥斯大黎加', continent: 'NorthAmerica', flag: '🇨🇷' },
        CU: { name: '古巴', continent: 'NorthAmerica', flag: '🇨🇺' },

        BR: { name: '巴西', continent: 'SouthAmerica', flag: '🇧🇷' },
        AR: { name: '阿根廷', continent: 'SouthAmerica', flag: '🇦🇷' },
        CL: { name: '智利', continent: 'SouthAmerica', flag: '🇨🇱' },
        PE: { name: '秘魯', continent: 'SouthAmerica', flag: '🇵🇪' },
        BO: { name: '玻利維亞', continent: 'SouthAmerica', flag: '🇧🇴' },
        CO: { name: '哥倫比亞', continent: 'SouthAmerica', flag: '🇨🇴' },

        AU: { name: '澳洲', continent: 'Oceania', flag: '🇦🇺' },
        NZ: { name: '紐西蘭', continent: 'Oceania', flag: '🇳🇿' },
        FJ: { name: '斐濟', continent: 'Oceania', flag: '🇫🇯' },
        PG: { name: '巴布亞紐幾內亞', continent: 'Oceania', flag: '🇵🇬' },

        EG: { name: '埃及', continent: 'Africa', flag: '🇪🇬' },
        ZA: { name: '南非', continent: 'Africa', flag: '🇿🇦' },
        MA: { name: '摩洛哥', continent: 'Africa', flag: '🇲🇦' },
        KE: { name: '肯亞', continent: 'Africa', flag: '🇰🇪' },
        TZ: { name: '坦尚尼亞', continent: 'Africa', flag: '🇹🇿' }
      }
    };
  },
  components: {
    Loading,
    ChatRoom,
  },
  watch: {
    tabChecked(newValue) {
      localStorage.setItem('travelTab', newValue);
    }
  },
  computed: {
    countryAmount() {
      const countries = new Set();
      for (const travel of this.travelList) {
        for (const country of travel.countries || []) {
          countries.add(country);
        }
      }
      return countries.size;
    },
    dayAmount(){
      return this.travelList.reduce((count, { dateList }) => {
          return count + dateList.length
        }
      ,0)
    },
    travelStatusText() {
      const today = new Date().toISOString().split('T')[0];

      const ongoing = this.travelList.find(item =>
        item.startDate <= today && item.endDate >= today
      );

      if (ongoing) {
        return `目前正在「${ongoing.travelName}」旅程中`;
      }

      const upcoming = this.travelList
        .filter(item => item.startDate > today)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

      if (upcoming) {
        const diffDays = this.getDiffDays(today, upcoming.startDate);
        return `您的下一趟旅程還有 ${diffDays} 天`;
      }

      return '目前沒有即將開始的旅程';
    },
    filterList() {
      const currentDate = new Date().toISOString().split('T')[0];
      return this.travelList.filter(item => {
        if (this.tabChecked === 'now') {
          return item.startDate <= currentDate && item.endDate >= currentDate;
        }

        if (this.tabChecked === 'comming') {
          return item.startDate > currentDate;
        }

        if (this.tabChecked === 'end') {
          return item.endDate < currentDate;
        }

        return true;
      });
    },
    activeTravel() {
      console.log(this.travelList.find(item => item.id === this.activeID))
      return this.travelList.find(item => item.id === this.activeID);
    }
  },
  created() {
    console.log('53');
   // 存使用者跟資料在localStorage
    this.userName = localStorage.getItem('liffDisplayName') || '使用者名稱';
    // alert('userName: ' + this.userName);
    this.userID = localStorage.getItem('liffUserId') || '222222';
    const value = localStorage.getItem('travelList');
    if (!value) {
      this.fetchMyTravelList();
    } else {
      this.travelList = JSON.parse(localStorage.getItem('travelList')) || [];
    }
    console.log(this.travelList)
  },
  beforeRouteUpdate(to, from, next) {
    console.log('userId', localStorage.getItem('userId'))
    next();
  },
  mounted() {
  },
  methods: {
    getDiffDays(fromDate, toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    },
    getCountryImage(item) {
      const code = item.countries && item.countries.length
        ? item.countries[0]
        : 'default';

      return `/country/${code}.png`;
    },
    transform(code) {
      return this.countryMap[code]?.name || '';
    },
    async share () {
      const travel = this.travelList.find(item => item.id === this.activeID)
      console.log(travel)
      const countries = travel.countries.length;
      const flexMessage = {
        type: "flex",
        altText: `我想和你一起規劃旅程！點擊加入 👉 `,
        contents:{
          "type": "bubble",
          "size": "mega",
          "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `來自${this.userName}分享`,
                    "size": "xs",
                    "color": "#ffffff"
                  }
                ],
                "position": "absolute",
                "backgroundColor": "#ffffff59",
                "offsetTop": "lg",
                "offsetEnd": "xxl",
                "cornerRadius": "lg",
                "spacing": "none",
                "margin": "none",
                "paddingTop": "xs",
                "paddingBottom": "xs",
                "paddingStart": "md",
                "paddingEnd": "md"
              },
              {
                "type": "text",
                "text": travel.travelName,
                "color": "#ffffff",
                "size": "xl",
                "margin": "xxl",
                "weight": "bold"
              }
            ],
            "background": {
              "type": "linearGradient",
              "angle": "135deg",
              "startColor": "#3d4b71",
              "endColor": "#3d4b71"
            },
            "spacing": "sm"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "FROM",
                        "size": "xs",
                        "color": "#767676"
                      },
                      {
                        "type": "text",
                        "text": travel.startDate,
                        "size": "xl",
                        "color": "#676767",
                        "weight": "bold",
                        "flex": 3,
                        "align": "end"
                      }
                    ],
                    "alignItems": "flex-start"
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "TO",
                        "size": "xs",
                        "color": "#767676"
                      },
                      {
                        "type": "text",
                        "text": travel.endDate,
                        "size": "xl",
                        "color": "#676767",
                        "weight": "bold",
                        "flex": 3,
                        "align": "end"
                      }
                    ],
                    "justifyContent": "center",
                    "alignItems": "center",
                    "margin": "lg"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [],
                "width": "100%",
                "height": "1px",
                "backgroundColor": "#D4A24C",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": `${travel.dateList.length}`,
                        "size": "xl",
                        "color": "#D4A24C"
                      },
                      {
                        "type": "text",
                        "text": "天數",
                        "size": "xs",
                        "color": "#767676"
                      }
                    ],
                    "justifyContent": "center",
                    "alignItems": "center"
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": `${countries}`,
                        "size": "xl",
                        "color": "#D4A24C"
                      },
                      {
                        "type": "text",
                        "text": "國家",
                        "size": "xs",
                        "color": "#767676"
                      }
                    ],
                    "justifyContent": "center",
                    "alignItems": "center"
                  }
                ],
                "margin": "xxl"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "👀 立即查看詳細行程 👀 ",
                  "uri": `https://liff.line.me/2007434426-kEld5nXv/search?uid=${this.userID}&tid=${travel.id}`
                },
                "color": "#D4A24C",
                "style": "primary"
              }
            ],
            "paddingAll": "xxl"
          }
        }
        // contents: {
        //   "type": "bubble",
        //   "size": "mega",
        //   "header": {
        //     "type": "box",
        //     "layout": "vertical",
        //     "contents": [
        //       {
        //         "type": "box",
        //         "layout": "vertical",
        //         "contents": [
        //           {
        //             "type": "text",
        //             "text": `來自${this.userName}分享`,
        //             "size": "xs",
        //             "color": "#ffffff"
        //           }
        //         ],
        //         "position": "absolute",
        //         "backgroundColor": "#ffffff59",
        //         "offsetTop": "lg",
        //         "offsetEnd": "xxl",
        //         "cornerRadius": "lg",
        //         "spacing": "none",
        //         "margin": "none",
        //         "paddingTop": "xs",
        //         "paddingBottom": "xs",
        //         "paddingStart": "md",
        //         "paddingEnd": "md"
        //       },
        //       {
        //         "type": "text",
        //         "text": this.travelList[i].travelName,
        //         "color": "#ffffff",
        //         "size": "xl",
        //         "margin": "xxl"
        //       }
        //     ],
        //     "background": {
        //       "type": "linearGradient",
        //       "angle": "135deg",
        //       "startColor": "#D4A24C",
        //       "endColor": "#FF8E53"
        //     },
        //     "spacing": "sm"
        //   },
        //   "body": {
        //     "type": "box",
        //     "layout": "vertical",
        //     "contents": [
        //       {
        //         "type": "box",
        //         "layout": "vertical",
        //         "contents": [
        //           {
        //             "type": "box",
        //             "layout": "baseline",
        //             "contents": [
        //               {
        //                 "type": "text",
        //                 "text": "FROM",
        //                 "size": "xs",
        //                 "color": "#767676"
        //               },
        //               {
        //                 "type": "text",
        //                 "text": this.travelList[i].startDate,
        //                 "size": "xl",
        //                 "color": "#676767"
        //               }
        //             ],
        //             "alignItems": "flex-start"
        //           },
        //           {
        //             "type": "box",
        //             "layout": "baseline",
        //             "contents": [
        //               {
        //                 "type": "text",
        //                 "text": "TO",
        //                 "size": "xs",
        //                 "color": "#767676"
        //               },
        //               {
        //                 "type": "text",
        //                 "text": this.travelList[i].endDate,
        //                 "size": "xl",
        //                 "color": "#676767"
        //               }
        //             ],
        //             "justifyContent": "center",
        //             "alignItems": "center",
        //             "margin": "lg"
        //           }
        //         ]
        //       },
        //       {
        //         "type": "box",
        //         "layout": "vertical",
        //         "contents": [],
        //         "width": "100%",
        //         "height": "1px",
        //         "backgroundColor": "#D4A24C",
        //         "margin": "xxl"
        //       },
        //       {
        //         "type": "box",
        //         "layout": "horizontal",
        //         "contents": [
        //           {
        //             "type": "box",
        //             "layout": "vertical",
        //             "contents": [
        //               {
        //                 "type": "text",
        //                 "text": this.travelList[i].dateList.length,
        //                 "size": "xl",
        //                 "color": "#D4A24C"
        //               },
        //               {
        //                 "type": "text",
        //                 "text": "天數",
        //                 "size": "xs",
        //                 "color": "#767676"
        //               }
        //             ],
        //             "justifyContent": "center",
        //             "alignItems": "center"
        //           },
        //           {
        //             "type": "box",
        //             "layout": "vertical",
        //             "contents": [
        //               {
        //                 "type": "text",
        //                 "text": "5",
        //                 "size": "xl",
        //                 "color": "#D4A24C"
        //               },
        //               {
        //                 "type": "text",
        //                 "text": "地點",
        //                 "size": "xs",
        //                 "color": "#767676"
        //               }
        //             ],
        //             "justifyContent": "center",
        //             "alignItems": "center"
        //           }
        //         ],
        //         "margin": "xxl"
        //       }
        //     ]
        //   },
        //   "footer": {
        //     "type": "box",
        //     "layout": "vertical",
        //     "contents": [
        //       {
        //         "type": "button",
        //         "action": {
        //           "type": "uri",
        //           "label": "👀 立即查看詳細行程 👀 ",
        //           "uri": `https://liff.line.me/2007434426-kEld5nXv/search?uid=${this.userID}&tid=${this.travelList[i].id}`
        //         },
        //         "color": "#D4A24C",
        //         "style": "primary"
        //       }
        //     ],
        //     "paddingAll": "xxl"
        //   }
        // }
      };
      console.log('flexMessage', flexMessage);
      try {
        const result = await liff.shareTargetPicker([flexMessage]);
        if (result) {
          // 使用者有成功分享（result 會有值）
          alert('已成功分享！');
        } else {
          // 有時候不會丟出錯誤但使用者取消了（可能是 result 為 null）
          alert('您已取消分享。');
        }

      } catch (error) {
        console.error('分享失敗:', error);
        if (error.code === 203) {
          // LIFF error code 203 通常代表使用者取消
          alert('您已取消分享。');
        } else {
          alert(`分享時發生錯誤: ${error.message}`);
        }
      }
      
    },
    async del()  {
      // 要加上是否有權顯示刪除按鈕
      await deleteSharedTravelItem(this.activeID);
      this.activeID = null;
      this.noticeMsg = '';
      this.fetchMyTravelList();
    },
    comfirm() {
      console.log(this.actionMode, this.activeID)
      if(this.actionMode === 'delete') {
        this.del();
      } else if(this.actionMode === 'leave') {
        this.leave();
      }
    },
    async leave() {
      const success = await leaveTrip(this.activeID, this.userID);
      this.activeID = null;
      this.noticeMsg = '';

      if (success) {
        await this.fetchMyTravelList();
      } else {
        alert('退出旅程失敗');
      }
    },
    moreOption (item) {
      console.log('758',item)
      this.activeID = this.activeID === item.id ? null : item.id;
      this.isMoreOption = true
    },
    edit () {
      this.$router.push({
        path: '/addtravelcard',
        query: { id: this.activeID, editMode: true }
      });
    },
    showTravel (id) {
      this.$router.push({
        path: '/travelcard',
        query: { id: id }
      });
    },
    async fetchMyTravelList () {
      this.isLoading = true
      const travelList = await getSharedTravelList(this.userID);
      console.log('目前的 traveleList:', travelList);
      this.travelList = travelList;
      this.isLoading = false
      localStorage.setItem('travelList', JSON.stringify(this.travelList));
    },
    dateFormat(dateStr) {
      const firestoreTimestamp = dateStr;
      const jsDate = new Date(firestoreTimestamp.seconds * 1000);
      return jsDate;
    },
    dayFormat(dayNum) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[dayNum];
    },
    monthFormat(monthNum) {
      const months = [      
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return months[monthNum];
    },
    generateCodes(index) {
      // 生條碼
      if (this.barcode) {
        JsBarcode(this.barcode, this.couponList[index].code, {
          format: 'CODE128',
          lineColor: '#000',
          width: 2,
          height: 100,
          displayValue: true
        });
      }

      // 生QRCode
      if (this.qrcode) {
        QRCode.toCanvas(this.qrcode, this.couponList[index].code, {
          width: 200,
          margin: 2
        }, (error) => {
          if (error) console.error(error);
        });
      }
    },
  }
};
</script>

<style lang="scss" scoped>
svg, canvas {
  display: block;
}
.header{
  background: linear-gradient(#4A587F,#59688F);
}
.headerCard{
  box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.2);
}
.tab{
  box-shadow: 0 3px 8px rgba(0,0,0,.08);
  border: 1px solid #E8E9EE;
  background: #E6E8EF;
}
.travelCard{
    background-position: bottom;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  // background: #ffffff;
  box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.3)
}
.travelCard-bottom {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  border-top: 1px solid rgba(255, 255, 255, 0.15);
}
.travelCard:active, .travelCard:hover{
  cursor: pointer;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.4);
}
.option{
  z-index: 99;
  box-shadow: 2px 3px 3px 1px rgba(0, 0, 0, 0.5);
}
.add-btn {
  border: 1px solid rgba(255, 255, 255, .3);
  backdrop-filter: blur(4px);
}
.card{
  // box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  position: relative;
  background: #ff7d31;
  .card-title{
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.3);
    background: #ffffff;
    border-right: #ffffff 2px dashed;
    border-radius: 12px;
  }
  .card-use{
  }
  .dotted-left{
    width: 2px;
    height: 90%;
    margin: auto;
    border-left: #ffffff 8px dotted;
    position: absolute;
    left: -4px;
    top: 5%;  
  }
  .dotted-right{
    width: 2px;
    height: 90%;
    margin: auto;
    border-right: #ffffff 8px dotted;
    position: absolute;
    right: -4px;
    top: 5%;  
  }
}
.dash-line{
  width: 100%;
  height: 2px;
  border-bottom: #cfcfcf94 1px solid;
}
.model-frame {
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  .model{
    width: 80%;
    max-width: 400px;
    height: 85%;
    max-height: 650px;
    background: #ffffff;
    border-radius: 22px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
  }
  .notice-model{
    width: 80%;
    height: fit-content;
    background: #ffffff;
    border-radius: 22px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    color: #676767;
  }
  .moreOption-model{
    background: #ffffff;
    border-radius: 22px 22px 0 0;
    height: fit-content;
    width: 100%;
    margin: auto 0;
    position: absolute;
    bottom: 0;
  }
}
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.25s ease;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-enter-from .moreOption-model,
.bottom-sheet-leave-to .moreOption-model {
  transform: translateY(100%);
}

.bottom-sheet-enter-to .moreOption-model,
.bottom-sheet-leave-from .moreOption-model {
  transform: translateY(0);
}

.moreOption-model {
  transition: transform 0.25s ease;
}
</style>
