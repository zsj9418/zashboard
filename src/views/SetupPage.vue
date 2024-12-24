<template>
  <div
    class="flex h-full w-full items-center justify-center bg-base-200/40"
    @keydown.enter="handleSubmit(form)"
  >
    <div class="absolute right-4 top-4">
      <button
        class="btn btn-sm"
        @click="importSettings"
      >
        {{ $t('importSettings') }}
      </button>
    </div>
    <div class="absolute bottom-4 right-4">
      <LanguageSelect />
    </div>
    <div class="card w-64 gap-2 px-6 py-2 sm:gap-4">
      <h1 class="text-2xl font-semibold">{{ $t('setup') }}</h1>
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('protocol') }}</span>
        </label>
        <select
          class="select select-bordered select-sm w-full"
          v-model="form.protocol"
        >
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('host') }}</span>
        </label>
        <input
          type="text"
          class="input input-sm input-bordered w-full"
          name="username"
          autocomplete="username"
          v-model="form.host"
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('port') }}</span>
        </label>
        <input
          type="text"
          class="input input-sm input-bordered w-full"
          v-model="form.port"
        />
      </div>
      <div class="form-control">
        <label class="label flex items-center justify-start gap-1">
          <span class="label-text">{{ $t('secondaryPath') }}</span>
          <span
            class="tooltip"
            :data-tip="$t('secondaryPathTip')"
          >
            <QuestionMarkCircleIcon class="h-4 w-4" />
          </span>
        </label>
        <input
          type="text"
          class="input input-sm input-bordered w-full"
          v-model="form.secondaryPath"
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">{{ $t('password') }}</span>
        </label>
        <input
          type="password"
          class="input input-sm input-bordered w-full"
          v-model="form.password"
        />
      </div>
      <button
        class="btn btn-primary btn-sm w-full"
        @click="handleSubmit(form)"
      >
        {{ $t('submit') }}
      </button>
      <div class="flex flex-col gap-2">
        <div
          v-for="backend in backendList"
          :key="backend.uuid"
          class="flex items-center gap-2"
        >
          <button
            class="btn btn-sm flex-1"
            @click="selectBackend(backend.uuid)"
          >
            {{ getUrlFromBackend(backend) }}
          </button>
          <button
            class="btn btn-circle btn-sm"
            @click="() => removeBackend(backend.uuid)"
          >
            <MinusCircleIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSelect from '@/components/settings/LanguageSelect.vue'
import { useTip } from '@/composables/tip'
import { ROUTE_NAME } from '@/config'
import { getUrlFromBackend, importSettings } from '@/helper'
import router from '@/router'
import { activeUuid, addBackend, backendList, removeBackend } from '@/store/setup'
import { MinusCircleIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import { reactive } from 'vue'

const form = reactive({
  protocol: 'http',
  host: '127.0.0.1',
  port: 9090,
  secondaryPath: '',
  password: '',
})

const { showTip } = useTip()

const selectBackend = (uuid: string) => {
  activeUuid.value = uuid
  router.push({ name: ROUTE_NAME.proxies })
}

const handleSubmit = async (
  form: {
    protocol: string
    host: string
    port: number
    secondaryPath: string
    password: string
  },
  quiet = false,
) => {
  const { protocol, host, port, password } = form

  if (!protocol || !host || !port) {
    alert('Please fill in all the fields.')
    return
  }

  if (
    window.location.protocol === 'https:' &&
    protocol === 'http' &&
    !['::1', '0.0.0.0', '127.0.0.1', 'localhost'].includes(host) &&
    !quiet
  ) {
    showTip('protocolTips')
  }

  try {
    const data = await fetch(`${getUrlFromBackend(form)}/version`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${password}`,
      },
    })

    if (data.status !== 200) {
      if (!quiet) {
        alert(data.statusText)
      }
      return
    }

    const { version, message } = await data.json()

    if (!version) {
      if (!quiet) {
        alert(message)
      }
      return
    }

    addBackend(form)
    router.push({ name: ROUTE_NAME.proxies })
  } catch (e) {
    if (!quiet) {
      alert(e)
    }
  }
}

const query = new URLSearchParams(
  window.location.search || location.hash.match(/\?.*$/)?.[0]?.replace('?', ''),
)
if (query.has('hostname')) {
  handleSubmit({
    protocol: query.get('http')
      ? 'http'
      : query.get('https')
        ? 'https'
        : window.location.protocol.replace(':', ''),
    secondaryPath: (query.get('secondaryPath') as string) || '',
    host: query.get('hostname') as string,
    port: Number(query.get('port')),
    password: query.get('secret') as string,
  })
} else if (backendList.value.length === 0) {
  handleSubmit(form, true)
}
</script>
