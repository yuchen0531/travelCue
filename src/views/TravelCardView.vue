<template>
  <div class="addTravelCard relative flex justify-center items-center overflow-y-hidden pt-[290px]" >
    <div class="w-full header shadow-xl fixed top-0 left-0" :style="{ backgroundImage: `url(${getCountryImage()})` }">
      <div class="bg-[#434343a1] pt-6 ">
        <div class="flex flex-col items-center justify-center ml-5 mb-5 text-white">
          <p class="absolute top-[20px] left-[15px] text-3xl z-20" @click="$router.replace('/')">⭠</p>
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
        <div class="flex overflow-x-auto pb-12">
          <div :class="{'ml-3': index === 0}" class="mr-2" v-for="(item, index) in travelItem.dateList" :key="index" @click="currentDay = index; scrollToTop()">
            <p class="text-nowrap font-bold text-center text-sm mb-1 " :class="{'text-[#ffffff]': currentDay === index,'text-[#f9f9f985]': currentDay !== index}">Day {{ index + 1 }}</p>
            <div class="backdrop-blur-xs flex justify-center items-center flex-col h-[92px] w-[68px] rounded-2xl font-bold" :class="{'text-[#D4A24C]': currentDay === index,'text-[#00000085]': currentDay !== index , 'bg-white': currentDay === index,'bg-[#eeeeee7f]': currentDay !== index}" >
              <p class="">{{ monthFormat(dateFormat(item.date).getMonth()) }}</p>
              <p class="text-2xl text-nowrap">{{ dateFormat(item.date).getDate() }}</p>
              <p class="">{{ dayFormat(dateFormat(item.date).getDay()) }}</p>
            </div>
          </div >
        </div>
      </div>
    </div>
    <div class="w-full content px-10 py-12 overflow-y-auto relative -mt-[20px] bg-[#ffffff] rounded-t-3xl" style="height: calc(100vh - 270px);"  ref="containerRef">
      <svg v-if="travelItem.dateList[currentDay].locationList.length !== 0" class="w-[32px] absolute top-[20px] right-5" @click="share()" xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">

          <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
          <path d="M12 16V3"/>
          <path d="M7 8l5-5 5 5"/>
        </svg>
      <div v-if="travelItem.dateList[currentDay].locationList.length === 0" class="mb-8">
        <p class="text-xl font-bold text-center text-[#D4A24C]" @click="gotoEdit()">本日無安排行程<br>立即前往新增 ➟</p>
      </div>
      <div v-for="(item, index) in travelItem.dateList[currentDay].locationList" class="mb-8" :key="index">
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
      <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#093857] text-white px-3 py-1 w-fit" @click="noticeMsg = ''">關閉</p>
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>

