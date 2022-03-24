import { BubbleMenu, Editor } from "@tiptap/react"

type EditorMenuProps = {
    editor?: Editor | null
}

export function EditorMenu({ editor = null }: EditorMenuProps) {
    if (!editor) {
        return null
    }
    return (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
        >
          <button
            type='button'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            bold
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            italic
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            strike
          </button>
          <input
            type="color"
            onChange={event => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color}
          />
          <button
            type='button'
            onClick={() => editor.chain().focus().setColor('#958DF1').run()}
            className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
          >
            purple
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().setColor('#F98181').run()}
            className={editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''}
          >
            red
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().setColor('#FBBC88').run()}
            className={editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''}
          >
            orange
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().setColor('#FAF594').run()}
            className={editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''}
          >
            yellow
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().setColor('#70CFF8').run()}
            className={editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''}
          >
            blue
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().setColor('#94FADB').run()}
            className={editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''}
          >
            teal
          </button>
          <button
            type='button'
            onClick={() => editor.chain().focus().setColor('#B9F18D').run()}
            className={editor.isActive('textStyle', { color: '#B9F18D' }) ? 'is-active' : ''}
          >
            green
          </button>
          <button type='button' onClick={() => editor.chain().focus().unsetColor().run()}>unsetColor</button>
        </BubbleMenu>
    )
}