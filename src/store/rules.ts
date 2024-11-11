import { getRulesAPI } from "@/api";
import type { Rule } from "@/types";
import { ref } from "vue";

export const rules = ref<Rule[]>()
export const fetchRules = async () => {
  const { data } = await getRulesAPI()
  rules.value = data.rules
}