<script>
import { ref, onMounted } from 'vue';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import Loading from '@/components/Loading.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const jsonInput = ref('');
const saving = ref(false);
const message = ref('');
const userId = ref(null);
export default {
  data() {
    return {
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
        countries: []
      },
      travelItemID: this.$route.query.id,
      travelList: JSON.parse(localStorage.getItem('travelList')) || [],
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
    }
  },
  components: {
    Loading
  },
  computed: {
  },
  created () {
    console.log('226', this.$route.query.id);
    console.log('227', this.$route.query);
    console.log(this.travelList);
    this.travelList.forEach((item, index) => {
      console.log(item.id);
      if (item.id === this.travelItemID) {
        console.log('93');
        this.travelItem = {
          travelName: item.travelName,
          startDate: item.startDate,
          endDate: item.endDate,
          dateList: item.dateList || [],
          countries: item.countries
        }
      }
      console.log(this.travelItem);
    })
    
  },
  mounted() {
  },
  methods: {
    getCountryImage() {
      console.log(this.travelItem.countries)
      const code = this.travelItem.countries && this.travelItem.countries.length
        ? this.travelItem.countries[0]
        : 'default';

      return `/country/${code}.png`;
    },
    transform(code) {
      return this.countryMap[code]?.name || '';
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
    openMap(locationName) {
      // 1. 建構 Google 地圖搜尋 URL
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
      // 2. 在新的分頁或視窗中開啟 URL
      window.open(googleMapsUrl, '_blank');
    },
    async share () {
      // if (!liff.isInClient()) {
      //   alert('此分享功能僅限於 LINE 應用程式內使用！');
      //   return;
      // }
      console.log(this.travelItem.dateList[this.currentDay].locationList);
      console.log(this.travelItem.dateList[this.currentDay].date);
      console.log(this.dayFormat(this.dateFormat(this.travelItem.dateList[this.currentDay].date).getDay()));
      let content = [];
      this.travelItem.dateList[this.currentDay].locationList.forEach((item, index) => {
        let bodyContent = []
        if(item.notice === ''){
          bodyContent = [
            {
              type: "text",
              text: item.eventName,
              size: "lg",
              weight: "bold",
              margin: "sm"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `🕐 ${item.startTime} - ${item.endTime}`,
                  margin: "md",
                  color: "#676767",
                  size: "sm"
                }
              ],
              margin: "md"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `📍 ${item.location}`,
                  margin: "md",
                  color: "#676767",
                  size: "sm",
                  "action": {
                    "type": "uri",
                    "label": "action",
                    "uri": `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`
                  },
                  "decoration": "underline"
                }
              ],
              margin: "md"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `🚌 ${item.transport}`,
                  margin: "md",
                  color: "#676767",
                  size: "sm"
                }
              ],
              margin: "md"
            }
          ]
        } else {
          bodyContent = [
            {
              type: "text",
              text: item.eventName,
              size: "lg",
              weight: "bold",
              margin: "sm"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `🕐 ${item.startTime} - ${item.endTime}`,
                  margin: "md",
                  color: "#676767",
                  size: "sm"
                }
              ],
              margin: "md"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `📍 ${item.location}`,
                  margin: "md",
                  color: "#676767",
                  size: "sm",
                  "action": {
                    "type": "uri",
                    "label": "action",
                    "uri": `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`
                  },
                  "decoration": "underline"
                }
              ],
              margin: "md"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `🚌 ${item.transport}`,
                  margin: "md",
                  color: "#676767",
                  size: "sm"
                }
              ],
              margin: "md"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `🔔 ${item.notice}`,
                  size: "sm",
                  margin: "md",
                  color: "#D4A24C",
                  wrap: true
                }
              ],
              backgroundColor: "#faf0df",
              cornerRadius: "md",
              paddingAll: "md",
              margin: "lg"
            }
          ]
        }
        content.push({
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    { type: "filler" },
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [],
                      cornerRadius: "30px",
                      height: "14px",
                      width: "14px",
                      borderWidth: "medium",
                      borderColor: "#D4A24C"
                    },
                    { type: "filler" }
                  ],
                  flex: 0
                },
                {
                  type: "text",
                  text: item.startTime,
                  gravity: "center",
                  flex: 4,
                  size: "md",
                  color: "#D4A24C",
                  weight: "bold"
                }
              ],
              spacing: "sm",
              cornerRadius: "30px",
              margin: "none"
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "filler", flex: 1 },
                        {
                          type: "box",
                          layout: "vertical",
                          contents: [],
                          width: "2px",
                          backgroundColor: "#e7c282"
                        },
                        { type: "filler" }
                      ],
                      flex: 1
                    }
                  ],
                  width: "12px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: bodyContent,
                  margin: "sm",
                  spacing: "xs",
                  paddingAll: "sm"
                }
              ],
              spacing: "sm",
              paddingStart: "1px"
            }
          ]
        });
      });
      const flexMessage = {
        type: "flex",
        altText: `${localStorage.getItem('liffDisplayName')}分享了旅遊行程`,
        contents: {
          type: "bubble",
          size: "mega",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: this.travelItem.travelName,
                    color: "#ffffff",
                    size: "xl",
                    flex: 4,
                    weight: "bold",
                    align: "center"
                  }
                ]
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: `Day ${this.currentDay + 1}`,
                        color: "#ffffff",
                        weight: "bold",
                        size: "lg"
                      },
                      {
                        type: "text",
                        text: `${this.monthFormat(this.dateFormat(this.travelItem.dateList[this.currentDay].date).getMonth())} ${this.dateFormat(this.travelItem.dateList[this.currentDay].date).getDate()}, ${this.dayFormat(this.dateFormat(this.travelItem.dateList[this.currentDay].date).getDay())}`,
                        color: "#ffffff",
                        size: "sm"
                      }
                  ]
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "總行程",
                        size: "xs",
                        color: "#ffffff"
                      },
                      {
                        type: "text",
                        text: `${this.travelItem.dateList[this.currentDay].locationList.length}個地點`,
                        color: "#ffffff",
                        size: "sm"
                      }
                    ],
                    alignItems: "flex-end",
                    justifyContent: "center"
                  }
                ],
                backgroundColor: "#ffffff38",
                cornerRadius: "md",
                paddingAll: "lg"
              }
            ],
            paddingAll: "lg",
            backgroundColor: "#0367D3",
            spacing: "md",
            background: {
              type: "linearGradient",
              angle: "135deg",
              startColor: "#3d4b71",
              endColor: "#3d4b71"
            }
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: content
          }
        }
      };
      try {
        const result = await liff.shareTargetPicker([flexMessage]);

        if (result) {
          // 使用者有成功分享（result 會有值）
          alert('已成功分享！');
        } else {
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
    gotoEdit () {
      this.$router.replace({
        path: '/addtravelcard',
        query: { id: this.travelItemID, editMode: true }
      });
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
    toMinutes(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    }
  }
};
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
svg, canvas {
  // margin: 20px auto;
  display: block;
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
.header{
  background-position: bottom;
  background-size: 100% 100%;
  background-repeat: no-repeat;
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
  background: #4A587F;
}
.content{
  box-shadow: 1px -2px 10px 0px rgba(0, 0, 0, 0.21);
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
