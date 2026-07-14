<template>
  <div class="overflow-hidden">
    <div class="h-[160px] bg-linear flex-col flex justify-start items-center  text-white p-6 fixed top-0 left-0 w-full z-10">
      <p class="absolute top-[20px] left-[15px] text-3xl z-20" @click="goBack">⭠</p>
      <p class="text-xl font-bold tracking-wider mb-2">{{ editMode? '修改' : '添加' }}旅程</p>
      <p class="text-sm tracking-wider">✨來創造一個新的旅程回憶吧!</p>
      <img src="../assets/img/header_bg.png" class="w-full absolute bottom-0 left-0" alt="">
    </div>
    <div class="addTravelCard bg-[#ffffff] rounded-t-3xl mt-[140px] relative flex justify-center items-start z-20">
      <div class="addCard w-full flex flex-col justify-between p-5 overflow-y-auto" v-if="setName"  style="height: calc(100dvh - 140px);">
          <div>
            <div class="flex items-center justify-start mb-2">
              <img src="../assets/img/plane.png" width="28" alt="">
              <p class="text-lg font-bold ml-3">旅行名稱</p>
            </div>
            <input type="text" v-model="travelName" maxlength="15" class="mb-5 bg-white text-lg w-full border-2 border-[#767676] rounded-lg p-3" placeholder="請輸入旅行名稱">

            <div class="flex items-center justify-start mb-2">
                <img src="../assets/img/country.png" width="28">
                <p class="text-lg font-bold ml-3">旅行國家</p>
            </div>
            <div
                class="mb-5 border-2 border-[#767676] rounded-xl p-3 bg-white cursor-pointer"
                @click="showCountryPicker=true"
            >

                <div
                    v-if="selectedCountries.length===0"
                    class="text-[#888]"
                >
                    點擊選擇旅行國家
                </div>

                <div
                    class="flex flex-wrap gap-2"
                    v-else
                >

                    <div
                        v-for="country in selectedCountries"
                        :key="country.code"
                        class="bg-[#3d4b71] text-white rounded-full px-3 py-1 flex items-center"
                    >

                        {{country.flag}} {{country.name}}

                        <span
                            class="ml-2 cursor-pointer"
                            @click.stop="removeCountry(country.code)"
                        >
                            ×
                        </span>

                    </div>

                </div>

            </div>
          <div class="grid grid-cols-2 gap-4 items-center justify-between mb-8">
            <div>
              <div class="flex items-center justify-start mb-2">
                <img src="../assets/img/calendar.png" width="28" alt="">
                <p class="text-lg font-bold ml-3">開始日期</p>
              </div>
              <input type="date" v-model="startDate" class="bg-white text-lg w-full border-2 border-[#767676] rounded-lg p-3" name="" id="">
            </div>
            <div>
              <div class="flex items-center justify-start mb-2">
                <img src="../assets/img/calendar.png" width="28" alt="">
                <p class="text-lg font-bold ml-3">結束日期</p>
              </div>
              <input type="date" v-model="endDate" class="bg-white text-lg w-full border-2 border-[#767676] rounded-lg p-3" name="" id="">
            </div>
          </div>
          <div class="text-[#414141] bg-[#f9b94d17] rounded-xl p-5">
            <p class="mb-1">💡小提醒</p>
            <p class="text-sm">建議提前 2-3 個月開始規劃，這樣能獲得更好的機票和住宿價格！</p>
          </div>
          </div>
          <div class="bg-linear text-white text-center text-lg font-bold rounded-xl p-3 w-full my-5" @click="nextStep()">開始規劃行程</div>

      </div>
      <div class="w-full" v-if="!setName && dateList.length > 0"  style="height: calc(100dvh - 140px);">
        <div class="header pt-5 shadow-lg">
          <div class="flex justify-between items-center px-3 mb-3">
            <div class="flex justify-start items-center">
              <p class="font-bold text-lg text-[#767676] mr-2">{{ travelName }}</p><img src="../assets/img/edit(1).png" width="20" height="20" alt="" @click="modifyNameModel = true">
              
            </div>
            <button :disabled="isLoading" class="px-4 py-2 rounded-full bg-white/85 text-[#3d4b71] font-bold shadow-sm backdrop-blur text-nowrap" @click="finish()">
              保存
            </button>
          </div>
          <div class="flex overflow-x-auto pb-3">
            <div :class="{'ml-3': index === 0}" class="mr-2" v-for="(item, index) in dateList" :key="index" @click="currentDay = index; scrollToTop()">
              <p class="text-nowrap font-bold text-center text-sm mb-1">Day {{ index + 1 }}</p>
              <div class="flex justify-center items-center flex-col h-[92px] w-[68px] rounded-2xl font-bold" :class="{'text-white': currentDay === index,'text-[#3f3f3f]': currentDay !== index , 'bg-linear': currentDay === index,'bg-[#d8d8d8]': currentDay !== index}" >
                <p class="">{{ monthFormat(dateFormat(item.date).getMonth()) }} </p>
                <p class="text-2xl text-nowrap">{{ dateFormat(item.date).getDate() }}</p>
                <p class="">{{ dayFormat(dateFormat(item.date).getDay()) }}</p>
              </div>
            </div >
          </div>
        </div>
        <div class="content px-10 pt-6 pb-10 overflow-y-auto" style="height: calc(100dvh - 340px);">
          <div v-for="(item, index) in dateList[currentDay].locationList || []" class="mb-2" :key="item.eventId">
            <div class="flex text-[#767676]">
              <div class="flex flex-col justify-center items-center relative">
                <p class="startTime text-xl">{{ item.startTime }}</p>
                <!-- <div class="bg-[#73737399] p-2 rounded-xl mb-3" @click="edit(item)">
                  <svg  xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round">

                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>

                  </svg>
                </div>
                
              <div class="bg-[#d87f7f] p-2 rounded-xl " @click="deleteItem(item)">
                <svg  xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">

                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6"/>
                  <path d="M14 11v6"/>
                  <path d="M9 6V4h6v2"/>

                </svg>
              </div> -->
                
              </div>
              <div class="w-full py-2 locationList ml-10">
                <div class="flex items-center justify-between mb-3 ">
                  <p class="text-xl font-bold  text-[#3b3b3b]"><span>{{ item.eventType == 'view' ? '🗺️' : item.eventType == 'food' ? '🍽️' : item.eventType == 'accommodation' ? '🏨' : item.eventType == 'transportation' ? '🚗' : '🆕' }}</span>{{ item.eventName}}</p>
                  <div class="flex items-center justify-center bg-[#ffffffe0] rounded-full p-1" @click.stop="moreOption(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3d4b71">
                    <circle cx="5" cy="12" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="19" cy="12" r="2"/>
                  </svg>
                  </div>
                </div>
                <div class="text-lg flex items-center">
                  🕐
                  <p class="ml-2">{{ item.startTime }} - {{ item.endTime }}</p>
                </div>
                <div class="text-lg flex items-center">
                  📍
                  <p class="ml-2">{{ item.location }}</p>
                </div>
                <p class="text-lg">🚆 {{ item.transport }}</p>
                <p class="text-lg"  v-if="item.cost > 0 " >💰 ${{ item.cost }}</p>
                <p class="text-lg" v-if="item.notice">📝 {{ item.notice }}</p>
              </div>
            </div>
          </div>
          <button class="w-full rounded-xl bg-[#D4A24C] text-white font-bold py-3 shadow-sm"  @click="openAddEvent">
            ＋ 新增今日行程
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="model-frame" ref="model" v-if="showAddEventModel">
    <div class="model" >
      <div class="bg-[#4A587F] rounded-t-3xl p-3">
        <p class="text-xl text-white tracking-widest text-center">第{{ currentDay + 1 }}天</p>
      </div>
      <div class="px-3 py-3 overflow-y-auto h-fit" style="max-height: calc(100dvh - 52px); overscroll-behavior: contain;">
        <div class="flex flex-col mb-2">
          <p class="text-l font-bold mb-1">🎯行程名稱</p>
          <input type="text" v-model="eventName" class="text-lg w-full h-10 border-b-2 p-2" placeholder="請輸入行程名稱">
        </div>
        <div class="flex flex-col mb-2">
          <p class="text-l font-bold  mb-1">🚩行程類別</p>
          <select name="" id="" class=" w-full h-10 border-2 p-2 rounded-lg" v-model="eventType">
            <option value="">請選擇</option>
            <option value="view">景點</option>
            <option value="food">美食</option>
            <option value="accommodation">住宿</option>
            <option value="transportation">交通</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div class="flex">
          <div class="flex flex-col mb-2 w-1/2 mr-2">
            <p class="text-l font-bold mb-1">🕐開始時間</p>
            <input type="time" v-model="startTime" class="text-lg border-2 rounded-lg" name="" id="">
          </div>
          <div class="flex flex-col mb-2 w-1/2">
            <p class="text-l font-bold mb-1">🕐結束時間</p>
            <input type="time" v-model="endTime" class="text-lg border-2 rounded-lg" >
          </div>
        </div>
        <div class="flex mb-2 ">
          <div class="flex flex-col w-1/2 mr-2">
            <p class="text-l font-bold mb-1">🚗交通方式</p>
            <input type="text" v-model="transport" class="text-lg w-full h-10 border-b-2 p-2" placeholder="請輸入交通方式">
          </div>
          <div class="flex flex-col w-1/2">
            <p class="text-l font-bold mb-1">💰 花費(單位: 新台幣)</p>
            <input type="number" v-model="cost" class="text-lg w-full h-10 border-b-2 p-2" placeholder="請輸入總花費">
          </div>
        </div>
        <div class="flex flex-col mb-2">
          <p class="text-l font-bold mb-1">📍地點</p>
          <input type="text" v-model="location" class="text-lg w-full h-10 border-b-2 p-2" placeholder="請輸入地點">
        </div>
        <div class="flex flex-col mb-2">
          <p class="text-l font-bold  mb-1">📝備註</p>
          <textarea name="" placeholder="備註..."  rows="3" v-model="notice" class="text-lg w-full border-2 rounded-lg p-2" id=""></textarea>
        </div>
        <div class="text-lg flex justify-between items-center tracking-widest my-5">
          <p class="rounded-lg bg-[#818181] text-white px-3 py-1 w-1/2 text-center mr-3" @click="itemEditMode = false, showAddEventModel = false">關閉</p>
          <p class="bg-linear text-white rounded-lg px-3 py-1 w-1/2 text-center" @click="addLocation()">{{ itemEditMode ? '💾修改':'✨添加' }}</p>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showCountryPicker"
    class="fixed inset-0 bg-black/40 z-[999] flex items-end"
    @click="showCountryPicker = false"
  >
    <div
      class="bg-white rounded-t-3xl w-full h-[85dvh] flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="p-5 flex-shrink-0">

        <div class="w-12 h-1.5 rounded-full bg-gray-300 mx-auto mb-5"></div>

        <div class="font-bold text-xl">
          選擇旅行國家
        </div>

      </div>

      <!-- 洲別 -->
      <div class="px-5 pb-4 flex-shrink-0">

        <div class="flex gap-2 overflow-x-auto scrollbar-hide">

          <div
            v-for="item in continentList"
            :key="item.key"
            @click="currentContinent = item.key"
            class="flex-shrink-0 px-4 py-2 rounded-full whitespace-nowrap cursor-pointer transition"
            :class="currentContinent === item.key
              ? 'bg-[#3d4b71] text-white'
              : 'bg-[#f4f4f4]'"
          >
            {{ item.icon }} {{ item.name }}
          </div>

        </div>

      </div>

      <!-- 國家列表 -->
      <div class="flex-1 overflow-y-auto px-5">

        <div
          v-for="country in currentCountries"
          :key="country.code"
          @click="toggleCountry(country)"
          class="flex justify-between items-center py-4 border-b border-gray-200"
        >
          <div>
            {{ country.flag }} {{ country.name }}
          </div>

          <div
            v-if="isSelected(country.code)"
            class="text-[#3d4b71] text-xl font-bold"
          >
            ✓
          </div>

        </div>

      </div>

      <!-- Footer -->
      <div class="p-5 flex-shrink-0">

        <div
          class="bg-linear rounded-xl text-white text-center py-3 font-bold"
          @click="showCountryPicker = false"
        >
          完成（{{ selectedCountries.length }}）
        </div>

      </div>

    </div>
  </div>
  <div class="z-[99] model-frame" ref="model" v-if="noticeMsg !== ''">
    <div class="notice-model px-3 py-8 text-xl" >
      <p class="mb-5 font-bold text-center">{{ noticeMsg }}</p>
      <div class="flex justify-center items-center" v-if="!deleteMode">
        <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#4d5052] text-white px-3 py-1 w-fit" @click="isFinish ? nextPage() : noticeMsg = ''">關閉</p>
      </div>
      <div class="flex" v-if="deleteMode">
        <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#4d5052] text-white px-3 py-1 w-fit mr-3" @click="noticeMsg = ''; deleteMode = false">取消</p>
        <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#093857] text-white px-3 py-1 w-fit"  @click="confirmDel()">確定</p>
      </div>
    </div>
  </div>
  <div class="z-[99] model-frame" ref="model" v-if="modifyNameModel">
    <div class="notice-model text-xl" >
      <div class="bg-[#4c5880] rounded-t-2xl p-3">
        <p class="text-xl text-white text-center">請輸入旅行名稱</p>
      </div>
      <div class="px-3 py-8">
        <input type="text" v-model="newtravelName" class="outline-none text-lg w-full h-10 border-b-2 border-[#afafaf] text-[#afafaf] p-2 mb-5" placeholder="請輸入旅行名稱">
        <div class="flex">
          <p class="tracking-widest mx-auto border-2 rounded-lg bg-[#afafaf] text-white px-3 py-1 w-1/2 text-center mr-3" @click="newtravelName= ''; modifyNameModel = false">關閉</p>
          <p class="bg-[#d77766] tracking-widest mx-auto border-2 rounded-lg bg-[#093857] text-white px-3 py-1 w-1/2 text-center" @click="travelName = newtravelName;modifyNameModel = false">修改</p>
        </div>
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
        <div class="flex items-center justify-start w-full"  @click="deleteItem()">
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
      </div>
    </div>
  </Transition>
  <Loading v-if="isLoading" />
