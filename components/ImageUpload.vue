<script setup lang=ts>
import type { UploadFileInfo } from 'naive-ui'
// import { PropType } from 'nuxt/dist/app/compat/capi'

const { $i18n } = useNuxtApp()

const props = defineProps({
  image: {
    type: Object as PropType<{id: number; url: string;}>,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const fileList = ref<UploadFileInfo[]>([])

if (props.image) {
  fileList.value.push({
    id: props.image.id.toString(),
    url: props.image.url,
    name: props.image.url,
    status: 'finished'
  })
}

const warningMessage = ref<string | null>(null)

const uploadFinished = ({
  file,
  event
}: {
      file: UploadFileInfo
      event?: ProgressEvent
    }) => {
  warningMessage.value = null
  const response: {status: boolean; path: string; name: string} = ((event?.target as XMLHttpRequest).response)
  file.url = response.path
  file.name = response.name
  return file
}

const handleChange = (data: { fileList: UploadFileInfo[] }) => {
  fileList.value = data.fileList
  emit('change', data.fileList)
}

const beforeUpload = (data: {
        file: UploadFileInfo
        fileList: UploadFileInfo[]
      }) => {
  if (data.file.file?.size && data.file.file?.size > 10 * 2 ** 10 * 2 ** 10) {
    warningMessage.value = $i18n.t('image_upload.too_large_warning')
    return false
  }
  return true
}
</script>

<template>
  <div class="w-full">
    <n-upload
      action="/api/upload"
      accept="image/*"
      :default-upload="true"
      :max="1"
      :default-file-list="fileList"
      response-type="json"
      list-type="image"
      class="w-full"
      @finish="uploadFinished"
      @change="handleChange"
      @before-upload="beforeUpload"
    >
      <n-upload-dragger v-if="fileList.length === 0">
        <div>
          <NaiveIcon
            :size="48"
            :depth="3"
            name="material-symbols:upload"
          />
        </div>
        <n-text style="font-size: 16px">
          {{ $t("petition_create.image_upload_text") }}
        </n-text>
      </n-upload-dragger>
    </n-upload>
    <n-p v-if="warningMessage">
      {{ warningMessage }}
    </n-p>
  </div>
</template>
