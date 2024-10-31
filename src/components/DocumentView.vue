<script setup lang="ts">
import { ref } from "vue"
import type { Ref } from "vue"
import Transcription from "./Transcription.vue"
import Text from "./Text.vue"

const props = defineProps<{ data: { [key: string]: any } }>()
const emit = defineEmits(['videoReady'])

const mediaElement: Ref = ref(null)
const transcriptionSearch: Ref<string> = ref('')
const isTranscriptionReady: Ref<boolean> = ref(false)
const isPlayerReady: Ref<boolean> = ref(false)

const setMediaEventListeners = (scrollToLegend: Function) => {
  if (!props.data.transcription) {
    isTranscriptionReady.value = true
    checkAllReady()
    return
  }

  // Marcar que a transcrição está pronta
  isTranscriptionReady.value = true
  checkAllReady()

  if (
    ["mp4", "mkv", "mp3", "ogg", "bitchute"].includes(
      props.data.source
    )
  ) {
    mediaElement.value.play().catch(() => {
      // Do nothing
    })
    mediaElement.value.addEventListener("timeupdate", () => {
      if (mediaElement.value && mediaElement.value.currentTime) {
        scrollToLegend(mediaElement.value.currentTime)
      }
    })
    mediaElement.value.addEventListener("seeked", () => {
      if (mediaElement.value && mediaElement.value.currentTime) {
        scrollToLegend(Math.floor(mediaElement.value.currentTime), true)
      }
    })

    mediaElement.value.addEventListener("loadeddata", () => {
      isPlayerReady.value = true
      checkAllReady()
    })
  } else if (props.data.source === "youtube") {
    let previousTime = 0
    let previousAction = 0
    window.addEventListener("message", (message) => {
      if (typeof message.data == "string") {
        try {
          const data = JSON.parse(message.data)
          // O evento "onReady" é emitido quando o player está pronto
          if (data.event === "onReady") {
            isPlayerReady.value = true
            checkAllReady()
          }
          if (data.info && data.info.currentTime) {
            const currentTime = data.info.currentTime
            const currentAction = data.info.playerState
            if (previousAction == 2 || previousAction == 3) {
              previousAction = currentAction
              return
            }
            if (Math.abs(previousTime - currentTime) > 1) {
              scrollToLegend(currentTime, true)
            } else {
              scrollToLegend(currentTime)
            }
            previousTime = currentTime
            previousAction = currentAction
          }
        } catch (e) {
          // Ignora erros de parse JSON
        }
      }
    })

    mediaElement.value.addEventListener("load", () => {
      mediaElement.value.contentWindow.postMessage(
        JSON.stringify({ event: "listening" }),
        "*"
      )
    })
  }
}

// Função para verificar se tudo está pronto e emitir o evento
const checkAllReady = () => {
  // Se não tiver transcrição ou vídeo, emite direto
  if (!props.data.transcription && !props.data.media_url) {
    emit('videoReady')
    return
  }

  // Se tiver tudo pronto, emite o evento
  if (isPlayerReady.value && isTranscriptionReady.value) {
    emit('videoReady')
  }
}

const transcriptionClick = (timestamp: number | string) => {
  if (
    ["mp4", "mkv", "mp3", "ogg", "bitchute"].includes(
      props.data.source
    )
  ) {
    mediaElement.value.currentTime = timestamp
    mediaElement.value.play()
  } else if (props.data.source === "youtube") {
    mediaElement.value.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "seekTo",
        args: [timestamp, true],
      }),
      "*"
    )
  }
}

const downloadTranscription = () => {
  console.error("Not implemented: Download transcription")
}

const downloadText = () => {
  console.error("Not implemented: Download text")
}
</script>

<template>
  <section class="dark:bg-gray-900 flex flex-col sm:flex-row gap-3 py-8 mx-4">
    <div class="flex flex-col space-y-8">
      <p>
        {{data.summary}}
      </p>
    </div>
  </section>
  <section
    class="dark:bg-gray-900 flex flex-col sm:flex-row gap-3 py-8 mx-4"
  >
    <iframe
      v-if="
        data.type === 'video' &&
        data.source === 'youtube' &&
        data.media_url
      "
      ref="mediaElement"
      class="rounded-sm shadow-lg bg-black w-full h-[450px]"
      :class="
        data.transcription ? 'xl:h-auto' : 'xl:w-[800px] mx-auto'
      "
      :src="
        'https://www.youtube.com/embed/' +
        data.media_url.split('=')[1] +
        '?enablejsapi=1'
      "
      title="YouTube video player"
      frameborder="0"
      allowfullscreen
    >
    </iframe>
    <video
      v-else-if="
        (
          data.source === 'mp4' ||
          data.source === 'bitchute' ||
          data.source === 'mkv'
        ) &&
        data.media_url
      "
      ref="mediaElement"
      class="rounded-sm shadow-lg bg-black w-full h-[450px]"
      controls
    >
      <source :src="data.media_url" type="video/mp4" />
      <source :src="data.media_url" type="video/mkv" />
      Your browser does not support the video tag.
    </video>
    <audio
      v-else-if="
        data.type === 'audio' &&
        data.media_url &&
        (data.source === 'mp3' || data.source === 'ogg')
      "
      ref="mediaElement"
      class="shadow-lg rounded-full my-4 w-[100%]"
      controls
    >
      <source :src="data.media_url" type="audio/mpeg" />
      <source :src="data.media_url" type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
    <iframe
      v-else-if="
        data.type === 'audio' &&
        data.source === 'spotify' &&
        data.media_url
      "
      ref="mediaElement"
      class="shadow-lg rounded-full my-4 w-[100%]"
      style="border-radius: 12px"
      :src="
        'https://open.spotify.com/embed/track/' +
        data.media_url.split('/').pop()
      "
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
    <iframe
      v-else-if="
        data.type === 'text' &&
        data.source === 'pdf' &&
        data.media_url
      "
      ref="mediaElement"
      class="shadow-lg rounded-full w-[100%] h-[300px] lg:h-[600px]"
      style="border-radius: 12px"
      :src="data.media_url"
    ></iframe>
    <Transcription
      v-if="['video', 'audio'].includes(data.type)"
      :set-media-event-listeners="setMediaEventListeners"
      :data="data"
      :transcription-click="transcriptionClick"
      :downloadTranscription="downloadTranscription"
      v-model:transcriptionSearch="transcriptionSearch"
    />
    <Text
      v-else-if="data.type === 'text'"
      :data="data"
      :downloadText="downloadText"
    />
  </section>
</template>
