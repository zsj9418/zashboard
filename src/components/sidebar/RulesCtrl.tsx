import { updateRuleProviderAPI } from '@/api'
import { useNotification } from '@/composables/notification'
import { rulesTabShow } from '@/composables/rules'
import { RULE_TAB_TYPE } from '@/constant'
import { isMiddleScreen } from '@/helper/utils'
import { fetchRules, ruleProviderList, rules, rulesFilter } from '@/store/rules'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TextInput from '../common/TextInput.vue'

export default defineComponent({
  name: 'RulesCtrl',
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const isUpgrading = ref(false)
    const hasProviders = computed(() => {
      return ruleProviderList.value.length > 0
    })
    const { showNotification } = useNotification()
    const handlerClickUpgradeAllProviders = async () => {
      if (isUpgrading.value) return
      isUpgrading.value = true
      try {
        let updateCount = 0

        await Promise.all(
          ruleProviderList.value.map((provider) =>
            updateRuleProviderAPI(provider.name).then(() => {
              updateCount++

              const isFinished = updateCount === ruleProviderList.value.length

              showNotification({
                content: 'updateFinishedTip',
                params: {
                  number: `${updateCount}/${ruleProviderList.value.length}`,
                },
                type: isFinished ? 'alert-success' : 'alert-warning',
                timeout: isFinished ? 2000 : 0,
              })
            }),
          ),
        )
        await fetchRules()
        isUpgrading.value = false
      } catch {
        await fetchRules()
        isUpgrading.value = false
      }
    }

    const tabsWithNumbers = computed(() => {
      return Object.values(RULE_TAB_TYPE).map((type) => {
        return {
          type,
          count: type === RULE_TAB_TYPE.RULES ? rules.value.length : ruleProviderList.value.length,
        }
      })
    })

    return () => {
      const tabs = (
        <div
          role="tablist"
          class="tabs-boxed tabs tabs-sm"
        >
          {tabsWithNumbers.value.map(({ type, count }) => {
            return (
              <a
                role="tab"
                key={type}
                class={['tab', rulesTabShow.value === type && 'tab-active']}
                onClick={() => (rulesTabShow.value = type)}
              >
                {t(type)} ({count})
              </a>
            )
          })}
        </div>
      )
      const upgradeAll = rulesTabShow.value === RULE_TAB_TYPE.PROVIDER && (
        <button
          class={twMerge('btn btn-sm')}
          onClick={handlerClickUpgradeAllProviders}
        >
          {isUpgrading.value ? (
            <span class="loading loading-dots loading-md"></span>
          ) : (
            t('updateAllProviders')
          )}
        </button>
      )
      const upgradeAllIcon = rulesTabShow.value === RULE_TAB_TYPE.PROVIDER && (
        <button
          class={twMerge('btn btn-circle btn-sm')}
          onClick={handlerClickUpgradeAllProviders}
        >
          <ArrowPathIcon class={['h-4 w-4', isUpgrading.value && 'animate-spin']} />
        </button>
      )

      const searchInput = (
        <TextInput
          class="w-full md:w-80"
          v-model={rulesFilter.value}
          placeholder={t('search')}
          clearable={true}
        />
      )

      if (props.horizontal) {
        if (isMiddleScreen.value) {
          return (
            <div class="flex flex-col gap-2 p-2">
              {hasProviders.value && (
                <div class="flex gap-2">
                  {tabs}
                  {upgradeAllIcon}
                </div>
              )}
              <div class="flex w-full gap-2">{searchInput}</div>
            </div>
          )
        }
        return (
          <div class="flex flex-wrap gap-2 p-2">
            {hasProviders.value && tabs}
            {searchInput}
            <div class="flex-1"></div>
            {upgradeAllIcon}
          </div>
        )
      }

      return (
        <div class="flex flex-col gap-2 p-2">
          {upgradeAll}
          {hasProviders.value && tabs}
          {<div class="flex gap-2">{searchInput}</div>}
        </div>
      )
    }
  },
})
