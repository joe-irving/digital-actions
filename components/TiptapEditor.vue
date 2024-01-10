<script setup lang=ts>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3]
      }
    })
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})
</script>

<template>
  <div v-if="editor" class="w-full border-2 rounded">
    <div class="tiptap-buttons flex gap-2 p-2">
      <n-button size="small" quaternary :class="{ 'active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
        <NaiveIcon name="material-symbols:format-bold" />
      </n-button>
      <n-button size="small" quaternary :class="{ 'active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
        <NaiveIcon name="material-symbols:format-italic" />
      </n-button>
      <n-button size="small" quaternary :class="{ 'active': editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        <NaiveIcon name="material-symbols:format-h1" />
      </n-button>
      <n-button size="small" quaternary :class="{ 'active': editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
        <NaiveIcon name="material-symbols:format-h2" />
      </n-button>
    </div>
    <EditorContent class="editor-window" :editor="editor" />
  </div>
</template>

<style>
h1, h2, h3 {
    margin-top: 10px;
    padding-bottom: 5px;
}
h1 {
    font-size: 2em;
}
h2 {
    font-size: 1.7em;
}
h3 {
    font-size: 1.5em;
}

.editor-window .tiptap {
    padding: 10px;
    outline: none;
}

.tiptap-buttons .n-button.active {
  background-color: var(--n-color-hover);
  color: var(--n-text-color-hover);
}
</style>
