import { Content, useEditor } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

export function useDefaultTextEditor(content?: Content) {
    return useEditor({
        extensions: [
          StarterKit,
          TextStyle,
          Color,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-5 py-5 focus:outline-none'
            },
        },
        content,
    })
}