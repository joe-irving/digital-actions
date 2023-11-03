<script setup lang=ts>
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'test'
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [StarterKit],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})
</script>

<template>
  <div class="w-full">
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
    >
      <n-button size="tiny" @click="editor.chain().focus().toggleBold().run()">
        {{ $t('tiptap.bold') }}
      </n-button>
      <n-button size="tiny" @click="editor.chain().focus().toggleItalic().run()">
        {{ $t('tiptap.italic') }}
      </n-button>
    </BubbleMenu>
    <FloatingMenu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }">
      <n-button size="tiny" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
        {{ $t('tiptap.big_heading') }}
      </n-button>
      <n-button size="tiny" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        {{ $t('tiptap.small_heading') }}
      </n-button>
    </FloatingMenu>
    <EditorContent class="editor-window" :editor="editor" />
  </div>
</template>

<style>
h1, h2 {
    margin-top: 10px;
    padding-bottom: 5px;
}
h1 {
    font-size: 2em;
}
h2 {
    font-size: 1.7em;
}

.editor-window .tiptap {
    padding: 10px;
    border-width: 3px;
}
</style>
