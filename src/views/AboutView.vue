<template>
  <div class="addTravelCard relative flex justify-center items-center overflow-y-hidden  pt-[460px]" >
    <div class="w-full header shadow-xl fixed top-0 left-0" :style="{ backgroundImage: `url(${getCountryImage()})` }">
      <div class="bg-[#434343a1] pt-6 pb-12">
        <div class="flex flex-col items-center justify-center ml-5 mb-5 text-white">
          <!-- <p class="absolute top-[20px] left-[15px] text-3xl z-20" @click="$router.replace('/')">⭠</p> -->
          <div class="absolute top-[28px] right-[15px] z-20" @click="$router.replace('/')"><img src="../assets/img/home.png" width="20" alt=""></div>
          <p class="font-bold text-xl">{{ travelItem.travelName }}</p>
          <div class="my-2  flex items-start justify-start gap-2 text-white self-start">
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
                v-for="(country, index) in travelItem.countries" :key="index"
                class="whitespace-nowrap"
              ><span v-if="index !== 0" class="mx-1">·</span>{{ transform(country) }}
              </span>
            </p>
          </div>
          <div class="flex items-center self-start">
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
              <p class="ml-2 text-[#ffffff] leading-none">{{ travelItem.startDate }} ~ {{ travelItem.endDate }}</p>
            </div>
        </div>
        <div class="flex overflow-x-auto">
          <div :class="{'ml-3': index === 0}" class="mr-2" v-for="(item, index) in travelItem.dateList" :key="index" @click="currentDay = index; scrollToTop()">
            <p class="text-nowrap font-bold text-center text-sm mb-1 " :class="{'text-[#ffffff]': currentDay === index,'text-[#f9f9f985]': currentDay !== index}">Day {{ index + 1 }}</p>
            <div class="backdrop-blur-xs flex justify-center items-center flex-col h-[92px] w-[68px] rounded-2xl font-bold" :class="{'text-[#D4A24C]': currentDay === index,'text-[#00000085]': currentDay !== index , 'bg-white': currentDay === index,'bg-[#eeeeee7f]': currentDay !== index}" >
              <p class="">{{ monthFormat(dateFormat(item.date).getMonth()) }}</p>
              <p class="text-2xl text-nowrap">{{ dateFormat(item.date).getDate() }}</p>
              <p class="">{{ dayFormat(dateFormat(item.date).getDay()) }}</p>
            </div>
          </div >
        </div>
        <!-- <p class="text-[#D4A24C] text-lg tracking-widest font-bold text-center mt-2" @click="saveData()">加入共用旅程</p> -->
         <div class="w-[85%] mx-auto px-4 py-3 rounded-xl bg-[#ffffff96] mt-5 shareFrame flex flex-col items-center">
          <div class="flex justify-around">
            <div class="rounded-full bg-white flex w-[40px] h-[40px] p-1 border border-[#D4A441] items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="#D4A441"
                stroke="#D4A441"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div class="w-3/4">
              <p class="text-[#161616] font-bold text-lg mb-1">好友邀請你一起規劃旅行</p>
              <p class="text-[#2d2d2d] mb-2">加入後可以一同編輯行程，也可以存取在自己的旅行清單，馬上加入行程吧!!</p>
            </div>
          </div>
          <p class="text-[#FFFFFF] bg-[#D4A441] w-fit rounded-2xl py-1 px-3 self-end" @click="saveData()">立即加入 > </p>
         </div>
      </div>
    </div>
    <div  class="w-full content px-10 py-12 overflow-y-auto relative -mt-[20px] bg-[#ffffff] rounded-t-3xl" style="height: calc(100vh - 440px);">
      <div v-for="(item, index) in  (
        travelItem.dateList[currentDay]
          ? travelItem.dateList[currentDay].locationList
          : []
      )" class="mb-8" :key="index">
        <div class="flex text-[#767676]">
          <div class="flex flex-col justify-center items-center relative">
            <p class="startTime text-xl font-bold text-[#D4A24C]">{{ item.startTime }}</p>
          </div>
          <div class="w-full  locationList pl-4">
            <p class="text-xl font-bold  text-[#3b3b3b]"><span>{{ item.eventType == 'view' ? '🗺️' : item.eventType == 'food' ? '🍽️' : item.eventType == 'accommodation' ? '🏨' : item.eventType == 'transportation' ? '🚗' : '🆕' }}</span> {{ item.eventName}}</p>
            <p class="text-lg">🕐<span class="ml-2">{{ item.startTime }} - {{ item.endTime }}</span></p>
            <p class="text-lg" @click="openMap(item.location)">📍<span class="ml-2"><u>{{ item.location }}</u></span></p>
            <p class="text-lg" v-if="item.transport">🚆<span class="ml-2">{{ item.transport }}</span></p>
            <p class="text-lg"  v-if="item.cost > 0 " >💰<span class="ml-2">${{ item.cost }}</span></p>
            <div v-if="item.notice" class="bg-[#faf0df] p-3 rounded-lg mt-2"> 
              <p class="text-lg" >📝{{ item.notice }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="z-[99] model-frame" ref="model" v-if="noticeMsg !== ''">
    <div class="notice-model px-3 py-8 text-xl" >
      <p class="mb-5 font-bold text-center">{{ noticeMsg }}</p>
      <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#093857] text-white px-3 py-1 w-fit" @click="closeBtn()">關閉</p>
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>
<script>
  import { ref, onMounted } from 'vue';
  import JsBarcode from 'jsbarcode';
  import QRCode from 'qrcode';
  import Loading from '@/components/Loading.vue';
  import router from '@/router';
  import { useRoute } from 'vue-router';
  import { getOtherTravelList, joinTrip } from '@/firestoreService';
  const route = useRoute();
  export default {
    data() {
      return {
      userID: '',
      currentDay: 0,
      day: 1,
      time: '',
      location: '',
      transport: '',
      notice: '',
      noticeMsg: '',
      isLoading: false,
      travelItem: {
        travelName: '',
        startDate: '',
        endDate: '',
        dateList: [],
        countries: [],
        memberIds: []
      },
      travelItemID: this.$route.query.tid,
      travelList: JSON.parse(localStorage.getItem('travelList')) || [],
      uid: '',
      tid: '',
      goToCardBtn: false,
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
    },
    created() {
      this.userID = localStorage.getItem('liffUserId') || '123123'
      this.uid = this.$route.query.uid
      this.tid = this.$route.query.tid
      this.travelItemID = this.tid
      this.getList()
    },
    methods: {
      getCountryImage() {
        const code = this.travelItem.countries && this.travelItem.countries.length
          ? this.travelItem.countries[0]
          : 'default';

        return `/country/${code}.png`;
      },
      transform(code) {
        return this.countryMap[code]?.name || '';
      },
      async getList() {
        console.log('107', this.travelItemID);
        this.travelItem = await getOtherTravelList(this.tid)
        for(let i =0 ;i< this.travelItem.memberIds.length; i++) {
          if (this.travelItem.memberIds[i] === this.userID) {
             this.$router.push({
              path: '/travelcard',
              query: { id: this.travelItemID }
            });
            return
          }
        }
      },
      openMap(locationName) {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`
        window.open(googleMapsUrl, '_blank')
      },
      dateFormat(dateStr) {
        const firestoreTimestamp = dateStr
        const jsDate = new Date(firestoreTimestamp.seconds * 1000)
        return jsDate
      },
      dayFormat(dayNum) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return days[dayNum]
      },
      monthFormat(monthNum) {
        const months = [      
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
        return months[monthNum]
      },
      scrollToTop() {
        // 1. 獲取容器元素
        const container = document.querySelector('.content');
        // 2. 滾動到頂部
        console.log(container);
        container.scrollTo({
          top: 0,
          behavior: 'smooth' // 平滑滾動
        });
      },
      toMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number)
        return hours * 60 + minutes
      },
      async saveData() {
        console.log('this.travelItem.memberIds', this.travelItem.memberIds)
        for(let i =0 ;i< this.travelItem.memberIds.length; i++) {
          if (this.travelItem.memberIds[i] === this.userID) {
            this.noticeMsg = '你已經加入過此旅程了!'
            return
          }
        }
        this.isLoading = true
        const success = await joinTrip(this.tid, this.userID)
        this.isLoading = false
        this.noticeMsg = success ? '旅程加入成功!' : '旅程加入失敗!'
        if(success){
          this.goToCardBtn = true 
        }
      },
      closeBtn(){
        if(this.goToCardBtn) {
          this.$router.push({
            path: '/travelcard',
            query: { id: this.travelItemID }
          });
        } else {
          this.noticeMsg = ''
        }
      }
    }
  }
  </script>

<style lang="scss" scoped>
  body {
    overflow: hidden;
  }
  svg, canvas {
    // margin: 20px auto;
    display: block;
  }
  .header{
    background-position: bottom;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .locationList {
    border-left: 2px solid #cdcdcd;
  }
  .startTime{
      position: absolute;
      top: -30px;
      left: -24px;
    }
  .travelCard{
    width: 100%;
    height: 100px;
    // background: #e66646;
    border-radius: 12px;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.6);
    background: url('../assets/img/bg.jpg') no-repeat center;
    background-size: cover;
  }
  .add-btn{
    position: fixed;
    bottom: 15px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.6);
    background: #ffffff;
  }
  .dotted-line{
    height: 1px;
    width: 100%;
    border-top: 2px dotted #ffffff;
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
  .bg-linear{
    background: #3d4b71;
  }
  .shareFrame{
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,.25);
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
  background: rgba(0, 0, 0, 0.3);
  .model{
    width: 100%;
    max-width: 400px;
    height: fit-content;
    max-height: 650px;
    background: #ffffff;
    border-radius: 28px 28px 0 0;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 0;
    color: #676767;
    input, textarea{
      border-color: #676767;
      outline-color: #ff7b28;
    }
  }
  .notice-model{
    width: 80%;
    height: fit-content;
    background: #ffffff;
    border-radius: 22px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    color: #676767;
  }
}
</style>
