<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { NSelect, NSpin } from 'naive-ui'
import type { InterviewIndex, InterviewData } from './types/interviews'
import { loadInterviewData } from './types/interviews'
import DocumentView from './components/DocumentView.vue'

const index = ref<InterviewIndex | null>(null)
const options = ref<{ label: string, value: string }[]>([])
const selected = ref<string | null>(null)
const interviewData = ref<InterviewData | null>(null)
const loading = ref(false)

async function loadIndex() {
  try {
    const response = await fetch('/data/index.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    index.value = data
    options.value = Object.entries(data).map(([key, data]) => ({
      label: data.label,
      value: key
    }))
  } catch (error) {
    console.error('Failed to load index:', error)
  }
}

async function handleSelectionChange(value: string | null) {
  if (!value || !index.value) {
    interviewData.value = null
    return
  }

  loading.value = true
  try {
    interviewData.value = await loadInterviewData(index.value[value].uuid)
  } catch (error) {
    console.error('Failed to load interview data:', error)
  } finally {
    loading.value = false
  }
}

function handleVideoReady() {
  loading.value = false
}

onMounted(loadIndex)

watch(selected, handleSelectionChange)
</script>

<template>
  <section class="border m-2 min-h-[568px] shadow-lg">
    <div class="mx-4 mt-4 flex">
      <n-select
        v-model:value="selected"
        :options="options"
        placeholder="Selecione uma entrevista"
        clearable
        :loading="loading"
        class="w-[250px]"
      />
    </div>

    <n-spin :show="loading">
      <DocumentView
        v-if="selected && interviewData"
        :data="interviewData"
        :key="selected"
        @video-ready="handleVideoReady"
      />
    </n-spin>
  </section>
</template>
