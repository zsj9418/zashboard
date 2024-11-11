import './assets/main.css'
import 'dayjs/locale/zh-cn'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { i18n } from './i18n'
const app = createApp(App)

dayjs.extend(relativeTime)
app.use(router)
app.use(i18n)
app.mount('#app')
