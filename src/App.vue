<script setup lang="ts">
import { NInputNumber } from 'naive-ui'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useMeta } from 'vue-meta'

const store = useStore()

const value = computed({
    get() {
       return store.state.count
    },
    set(value) {
      store.commit("increment", value)
    }
})

useMeta({
  title: 'Projeto vue',
  description: 'Conheça mais sobre o projeto',
  htmlAttrs: { lang: 'pt-br', amp: true }
})

const siteName = "Projeto Vue"
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">
      {{ content ? `${content} | ${siteName}` : siteName }}
    </template>
  </metainfo>
  <section class="m-12">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="mt-2 w-[250px]">
      <n-input-number v-model:value="value" clearable />
    </div>
  </section>
</template>
