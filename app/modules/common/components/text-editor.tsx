import { useEditor, EditorContent, Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type TextEditorProps = {
    content?: Content
}

export const TextEditor = ({ content = '' }: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-5 py-5 focus:outline-none'
        },
    },
    content,
  })

  return (
    <EditorContent editor={editor} />
  )
}