<script setup lang="ts">
import { NScrollbar, NIcon, NDropdown, NButton } from "naive-ui";
import { legendToJSON } from "../utils";
import Search from "@vicons/carbon/Search";

import OverflowMenuVertical from "@vicons/carbon/OverflowMenuVertical";

const props = defineProps<{ data: { [key: string]: any }, downloadText: Function}>()
const selectDropdown = (option: string) => {
  if (option === "Download texto") {
    props.downloadText();
  }
}

const optionsLegend = [
  {
    label: "Download texto",
    key: "Download texto",
  },
]
</script>
<template>
  <div
    ref="legendElement"
    v-if="data.text"
    class="bg-gray-100 dark:bg-neutral-800 dark:text-gray-200 h-[351px] flex flex-col xl:h-[600px] w-full"
  >
    <div class="flex flex-col items-center">
      <div
        class="ps-5 pe-2 h-8 flex items-center justify-between w-full border-b border-gray-300 dark:border-neutral-600"
      >
        <span class="text-xs">Texto</span>
        <n-dropdown
          trigger="click"
          :options="optionsLegend"
          @select="selectDropdown"
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
      </div>
    </div>
    <n-scrollbar class="h-full">
      <article
        class="text-content px-5 flex items-start gap-3 my-2 first:mt-4 last:mb-4"
        :class="
          data.source === 'pdf'
            ? 'xl:max-w-[549px] 2xl:max-w-[639px]'
            : ''
        "
      >
        <span
          class="text-sm break-words max-w-[100%]"
          v-html="data.text.replace(/\n/gi, '<br>')"
        ></span>
      </article>
    </n-scrollbar>
  </div>
</template>

<style scoped>
.text-content {
  @apply py-2;
}

.ts-active {
  @apply bg-white shadow-sm dark:bg-neutral-700 font-bold;
}
</style>
