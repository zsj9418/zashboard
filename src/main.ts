import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'misans/lib/Normal/MiSans-Bold.min.css'
import 'misans/lib/Normal/MiSans-Medium.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { i18n } from './i18n'
import router from './router'
const app = createApp(App)

dayjs.extend(relativeTime)
app.use(router)
app.use(i18n)
app.mount('#app')
