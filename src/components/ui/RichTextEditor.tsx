import { useEffect, useRef } from 'react'
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from 'lucide-react'
import { classNames } from '../../lib/utils'

interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (html: string) => void
  className?: string
}

function run(command: string, value?: string) {
  document.execCommand(command, false, value)
}

export function RichTextEditor({ label, value, onChange, className }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '<p></p>'
    }
  }, [value])

  const tools = [
    { label: 'Bold', icon: Bold, action: () => run('bold') },
    { label: 'Italic', icon: Italic, action: () => run('italic') },
    { label: 'Underline', icon: Underline, action: () => run('underline') },
    { label: 'Heading', icon: Heading2, action: () => run('formatBlock', 'h2') },
    { label: 'Bullets', icon: List, action: () => run('insertUnorderedList') },
    { label: 'Numbers', icon: ListOrdered, action: () => run('insertOrderedList') },
    { label: 'Undo', icon: Undo2, action: () => run('undo') },
    { label: 'Redo', icon: Redo2, action: () => run('redo') },
  ]

  return (
    <div className={classNames('flex flex-col gap-1.5 text-left', className)}>
      {label ? <span className="text-xs font-semibold text-[#171A1F]">{label}</span> : null}
      <div className="rounded-2xl border border-[#DDE1E7] bg-white overflow-hidden focus-within:border-[#1677FF]">
        <div className="flex flex-wrap gap-1 px-2 py-2 border-b border-[#EAEDF1] bg-[#F8FAFC]">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                onMouseDown={(event) => {
                  event.preventDefault()
                  tool.action()
                  if (ref.current) onChange(ref.current.innerHTML)
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#68707C] hover:bg-white hover:text-[#171A1F] border border-transparent hover:border-[#DDE1E7] cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            )
          })}
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[160px] px-4 py-3 text-sm text-[#171A1F] outline-none leading-relaxed prose-cms"
          onInput={() => {
            if (ref.current) onChange(ref.current.innerHTML)
          }}
        />
      </div>
    </div>
  )
}
