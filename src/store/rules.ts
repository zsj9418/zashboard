import { fetchRuleProvidersAPI, fetchRulesAPI } from '@/api'
import type { Rule, RuleProvider } from '@/types'
import { computed, ref } from 'vue'

export const rules = ref<Rule[]>([])
export const ruleProviderList = ref<RuleProvider[]>([])
export const rulesFilter = ref('')

export const renderRules = computed(() => {
  if (rulesFilter.value === '') {
    return rules.value
  }

  return rules.value.filter((rule) => {
    return [rule.type, rule.payload, rule.proxy].some((i) => i.includes(rulesFilter.value))
  })
})

export const renderRulesProvider = computed(() => {
  if (rulesFilter.value === '') {
    return ruleProviderList.value
  }

  return ruleProviderList.value.filter((ruleProvider) => {
    return [ruleProvider.name, ruleProvider.behavior, ruleProvider.vehicleType].some((i) =>
      i.includes(rulesFilter.value),
    )
  })
})

export const fetchRules = async () => {
  const { data: ruleData } = await fetchRulesAPI()
  const { data: providerData } = await fetchRuleProvidersAPI()

  rules.value = ruleData.rules
  ruleProviderList.value = Object.values(providerData.providers)
}
