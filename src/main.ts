import '@fontsource/fira-sans'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'subsetted-fonts/MiSans-VF/MiSans-VF.css'
import 'subsetted-fonts/PingFangSC-Regular/PingFangSC-Regular.css'
import 'subsetted-fonts/SarasaUiSC-Regular/SarasaUiSC-Regular.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/dist/tippy.css'
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
