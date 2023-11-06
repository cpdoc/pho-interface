<script setup lang="ts">
import { ref, computed, toRaw, onMounted, watch, nextTick } from "vue"

import OverflowMenuVertical from "@vicons/carbon/OverflowMenuVertical";
import Search from "@vicons/carbon/Search";

import { legendToJSON, createDebounce, normalizeValue } from "../utils";

import type { Ref } from "vue"
import {
  NDropdown,
  NEmpty,
  NInput,
  NScrollbar,
  NButton,
  NIcon
} from "naive-ui"

const props = defineProps<{
  data: { [key: string]: any },
  downloadTranscription: Function,
  transcriptionClick: Function,
  transcriptionSearch: string,
  setMediaEventListeners: Function,
}>()

const emit = defineEmits()
const showTimes = ref(true)
const filterLength: Ref = ref(null)
const legendElement: Ref = ref(null)

const transcription: any = computed({
  get() {
    return props.data.transcription ? legendToJSON(props.data.transcription) : null
  },
  set(value: any) {
      return value
  }
})

const selectDropdownLegend = (option: string) => {
  if (option === "Exibir/ocultar tempo") {
    showTimes.value = !showTimes.value;
  } else if (option === "Download transcricao") {
    props.downloadTranscription();
  }
}

const handleLegendClick = (timestamp: number | string) => {
  props.transcriptionClick(timestamp);
}

const optionsLegend = [
  {
    label: "Exibir/ocultar tempo",
    key: "Exibir/ocultar tempo",
  },
  {
    label: "Download transcrição",
    key: "Download transcricao",
  },
]

// Starting global debounce
const debounce = createDebounce();

const searchValue: any = computed({
  get() {
    debounce(() => {
      updateTranscriptionList(props.transcriptionSearch);
      if (searchValue.value) {
        filterLength.value = transcription.value.filter(
          (el: { show: boolean }) => el.show === true
        ).length;
      } else {
        filterLength.value = null;
      }
    });
    return props.transcriptionSearch;
  },
  set(value) {
    const activeTimeStamp = legendElement.value.querySelector(".ts-active");
    const scroll = legendElement?.value.querySelector(
      ".n-scrollbar-container"
    );
    if (activeTimeStamp && !value.length) {
      scroll.scrollTop =
        activeTimeStamp.offsetTop - scroll.clientHeight / 2;
    }

    emit("update:transcriptionSearch", value);
  },
});

const updateTranscriptionList = (value: string) => {
  if (value === null) {
    return
  }
  transcription.value = toRaw(transcription.value).map(
    (el: { [key: string]: any }) => {
      normalizeValue(el.content.trim().toLowerCase()).includes(
        normalizeValue(value.trim().toLowerCase())
      )
        ? (el.show = true)
        : (el.show = false);
      return el;
    }
  )
}

const checkInView = (container: HTMLElement, element: HTMLElement) => {
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;
  const eTop = element.offsetTop;
  const eBottom = eTop + element.clientHeight;

  const isTotal = eTop >= cTop && eBottom <= cBottom;

  return isTotal;
}

const scrollToLegend = (
  currentTime: number,
  nearTimestamp: boolean = false
) => {
  let timestamp;

  if (nearTimestamp) {
    let timestamps =
      legendElement.value?.querySelectorAll("[id^=timestamp_]");
      if (!legendElement.value) {
        return
      }

    // Getting closest timestamp
    let closest = Infinity;
    let closestNumberIndex = 0;
    for (let i = 0; i < timestamps.length; i++) {
      const number = timestamps[i].id.split("_")[1];
      const difference = Math.abs(number - currentTime);
      if (difference < closest) {
        closest = difference;
        closestNumberIndex = i;
      }
    }

    timestamp = timestamps[closestNumberIndex];
  } else {
    timestamp = legendElement?.value?.querySelector(
      `#timestamp_${Math.floor(currentTime)}`
    );
    if (!timestamp) return;
  }

  const lastTimestamp = legendElement.value.querySelector(".ts-active");
  if (lastTimestamp) {
    lastTimestamp.classList.remove("ts-active");
  }

  timestamp.classList.add("ts-active");

  const scroll = legendElement.value.querySelector(
    ".n-scrollbar-container"
  );
  if (!checkInView(scroll, timestamp)) {
    scroll.scrollTop = timestamp.offsetTop - scroll.clientHeight / 2;
  }
};

onMounted(async () => {
  await props.setMediaEventListeners(scrollToLegend);
});

watch(
  () => props.data.source,
  () => {
    // Wait component render
    nextTick(async () => {
      await props.setMediaEventListeners(scrollToLegend)
      const lastTimestamp = legendElement.value.querySelector(".ts-active");
      if (lastTimestamp) {
        lastTimestamp.classList.remove("ts-active");
      }
    })
  }
);
</script>
<template>
  <div
    ref="legendElement"
    v-if="transcription"
    class="bg-gray-100 dark:bg-neutral-800 dark:text-gray-200 h-[450px] flex flex-col w-full"
  >
    <div class="flex flex-col items-center">
      <div
        class="ps-5 pe-2 h-8 flex items-center justify-between w-full border-b border-gray-300 dark:border-neutral-600"
      >
        <span class="text-xs">Legenda</span>
        <div class="flex justify-center items-center gap-1">
          <div class="w-64 relative">
            <n-input
              v-model:value="searchValue"
              clearable
              type="text"
              placeholder="Pesquisar"
              size="tiny"
            >
              <template #suffix>
                <n-icon v-if="!searchValue" :component="Search" />
              </template>
            </n-input>
            <span
              v-show="typeof filterLength === 'number'"
              class="text-xs text-gray-800 dark:text-neutral-200 absolute top-[3.1px] right-6 bg-gray-200 dark:bg-gray-600 px-1 rounded"
            >
              {{ filterLength }} ocorrência{{ filterLength === 1 ? "" : "s" }}
            </span>
          </div>
          <!--
          <n-dropdown
            trigger="click"
            :options="optionsLegend"
            @select="selectDropdownLegend"
          >
            <n-button quaternary size="tiny" title="Menu adicional legenda">
              <template #icon>
                <n-icon
                  class="text-gray-600 dark:text-gray-200 text-lg"
                  :component="OverflowMenuVertical"
                />
              </template>
            </n-button>
            </n-dropdown>
          -->
        </div>
      </div>
    </div>
    <n-scrollbar class="h-full">
      <template v-for="line in transcription">
        <article
          v-show="(line.show && line.show === true) || line.show === undefined"
          class="legend-content px-5 flex items-start gap-3 my-2 first:mt-4 last:mb-4"
          :id="'timestamp_' + String(line.rawStartTime)"
          @click="() => handleLegendClick(line.rawStartTime)"
        >
          <div v-if="showTimes">
            <div
              class="text-indigo-600 dark:text-blue-100 bg-sky-100 dark:bg-blue-800 font-semibold text-xs rounded px-1"
            >
              {{ line.startTime }}
            </div>
          </div>
          <div class="text-xs">{{ line.content }}</div>
        </article>
      </template>
      <template v-if="filterLength === 0">
        <n-empty
          class="py-24"
          description="Nenhum resultado encontrado"
        ></n-empty>
      </template>
    </n-scrollbar>
  </div>
</template>

<style scoped>
.legend-content {
  @apply hover:bg-white hover:shadow-sm dark:hover:bg-neutral-700 hover:cursor-pointer py-2;
}

.ts-active {
  @apply bg-white shadow-sm dark:bg-neutral-700 font-bold;
}
</style>
