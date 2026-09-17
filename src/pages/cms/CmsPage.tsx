import { useState } from 'react'
import { FileText, Info, Shield, ScrollText } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input, TextArea } from '../../components/ui/Input'
import { RichTextEditor } from '../../components/ui/RichTextEditor'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/shared/Badge'
import { classNames } from '../../lib/utils'
import { deleteFaq, newFaq, saveLegal, upsertFaq } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { FaqItem, LegalDoc } from '../../types/common.types'

type Tab = 'faq' | 'terms' | 'privacy' | 'about'

const TABS: Array<{ id: Tab; label: string; icon: typeof FileText }> = [
  { id: 'faq', label: 'FAQ', icon: FileText },
  { id: 'terms', label: 'Terms', icon: ScrollText },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'about', label: 'About us', icon: Info },
]

export function CmsPage() {
  const [tab, setTab] = useState<Tab>('faq')
  const faqs = useAppSelector((state) => state.platform.faqs)
  const legal = useAppSelector((state) => state.platform.legal)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<FaqItem | null>(null)
  const terms = legal.find((doc) => doc.id === 'terms')
  const privacy = legal.find((doc) => doc.id === 'privacy')
  const about = legal.find((doc) => doc.id === 'about')

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader title="CMS" subtitle="Content customers see in the Lattice app and website" />

      <div className="flex flex-wrap gap-1 bg-[#EAEDF1] p-1 rounded-2xl w-fit">
        {TABS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={classNames(
                'h-9 px-3.5 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5',
                tab === item.id ? 'bg-white text-[#1677FF] shadow-sm' : 'text-[#68707C]'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'faq' ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#68707C]">{faqs.length} FAQ items</p>
            <Button onClick={() => setDraft(newFaq())}>Add FAQ</Button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {faqs.map((item) => (
              <div key={item.id} className="panel p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#171A1F]">{item.question}</p>
                    <p className="text-sm text-[#68707C] mt-1.5 leading-relaxed">{item.answer}</p>
                  </div>
                  <Badge tone={item.published ? 'green' : 'slate'}>{item.published ? 'Live' : 'Draft'}</Badge>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="secondary" onClick={() => setDraft(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => dispatch(deleteFaq(item.id))}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'terms' && terms ? <LegalEditor key={terms.id} doc={terms} /> : null}
      {tab === 'privacy' && privacy ? <LegalEditor key={privacy.id} doc={privacy} /> : null}
      {tab === 'about' && about ? <LegalEditor key={about.id} doc={about} /> : null}

      <Modal title="FAQ" open={Boolean(draft)} onClose={() => setDraft(null)} wide>
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.question.trim()) return
              dispatch(upsertFaq(draft))
              setDraft(null)
            }}
          >
            <Input
              label="Question"
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            />
            <TextArea
              label="Answer"
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Published
            </label>
            <Button type="submit">Save FAQ</Button>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}

function LegalEditor({ doc }: { doc: LegalDoc }) {
  const dispatch = useAppDispatch()
  const [body, setBody] = useState(doc.body)
  const [saved, setSaved] = useState(false)

  return (
    <div className="panel p-5 md:p-6 flex flex-col gap-4 max-w-4xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#171A1F]">{doc.title}</h2>
          <p className="text-xs text-[#68707C] mt-1">Updated {doc.updatedAt}</p>
        </div>
        {saved ? <Badge tone="green">Saved</Badge> : null}
      </div>
      <RichTextEditor label="Content" value={body} onChange={setBody} />
      <div className="flex justify-end">
        <Button
          onClick={() => {
            dispatch(saveLegal({ ...doc, body, updatedAt: new Date().toISOString().slice(0, 10) }))
            setSaved(true)
          }}
        >
          Save {doc.title}
        </Button>
      </div>
    </div>
  )
}
