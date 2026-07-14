import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import liff from '@line/liff'

const app = createApp(App)
// const liffId = '2007434426-kEld5nXv'
// async function initLIFF() {
//   try {
//     await liff.init({ liffId })

//     // 如果還沒登入，就登入
//     if (!liff.isLoggedIn()) {
//       liff.login({ redirectUri: window.location.href })
//     } else {
//       const profile = await liff.getProfile()
//       localStorage.setItem('liffUserId', profile.userId)
//       localStorage.setItem('liffDisplayName', profile.displayName)
//       localStorage.setItem('liffPictureUrl', profile.pictureUrl)
//       alert(`歡迎回來，${profile.displayName}！`)
//       console.log('使用者資料:', profile)
//     }
//   } catch (err) {
//     console.error('LIFF 初始化失敗:', err)
//   }
// }

// initLIFF()
app.use(router)

app.mount('#app')