</template>

<script>
import { ref, onMounted } from 'vue';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import Loading from '@/components/Loading.vue';
import {
  getSharedTravelList,
  addSharedTravelItem,
  updateSharedTravelItem,
  sendMessage,
  getOtherTravelList,
  listenToTravelItem
} from '../firestoreService';
const jsonInput = ref('');
const saving = ref(false);
const message = ref('');
const userId = ref(null);
export default {
  data() {
    return {
      modifyNameModel: false,
      newtravelName: '',
      currentDay: 0,
      travelName: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      step: 0,
      day: 1,
      time: '',
      location: '',
      transport: '',
      cost: '',
      eventType: '',
      notice: '',
      noticeMsg: '',
      setName: true,
      isLoading: false,
      dateList: [],
      showAddEventModel: false,
      editMode: false,
      itemEditMode: false,
      editIndex: 0,
      deleteMode: false,
      deleteEventId: 0,
      traveleList: {},
      isFinish: false,
      userID: '',
      travelListId: null,
      userName: '',
      unsubscribeTravel: null,
      showCountryPicker: false,
      activeID: null,
      continentList: [
        { key: 'Asia', name: '亞洲', icon: '🌏' },
        { key: 'Europe', name: '歐洲', icon: '🏰' },
        { key: 'NorthAmerica', name: '北美洲', icon: '🌎' },
        { key: 'SouthAmerica', name: '南美洲', icon: '🌴' },
        { key: 'Oceania', name: '大洋洲', icon: '🐨' },
        { key: 'Africa', name: '非洲', icon: '🦁' },
      ],
      currentContinent: 'Asia',
      selectedCountries: [],
      isMoreOption: false,
      countryOptions: [
        // ===== 亞洲 =====
        { code: 'JP', name: '日本', continent: 'Asia', flag: '🇯🇵' },
        { code: 'KR', name: '韓國', continent: 'Asia', flag: '🇰🇷' },
        { code: 'TW', name: '台灣', continent: 'Asia', flag: '🇹🇼' },
        { code: 'CN', name: '中國', continent: 'Asia', flag: '🇨🇳' },
        { code: 'HK', name: '香港', continent: 'Asia', flag: '🇭🇰' },
        { code: 'MO', name: '澳門', continent: 'Asia', flag: '🇲🇴' },
        { code: 'MN', name: '蒙古', continent: 'Asia', flag: '🇲🇳' },
        { code: 'VN', name: '越南', continent: 'Asia', flag: '🇻🇳' },
        { code: 'TH', name: '泰國', continent: 'Asia', flag: '🇹🇭' },
        { code: 'SG', name: '新加坡', continent: 'Asia', flag: '🇸🇬' },
        { code: 'MY', name: '馬來西亞', continent: 'Asia', flag: '🇲🇾' },
        { code: 'ID', name: '印尼', continent: 'Asia', flag: '🇮🇩' },
        { code: 'PH', name: '菲律賓', continent: 'Asia', flag: '🇵🇭' },
        { code: 'BN', name: '汶萊', continent: 'Asia', flag: '🇧🇳' },
        { code: 'NP', name: '尼泊爾', continent: 'Asia', flag: '🇳🇵' },
        { code: 'BT', name: '不丹', continent: 'Asia', flag: '🇧🇹' },
        { code: 'LK', name: '斯里蘭卡', continent: 'Asia', flag: '🇱🇰' },
        { code: 'MV', name: '馬爾地夫', continent: 'Asia', flag: '🇲🇻' },
        { code: 'AE', name: '阿聯', continent: 'Asia', flag: '🇦🇪' },
        { code: 'SA', name: '沙烏地阿拉伯', continent: 'Asia', flag: '🇸🇦' },
        { code: 'QA', name: '卡達', continent: 'Asia', flag: '🇶🇦' },
        { code: 'TR', name: '土耳其', continent: 'Asia', flag: '🇹🇷' },
        { code: 'IL', name: '以色列', continent: 'Asia', flag: '🇮🇱' },
        { code: 'JO', name: '約旦', continent: 'Asia', flag: '🇯🇴' },

        // ===== 歐洲 =====
        { code: 'FI', name: '芬蘭', continent: 'Europe', flag: '🇫🇮' },
        { code: 'SE', name: '瑞典', continent: 'Europe', flag: '🇸🇪' },
        { code: 'NO', name: '挪威', continent: 'Europe', flag: '🇳🇴' },
        { code: 'DK', name: '丹麥', continent: 'Europe', flag: '🇩🇰' },
        { code: 'IS', name: '冰島', continent: 'Europe', flag: '🇮🇸' },
        { code: 'FR', name: '法國', continent: 'Europe', flag: '🇫🇷' },
        { code: 'IT', name: '義大利', continent: 'Europe', flag: '🇮🇹' },
        { code: 'DE', name: '德國', continent: 'Europe', flag: '🇩🇪' },
        { code: 'CH', name: '瑞士', continent: 'Europe', flag: '🇨🇭' },
        { code: 'AT', name: '奧地利', continent: 'Europe', flag: '🇦🇹' },
        { code: 'CZ', name: '捷克', continent: 'Europe', flag: '🇨🇿' },
        { code: 'SK', name: '斯洛伐克', continent: 'Europe', flag: '🇸🇰' },
        { code: 'HU', name: '匈牙利', continent: 'Europe', flag: '🇭🇺' },
        { code: 'PL', name: '波蘭', continent: 'Europe', flag: '🇵🇱' },
        { code: 'NL', name: '荷蘭', continent: 'Europe', flag: '🇳🇱' },
        { code: 'BE', name: '比利時', continent: 'Europe', flag: '🇧🇪' },
        { code: 'LU', name: '盧森堡', continent: 'Europe', flag: '🇱🇺' },
        { code: 'ES', name: '西班牙', continent: 'Europe', flag: '🇪🇸' },
        { code: 'PT', name: '葡萄牙', continent: 'Europe', flag: '🇵🇹' },
        { code: 'GB', name: '英國', continent: 'Europe', flag: '🇬🇧' },
        { code: 'IE', name: '愛爾蘭', continent: 'Europe', flag: '🇮🇪' },
        { code: 'GR', name: '希臘', continent: 'Europe', flag: '🇬🇷' },
        { code: 'HR', name: '克羅埃西亞', continent: 'Europe', flag: '🇭🇷' },
        { code: 'SI', name: '斯洛維尼亞', continent: 'Europe', flag: '🇸🇮' },

        // ===== 北美 =====
        { code: 'US', name: '美國', continent: 'NorthAmerica', flag: '🇺🇸' },
        { code: 'CA', name: '加拿大', continent: 'NorthAmerica', flag: '🇨🇦' },
        { code: 'MX', name: '墨西哥', continent: 'NorthAmerica', flag: '🇲🇽' },
        { code: 'CR', name: '哥斯大黎加', continent: 'NorthAmerica', flag: '🇨🇷' },
        { code: 'CU', name: '古巴', continent: 'NorthAmerica', flag: '🇨🇺' },

        // ===== 南美 =====
        { code: 'BR', name: '巴西', continent: 'SouthAmerica', flag: '🇧🇷' },
        { code: 'AR', name: '阿根廷', continent: 'SouthAmerica', flag: '🇦🇷' },
        { code: 'CL', name: '智利', continent: 'SouthAmerica', flag: '🇨🇱' },
        { code: 'PE', name: '秘魯', continent: 'SouthAmerica', flag: '🇵🇪' },
        { code: 'BO', name: '玻利維亞', continent: 'SouthAmerica', flag: '🇧🇴' },
        { code: 'CO', name: '哥倫比亞', continent: 'SouthAmerica', flag: '🇨🇴' },

        // ===== 大洋洲 =====
        { code: 'AU', name: '澳洲', continent: 'Oceania', flag: '🇦🇺' },
        { code: 'NZ', name: '紐西蘭', continent: 'Oceania', flag: '🇳🇿' },
        { code: 'FJ', name: '斐濟', continent: 'Oceania', flag: '🇫🇯' },
        { code: 'PG', name: '巴布亞紐幾內亞', continent: 'Oceania', flag: '🇵🇬' },

        // ===== 非洲 =====
        { code: 'EG', name: '埃及', continent: 'Africa', flag: '🇪🇬' },
        { code: 'ZA', name: '南非', continent: 'Africa', flag: '🇿🇦' },
        { code: 'MA', name: '摩洛哥', continent: 'Africa', flag: '🇲🇦' },
        { code: 'KE', name: '肯亞', continent: 'Africa', flag: '🇰🇪' },
        { code: 'TZ', name: '坦尚尼亞', continent: 'Africa', flag: '🇹🇿' },
      ],
    };
  },
  components: {
    Loading
  },
  computed:{
    currentCountries(){

      return this.countryOptions.filter(
        i => i.continent===this.currentContinent
      )

    }
  },
  mounted() {
  },
  beforeUnmount() {
    if (this.unsubscribeTravel) {
      this.unsubscribeTravel();
    }
  },
  watch: {
    showAddEventModel(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        document.body.style.overscrollBehavior = 'none';
      } else {
        document.body.style.overflow = '';
        document.body.style.overscrollBehavior = '';
      }
    }
  },
  created() {
    this.userID = localStorage.getItem('liffUserId') || '';
    this.userName = localStorage.getItem('liffDisplayName') || '使用者名稱'
    this.editMode = Boolean(this.$route.query.editMode);
    this.travelListId = this.$route.query.id;
    console.log('this.$route.query.editMode', this.editMode);
    this.setName = this.editMode ? false : true;
    if (this.editMode && this.travelListId) {
      this.listenTravel();
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log('this.$route.query.editMode', this.$route.query.editMode);
    next();
  },
  methods: {
    openAddEvent() {
  this.eventName = '';
  this.eventType = '';
  this.startTime = '';
  this.endTime = '';
  this.location = '';
  this.transport = '';
  this.cost = '';
  this.notice = '';
  this.activeID = null;
  this.itemEditMode = false;
  this.showAddEventModel = true;
},
    listenTravel() {
      this.isLoading = true;

      this.unsubscribeTravel = listenToTravelItem(this.travelListId, (travel) => {
        this.isLoading = false;

        if (!travel) {
          this.noticeMsg = '讀取旅程失敗';
          return;
        }

        this.traveleList = travel;
        this.travelName = travel.travelName;
        this.startDate = travel.startDate;
        this.endDate = travel.endDate;
        this.dateList = travel.dateList || [];
      });
    },
    async loadTravel() {
      this.isLoading = true;

      const travel = await getOtherTravelList(this.travelListId);

      this.isLoading = false;

      if (!travel) {
        this.noticeMsg = '讀取旅程失敗';
        return;
      }

      this.traveleList = travel;
      this.travelName = travel.travelName;
      this.startDate = travel.startDate;
      this.endDate = travel.endDate;
      this.dateList = travel.dateList || [];
    },
    scrollToTop () {
      // 1. 獲取容器元素
      const container = document.querySelector('.content');
      // 2. 滾動到頂部
      console.log(container);
      container.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滾動
      });
    },
    goBack() {
      if(!this.setName && !this.editMode){
        this.setName = true;
      } else {
        this.$router.back();
      }
    },
    async saveEditedItem(id) {
      const success = await updateSharedTravelItem(
        id,
        this.traveleList
      );
      if (success) {
        this.isFinish = true;
        this.noticeMsg = '旅程修改成功!';
        sendMessage(this.travelListId, 'system', '系統通知', `${this.userName}修改了旅程`);
      } else {
        this.isFinish = false;
        this.noticeMsg = '旅程修改失敗!';
      }
    },
    dateFormat(dateStr) {
      if (dateStr instanceof Date) {
        return dateStr;
      }
      if (typeof dateStr === 'string') {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      if (dateStr?.seconds) {
        const jsDate = new Date(dateStr.seconds * 1000);
        return jsDate;
      }
      return null;
    },
    async saveData() {
      this.isLoading = true;

      try {
        const success = await addSharedTravelItem(
          this.userID,
          this.traveleList
        );

        if (success) {
          this.isFinish = true;
          this.noticeMsg = '旅程新增成功!';
        } else {
          this.isFinish = false;
          this.noticeMsg = '旅程新增失敗!';
        }
      } catch (error) {
        console.error('新增旅程失敗：', error);
        this.isFinish = false;
        this.noticeMsg = '旅程新增失敗!';
      } finally {
        this.isLoading = false;
      }
    },
    async nextPage() {
      this.isFinish = false;
      this.noticeMsg = '';
      const travelList = await getSharedTravelList(this.userID);
      localStorage.setItem('travelList', JSON.stringify(travelList));
      this.$router.replace('/');
    },
    edit() {
      console.log(this.activeID)
      this.isMoreOption = false
      const locationList = this.dateList[this.currentDay].locationList;

      const targetIndex = locationList.findIndex(e => e.eventId === this.activeID);

      if (targetIndex !== -1) {
        const targetEvent = locationList[targetIndex];

        this.editIndex = targetIndex;
        this.eventName = targetEvent.eventName;
        this.eventType = targetEvent.eventType || '';
        this.startTime = targetEvent.startTime;
        this.endTime = targetEvent.endTime;
        this.location = targetEvent.location;
        this.transport = targetEvent.transport || '';
        this.cost = targetEvent.cost || '';
        this.notice = targetEvent.notice || '';

        this.itemEditMode = true;
        this.showAddEventModel = true;
      }
    },
    deleteItem() {
      this.deleteMode = true;
      this.noticeMsg = '確定要刪除這個行程嗎？';
      this.isMoreOption = false
    },
    confirmDel() {
      const locationList = this.dateList[this.currentDay].locationList;
      const targetIndex = locationList.findIndex(e => e.eventId === this.activeID);
      if (targetIndex !== -1) {
        locationList.splice(targetIndex, 1);
        locationList.sort((a, b) => this.toMinutes(a.startTime) - this.toMinutes(b.startTime));
        console.log(this.dateList);
      } else {
        console.warn('找不到對應的行程 eventId:', this.activeID);
      }
      this.deleteMode = false;
      this.activeID = null;
      this.noticeMsg = '';
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
    addLocation() {
      if (this.eventType === '') {
        this.noticeMsg = '請選擇行程類別';
        return;
      }

      if (this.eventName === '') {
        this.noticeMsg = '請填寫行程名稱';
        return;
      }

      if (this.location === '') {
        this.noticeMsg = '請填寫地點';
        return;
      }

      if (this.startTime === '') {
        this.noticeMsg = '請選擇開始時間';
        return;
      }

      if (this.endTime === '') {
        this.noticeMsg = '請選擇結束時間';
        return;
      }

      if (this.toMinutes(this.startTime) >= this.toMinutes(this.endTime)) {
        this.noticeMsg = '結束時間必須晚於開始時間';
        return;
      }
      if (this.itemEditMode) {
        const originalItem =
        this.dateList[this.currentDay].locationList[this.editIndex];

        this.dateList[this.currentDay].locationList[this.editIndex] = {
          ...originalItem,
          day: this.currentDay + 1,
          eventName: this.eventName.trim(),
          startTime: this.startTime,
          endTime: this.endTime,
          location: this.location.trim(),
          transport: this.transport.trim(),
          notice: this.notice.trim(),
          eventType: this.eventType,
          cost: this.cost
        };
      } else {
        this.dateList[this.currentDay].locationList.push({
          eventId: this.generateEventId(),
          day: this.day,
          eventName: this.eventName,
          startTime: this.startTime,
          endTime: this.endTime,
          location: this.location,
          transport: this.transport,
          notice: this.notice,
          eventType: this.eventType,
          cost: this.cost
        })
      }
      this.eventName = '';
      this.startTime = '';
      this.endTime = '';
      this.location = '';
      this.transport = '';
      this.notice = '';
      this.eventType = '';
      this.cost = '';
      this.activeID = null;
      // console.log(this.locationList);
      this.dateList[this.currentDay].locationList = this.dateList[this.currentDay].locationList.sort((a, b) => {
        return this.toMinutes(a.startTime) - this.toMinutes(b.startTime);
      });
      console.log(this.dateList);
      this.showAddEventModel = false;
    },
    generateEventId() {
      return 'evt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
    },
    toMinutes(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    },
    toggleCountry(country){
      const index=this.selectedCountries.findIndex(
        i=>i.code===country.code
      )
      if(index>-1){
        this.selectedCountries.splice(index,1)
      }else{
        this.selectedCountries.push(country)
      }
    },
    isSelected(code){
      return this.selectedCountries.some(
        i=>i.code===code
      )
    },
    removeCountry(code){
      this.selectedCountries=this.selectedCountries.filter(
        i=>i.code!==code
      )
    },
    nextStep() {
      if (
        this.travelName.trim() === '' ||
        this.startDate === '' ||
        this.endDate === '' ||
        this.selectedCountries.length === 0
      ) {
        this.noticeMsg = '請填寫完整資訊';
        return;
      }
      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.noticeMsg = '結束日期不得早於開始日期';
        return;
      }
      this.traveleList = {
        travelName: this.travelName.trim(),
        countries: this.selectedCountries.map(item => item.code),
        startDate: this.startDate,
        endDate: this.endDate,
      };
      this.setDateList();
      this.setName = false;
    },
    finish () {
      if (this.isLoading) return;
      this.traveleList.travelName = this.travelName;
      this.traveleList.dateList = this.dateList;
      if(this.editMode) {
        this.saveEditedItem(this.travelListId);
      } else {
        this.saveData();
      }
      console.log('this.traveleList', this.traveleList);
    },
    setDateList() {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      const dateList = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        dateList.push({
          date: new Date(d),
          locationList: [],
        });
      }
      this.dateList = dateList;
      console.log('dateList', this.dateList);
    },
    moreOption (item) {
      console.log('758',item)
      this.activeID = this.activeID === item.eventId ? null : item.eventId;
      console.log('this.activeID',this.activeID)
      this.isMoreOption = true
    },
  }
};
</script>

<style lang="scss" scoped>
svg, canvas {
  // margin: 20px auto;
  display: block;
}
.notice{
  background: linear-gradient(148deg, #ffffff, #fff0ce);
}
.addTravelCard{
  box-shadow: 1px -2px 10px 0px rgb(0 0 0 / 21%);
}
.bg-linear{
  background: #4A587F;
}
.bg-linear-blue{
  background: #89b3cf;
}
.locationList{
  border-top: 2px dashed #767676;
}
.startTime{
    position: absolute;
    top: -13px;
    left: -20px;
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
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  height: 56px;
  padding: 12px;
}
.model-frame {
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100dvh;
  min-height: 100svh;
  position: fixed;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  .model{
    width: 100%;
    height: fit-content;
    background: #ffffff;
    border-radius: 28px 28px 0 0;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 0;
    color: #676767;
    input, textarea, select{
      border-color: #79797998;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
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
