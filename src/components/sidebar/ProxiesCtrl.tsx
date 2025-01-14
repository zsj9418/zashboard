import { updateProxyProviderAPI } from '@/api'
import { useProxies } from '@/composables/proxies'
import { PROXY_SORT_TYPE, PROXY_TAB_TYPE } from '@/config'
import { isMiddleScreen } from '@/helper/utils'
import { configs, updateConfigs } from '@/store/config'
import { fetchProxies, proxyProviederList } from '@/store/proxies'
import { hideUnavailableProxies, proxySortType } from '@/store/settings'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ProxiesCtrl',
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const { proxiesTabShow } = useProxies()
    const isUpgrading = ref(false)
    const handlerClickUpdateAllProviders = async () => {
      if (isUpgrading.value) return
      isUpgrading.value = true
      try {
        await Promise.all(
          proxyProviederList.value.map((provider) => updateProxyProviderAPI(provider.name)),
        )
        await fetchProxies()
        isUpgrading.value = false
      } catch {
        await fetchProxies()
        isUpgrading.value = false
      }
    }

    const modeList = computed(() => {
      return (
        configs.value?.['mode-list'] || configs.value?.['modes'] || ['direct', 'rule', 'global']
      )
    })

    const handlerModeChange = (e: Event) => {
      const mode = (e.target as HTMLSelectElement).value
      updateConfigs({ mode })
    }

    return () => {
      const tabs = (
        <div
          role="tablist"
          class="tabs-boxed tabs tabs-sm"
        >
          {Object.values(PROXY_TAB_TYPE).map((type) => {
            return (
              <a
                role="tab"
                key={type}
                class={['tab', proxiesTabShow.value === type && 'tab-active']}
                onClick={() => (proxiesTabShow.value = type)}
              >
                {t(type)}
              </a>
            )
          })}
        </div>
      )
      const upgradeAll = (
        <>
          {proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER && (
            <button
              class={twMerge('btn btn-sm', isUpgrading.value ? 'animate-pulse' : '')}
              onClick={handlerClickUpdateAllProviders}
            >
              {t('updateAllProviders')}
            </button>
          )}
        </>
      )
      const modeSelect = (
        <select
          class={[
            'select select-bordered select-sm min-w-24',
            props.horizontal && 'inline-block max-md:flex-1',
          ]}
          v-model={configs.value.mode}
          onChange={handlerModeChange}
        >
          {modeList.value.map((mode) => {
            return (
              <option
                key={mode}
                value={mode}
              >
                {t(mode.toLowerCase()) || mode}
              </option>
            )
          })}
        </select>
      )
      const sortAndFilter = (
        <>
          <select
            class={[
              'select select-bordered select-sm',
              props.horizontal && !isMiddleScreen.value ? 'inline-block' : 'w-0 flex-1',
            ]}
            v-model={proxySortType.value}
          >
            {Object.values(PROXY_SORT_TYPE).map((type) => {
              return (
                <option
                  key={type}
                  value={type}
                >
                  {t(type)}
                </option>
              )
            })}
          </select>
          <button
            class="btn btn-sm"
            onClick={() => (hideUnavailableProxies.value = !hideUnavailableProxies.value)}
          >
            <span class="shrink-0">{t('unavailableProxy')}</span>
            {hideUnavailableProxies.value ? (
              <EyeSlashIcon class="h-4 w-4" />
            ) : (
              <EyeIcon class="h-4 w-4" />
            )}
          </button>
        </>
      )

      if (props.horizontal) {
        if (isMiddleScreen.value) {
          return (
            <div class="flex flex-col gap-2 p-2">
              <div class="flex gap-2">
                {tabs}
                {upgradeAll}
              </div>
              <div class="flex w-full gap-2">
                {modeSelect}
                {sortAndFilter}
              </div>
            </div>
          )
        }
        return (
          <div class="pr-auto flex max-w-screen-md gap-2 p-2">
            {tabs}
            {upgradeAll}
            {modeSelect}
            {sortAndFilter}
          </div>
        )
      }

      return (
        <div class="flex flex-col gap-2 p-2">
          {upgradeAll}
          {tabs}
          {<div class="flex flex-col">{modeSelect}</div>}
          {<div class="flex gap-2">{sortAndFilter}</div>}
        </div>
      )
    }
  },
})
