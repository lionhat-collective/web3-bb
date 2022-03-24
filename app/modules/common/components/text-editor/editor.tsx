import { EditorContent, Editor } from '@tiptap/react'
import { EditorMenu } from './menu'

type TextEditorProps = {
  editor?: Editor | null
}

export const TextEditor = ({ editor = null }: TextEditorProps) => {
  return (
    <>
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}