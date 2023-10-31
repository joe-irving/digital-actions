<script setup lang=ts>
import type { UploadFileInfo } from 'naive-ui'
import { PropType } from 'nuxt/dist/app/compat/capi'

defineProps({
  modelValue: {
    type: Array as PropType<UploadFileInfo[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const uploadFinished = ({
  file,
  event
}: {
      file: UploadFileInfo
      event?: ProgressEvent
    }) => {
  const response: {status: boolean; path: string; name: string} = ((event?.target as XMLHttpRequest).response)
  file.url = response.path
  file.name = response.name
  return file
}

const handleChange = (data: { fileList: UploadFileInfo[] }) => {
  console.log(data.fileList)
  emit('update:modelValue', data.fileList)
}
</script>

<template>
  <n-upload
    action="/api/upload"
    accept="image/*"
    :default-upload="true"
    :max="1"
    response-type="json"
    @finish="uploadFinished"
    @change="handleChange"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
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
  {{ modelValue }}
</template>
