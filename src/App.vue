 <script setup lang="ts">
import { ref } from 'vue'
import { NSelect } from 'naive-ui'

import DocumentView from './components/DocumentView.vue'
import data from './data.json'

const options = Object.keys(data).map(el => { return { label: el, value: el } })

const selected = ref(null)
</script>

<template>
  <section class="border m-2 min-h-[568px] shadow-lg">
    <div class="mx-4 mt-4 flex w-[250px]">
      <n-select v-model:value="selected" :options="options" placeholder="Selecione uma entrevista" clearable />
    </div>
    <DocumentView v-if="selected" :data="data[selected]" />
  </section>
</template>
