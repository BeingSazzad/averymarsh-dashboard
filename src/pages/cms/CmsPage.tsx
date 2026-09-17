import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input, TextArea } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/shared/Badge'
import { classNames } from '../../lib/utils'
import { deleteFaq, newFaq, saveLegal, upsertFaq } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { FaqItem, LegalDoc } from '../../types/common.types'

type Tab = 'faq' | 'terms' | 'privacy'

export function CmsPage() {
  const [tab, setTab] = useState<Tab>('faq')
  const faqs = useAppSelector((state) => state.platform.faqs)
  const legal = useAppSelector((state) => state.platform.legal)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<FaqItem | null>(null)
  const terms = legal.find((doc) => doc.id === 'terms')
  const privacy = legal.find((doc) => doc.id === 'privacy')

  return (
    <div>
      <PageHeader title="CMS" subtitle="FAQ, terms, and privacy shown to Lattice customers" />
      <div className="flex gap-1 bg-[#EAEDF1] p-1 rounded-xl w-fit mb-4">
        {(['faq', 'terms', 'privacy'] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={classNames(
              'h-9 px-3 rounded-lg text-xs font-semibold cursor-pointer capitalize',
              tab === item ? 'bg-white text-[#1677FF]' : 'text-[#68707C]'
            )}
          >
            {item === 'faq' ? 'FAQ' : item === 'terms' ? 'Terms' : 'Privacy'}
          </button>
        ))}
      </div>

      {tab === 'faq' ? (
        <div>
          <Button className="mb-3" onClick={() => setDraft(newFaq())}>Add FAQ</Button>
          <div className="flex flex-col gap-2">
            {faqs.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white border border-[#DDE1E7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#171A1F]">{item.question}</p>
                    <p className="text-sm text-[#68707C] mt-1">{item.answer}</p>
                  </div>
                  <Badge tone={item.published ? 'green' : 'slate'}>{item.published ? 'Live' : 'Draft'}</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="secondary" onClick={() => setDraft(item)}>Edit</Button>
                  <Button variant="danger" onClick={() => dispatch(deleteFaq(item.id))}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'terms' && terms ? <LegalEditor key={terms.id} doc={terms} /> : null}
      {tab === 'privacy' && privacy ? <LegalEditor key={privacy.id} doc={privacy} /> : null}

      <Modal title="FAQ" open={Boolean(draft)} onClose={() => setDraft(null)}>
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
            <Input label="Question" value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
            <TextArea label="Answer" value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
              Published
            </label>
            <Button type="submit">Save</Button>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}

function LegalEditor({ doc }: { doc: LegalDoc }) {
  const dispatch = useAppDispatch()
  const [body, setBody] = useState(doc.body)

  return (
    <div className="rounded-2xl bg-white border border-[#DDE1E7] p-4 flex flex-col gap-3">
      <p className="text-xs text-[#68707C]">Updated {doc.updatedAt}</p>
      <TextArea label={doc.title} value={body} onChange={(e) => setBody(e.target.value)} />
      <Button
        onClick={() =>
          dispatch(saveLegal({ ...doc, body, updatedAt: new Date().toISOString().slice(0, 10) }))
        }
      >
        Save {doc.title}
      </Button>
    </div>
  )
}
