import { useMemo, useState, type ReactNode } from 'react'

type View =
  | 'home'
  | 'property'
  | 'eligibility'
  | 'missing-data'
  | 'no-rules'
  | 'not-eligible'
  | 'dossier'
  | 'disclosure'
  | 'applications'
  | 'history'
  | 'archived'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'dark'
type IconName = 'home' | 'cases' | 'file' | 'lock' | 'check' | 'arrow' | 'plus' | 'info' | 'clock' | 'archive' | 'x'

type Criterion = {
  label: string
  detail: string
  status: string
  tone: Tone
}

type DocumentItem = {
  label: string
  meta: string
  status: 'Ready' | 'Missing'
}

const baseCriteria: Criterion[] = [
  {
    label: 'Household size',
    detail: 'Demo rule: minimum 2 people · Household: 2',
    status: 'Verified',
    tone: 'success',
  },
  {
    label: 'Income threshold',
    detail: 'Household data fits the demo published range',
    status: 'Verified',
    tone: 'success',
  },
  {
    label: 'Occupancy',
    detail: '3 rooms · 2-person household',
    status: 'Verified',
    tone: 'success',
  },
  {
    label: 'Residence requirement',
    detail: 'Residence duration information is incomplete',
    status: 'Needs input',
    tone: 'warning',
  },
  {
    label: 'Required evidence',
    detail: 'Published document list is available',
    status: 'Verified',
    tone: 'success',
  },
]

const initialDocuments: DocumentItem[] = [
  { label: 'Identity document', meta: 'Valid · reusable household document', status: 'Ready' },
  { label: 'Residence permit', meta: 'Valid · reusable household document', status: 'Ready' },
  { label: 'Debt register extract', meta: 'Valid until 14 Dec · demo date', status: 'Ready' },
  { label: 'Income evidence', meta: 'Updated 18 Sep · demo date', status: 'Ready' },
  { label: 'Household details', meta: '2 applicants · confirmed', status: 'Ready' },
  { label: 'Viewing notes', meta: 'Completed after demo viewing', status: 'Ready' },
  { label: 'Cover letter', meta: 'Property-specific requirement', status: 'Missing' },
  { label: 'Second applicant form', meta: 'Property-specific requirement', status: 'Missing' },
]

const nav: Array<{ id: View; label: string; icon: IconName }> = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'applications', label: 'Applications', icon: 'cases' },
  { id: 'dossier', label: 'Dossier', icon: 'file' },
  { id: 'history', label: 'Privacy', icon: 'lock' },
]

function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`pill pill--${tone}`}>{children}</span>
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-7h6v7"/></>,
    cases: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M8 5V3h8v2"/><path d="M3 11h18"/></>,
    file: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    check: <path d="m5 12 4 4 10-10"/>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    archive: <><path d="M4 7h16v14H4z"/><path d="M3 3h18v4H3z"/><path d="M9 12h6"/></>,
    x: <path d="m7 7 10 10M17 7 7 17"/>,
  }

  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = 'dark',
  onClick,
  disabled,
  className = '',
}: {
  children: ReactNode
  variant?: 'dark' | 'soft' | 'ghost'
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button className={`button button--${variant} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function PageHeader({ eyebrow, title, copy, status }: { eyebrow: string; title: string; copy: string; status?: ReactNode }) {
  return (
    <div className="page-heading">
      <div className="page-heading__copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {status && <div className="page-heading__status">{status}</div>}
    </div>
  )
}

function App() {
  const [view, setView] = useState<View>('home')
  const [listingUrl, setListingUrl] = useState('')
  const [documents, setDocuments] = useState(initialDocuments)
  const [submitted, setSubmitted] = useState(false)
  const [residenceVerified, setResidenceVerified] = useState(false)
  const [municipality, setMunicipality] = useState('Bern')
  const [moveInDate, setMoveInDate] = useState('')
  const [shareConfirmed, setShareConfirmed] = useState(false)

  const criteria = useMemo(
    () =>
      baseCriteria.map((criterion) =>
        criterion.label === 'Residence requirement' && residenceVerified
          ? {
              ...criterion,
              detail: `${municipality} · residence data added for demo evaluation`,
              status: 'Verified',
              tone: 'success' as Tone,
            }
          : criterion,
      ),
    [municipality, residenceVerified],
  )

  const readyCount = useMemo(
    () => documents.filter((document) => document.status === 'Ready').length,
    [documents],
  )

  const eligibleCount = criteria.filter((criterion) => criterion.tone === 'success').length
  const dossierReady = readyCount === documents.length

  function go(next: View) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function addProperty() {
    go('property')
  }

  function resolveMissingDocuments() {
    setDocuments((current) => current.map((document) => ({ ...document, status: 'Ready' })))
  }

  function saveResidence() {
    if (!moveInDate) return
    setResidenceVerified(true)
    go('eligibility')
  }

  function submitApplication() {
    setShareConfirmed(true)
    setSubmitted(true)
    go('applications')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Desktop navigation">
        <button className="brand" onClick={() => go('home')} aria-label="KLAR home">KLAR.</button>
        <nav className="sidebar__nav" aria-label="Primary navigation">
          {nav.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? 'nav-item nav-item--active' : 'nav-item'}
              onClick={() => go(item.id)}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <Pill>Concept MVP</Pill>
          <p>Swiss rental decision workspace</p>
          <small>Demo data only</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => go('home')}>KLAR.</button>
          <div className="topbar__meta">
            <span>Household workspace</span>
            <Pill tone="dark">2 applicants</Pill>
          </div>
        </header>

        {view === 'home' && (
          <section className="page page--home">
            <div className="hero-grid">
              <div className="hero">
                <Pill tone="dark">SWISS RENTAL WORKSPACE</Pill>
                <h1>Know before<br />you apply.</h1>
                <p>
                  Understand known rental criteria, prepare the right dossier and keep track of where personal documents go.
                </p>
              </div>
              <div className="hero-side" aria-label="Product principles">
                <div className="hero-side__number">01</div>
                <p><strong>Eligibility</strong> explains published or verified criteria.</p>
                <div className="hero-side__number">02</div>
                <p><strong>Readiness</strong> shows what the application package still needs.</p>
                <div className="hero-side__number">03</div>
                <p><strong>Selection</strong> remains with the provider.</p>
              </div>
            </div>

            <div className="add-property panel">
              <div className="add-property__copy">
                <span className="eyebrow">ADD A PROPERTY</span>
                <h2>Start with a listing you already found.</h2>
                <p>No marketplace rebuild. KLAR. starts when the rental decision gets complicated.</p>
              </div>
              <div className="input-stack">
                <div className="input-row">
                  <input
                    value={listingUrl}
                    onChange={(event) => setListingUrl(event.target.value)}
                    placeholder="Paste a listing or provider link"
                    aria-label="Property listing URL"
                  />
                  <Button onClick={addProperty}><Icon name="plus" /> Add property</Button>
                </div>
                <button className="text-button" onClick={addProperty}>Or add property manually <Icon name="arrow" size={15} /></button>
              </div>
            </div>

            <div className="metric-grid">
              <button className="metric-card" onClick={() => go('eligibility')}>
                <span className="eyebrow">ELIGIBILITY</span>
                <strong>{eligibleCount} of 5</strong>
                <p>{residenceVerified ? 'All known demo criteria are verified.' : 'One known criterion still needs household data.'}</p>
                <span className="card-link">Review criteria <Icon name="arrow" size={16} /></span>
              </button>
              <button className="metric-card" onClick={() => go('dossier')}>
                <span className="eyebrow">DOSSIER</span>
                <strong>{readyCount} of {documents.length}</strong>
                <p>{documents.length - readyCount} property-specific items need attention.</p>
                <span className="card-link">Open dossier <Icon name="arrow" size={16} /></span>
              </button>
              <button className="metric-card" onClick={() => go('history')}>
                <span className="eyebrow">PRIVACY</span>
                <strong>{submitted ? '1 record' : '0 records'}</strong>
                <p>See what was shared, with whom and when.</p>
                <span className="card-link">View disclosure <Icon name="arrow" size={16} /></span>
              </button>
            </div>

            <div className="edge-states">
              <div>
                <span className="eyebrow">EXPLORE EDGE STATES</span>
                <h2>Uncertainty stays visible.</h2>
              </div>
              <div className="state-links">
                <button onClick={() => go('no-rules')}>No verified rules <Icon name="arrow" size={15} /></button>
                <button onClick={() => go('not-eligible')}>Criterion not met <Icon name="arrow" size={15} /></button>
                <button onClick={() => go('archived')}>Archived case <Icon name="arrow" size={15} /></button>
              </div>
            </div>
          </section>
        )}

        {view === 'property' && (
          <section className="page">
            <PageHeader
              eyebrow="PROPERTY CASE"
              title="Aareweg 18, Bern"
              copy="One saved property becomes one decision case: criteria, dossier, application and disclosure stay connected."
              status={<Pill>Saved</Pill>}
            />

            <div className="property-layout">
              <article className="panel property-hero-card">
                <div className="property-visual">
                  <div className="property-visual__top"><Pill tone="dark">DEMO PROPERTY</Pill><span>Bern</span></div>
                  <strong>CHF 1’650</strong>
                  <span className="property-visual__rooms">3 rooms · viewing 24 Sep</span>
                  <div className="property-visual__line" />
                  <small>Illustrative data for the portfolio MVP</small>
                </div>
                <div className="property-copy">
                  <span className="eyebrow">KNOWN INFORMATION</span>
                  <h2>Demo municipal rule pack</h2>
                  <p>Rules in this prototype are illustrative. A production version would show provenance, freshness and source links for each verified criterion.</p>
                  <Button onClick={() => go('eligibility')}>Check eligibility <Icon name="arrow" /></Button>
                </div>
              </article>

              <div className="stack">
                <article className="mini-panel">
                  <span className="eyebrow">VIEWING</span>
                  <strong>24 Sep · 17:00</strong>
                  <p>Scheduled · demo location</p>
                </article>
                <article className="mini-panel">
                  <span className="eyebrow">DOSSIER</span>
                  <strong>{readyCount} / {documents.length} ready</strong>
                  <p>{documents.length - readyCount} items remain.</p>
                </article>
                <article className="mini-panel mini-panel--source">
                  <span className="eyebrow">RULE SOURCE</span>
                  <strong>Demo provider source</strong>
                  <p>High confidence · illustrative only</p>
                </article>
              </div>
            </div>
          </section>
        )}

        {view === 'eligibility' && (
          <section className="page">
            <PageHeader
              eyebrow="ELIGIBILITY"
              title={residenceVerified ? 'Known criteria met.' : 'You can apply.'}
              copy="Eligibility means meeting the known, published criteria attached to this demo case. It is not an acceptance prediction."
              status={<Pill tone="success">{eligibleCount} of 5 verified</Pill>}
            />

            <div className="eligibility-layout">
              <div className="criteria-list">
                {criteria.map((criterion) => (
                  <article className="criterion" key={criterion.label}>
                    <div className={`criterion__mark criterion__mark--${criterion.tone}`}>
                      {criterion.tone === 'success' ? <Icon name="check" size={17} /> : <Icon name="info" size={17} />}
                    </div>
                    <div className="criterion__copy">
                      <strong>{criterion.label}</strong>
                      <p>{criterion.detail}</p>
                    </div>
                    <Pill tone={criterion.tone}>{criterion.status}</Pill>
                  </article>
                ))}
              </div>

              <aside className="decision-card">
                <span className="eyebrow">DECISION SUPPORT</span>
                <h2>Unknown is a valid outcome.</h2>
                <p>Missing evidence remains explicit. KLAR. never turns missing data into a rejection or confidence score.</p>
                {!residenceVerified && (
                  <Button variant="soft" onClick={() => go('missing-data')}>Add residence details</Button>
                )}
                <Button onClick={() => go('dossier')}>Continue to dossier <Icon name="arrow" /></Button>
                <div className="source-note"><Icon name="info" size={16} /><span>Demo rule pack · not legal advice</span></div>
              </aside>
            </div>
          </section>
        )}

        {view === 'missing-data' && (
          <section className="page page--narrow">
            <PageHeader
              eyebrow="NEEDS REVIEW"
              title="One criterion needs input."
              copy="Ask only for the information required to evaluate the affected rule, then re-run that check."
              status={<Pill tone="warning">Needs input</Pill>}
            />
            <div className="form-card panel">
              <label>
                <span>Municipality of residence</span>
                <input value={municipality} onChange={(event) => setMunicipality(event.target.value)} />
              </label>
              <label>
                <span>Move-in date</span>
                <input type="date" value={moveInDate} onChange={(event) => setMoveInDate(event.target.value)} />
              </label>
              <div className="form-summary">
                <span className="eyebrow">WHY WE ASK</span>
                <p>These two fields are used only for the residence-duration criterion in this demo flow.</p>
              </div>
              <Button onClick={saveResidence} disabled={!moveInDate}>Save and recheck <Icon name="arrow" /></Button>
              <Button variant="ghost" onClick={() => go('eligibility')}>Cancel</Button>
            </div>
          </section>
        )}

        {view === 'no-rules' && (
          <section className="page page--narrow">
            <PageHeader
              eyebrow="ELIGIBILITY"
              title="No verified criteria available."
              copy="The property can still be saved, compared and prepared. KLAR. does not infer requirements when the source is unavailable."
              status={<Pill>Unknown</Pill>}
            />
            <div className="empty-state panel">
              <div className="empty-state__icon"><Icon name="info" size={26} /></div>
              <span className="eyebrow">RULE PROVENANCE</span>
              <h2>No verified rule set</h2>
              <p>Continue as a tracker, add a visible rule manually, or contact the provider. An unverified assumption is never used as an eligibility rule.</p>
              <div className="button-row">
                <Button onClick={() => go('property')}>Save property</Button>
                <Button variant="soft" onClick={() => go('home')}>Back home</Button>
              </div>
            </div>
          </section>
        )}

        {view === 'not-eligible' && (
          <section className="page">
            <PageHeader
              eyebrow="ELIGIBILITY"
              title="One published criterion is not met."
              copy="Show the exact requirement and source context. Do not turn one failed criterion into a prediction about the landlord's final decision."
              status={<Pill tone="danger">Not eligible</Pill>}
            />
            <div className="eligibility-layout">
              <div className="criteria-list">
                <article className="criterion criterion--danger">
                  <div className="criterion__mark criterion__mark--danger"><Icon name="x" size={17} /></div>
                  <div className="criterion__copy"><strong>Residence duration</strong><p>Demo requirement: 2 years · demo household data: 14 months</p></div>
                  <Pill tone="danger">Not met</Pill>
                </article>
                <article className="criterion">
                  <div className="criterion__mark criterion__mark--success"><Icon name="check" size={17} /></div>
                  <div className="criterion__copy"><strong>Household size</strong><p>Requirement met</p></div>
                  <Pill tone="success">Verified</Pill>
                </article>
                <article className="criterion">
                  <div className="criterion__mark criterion__mark--success"><Icon name="check" size={17} /></div>
                  <div className="criterion__copy"><strong>Income threshold</strong><p>Requirement met</p></div>
                  <Pill tone="success">Verified</Pill>
                </article>
              </div>
              <aside className="decision-card">
                <span className="eyebrow">NEXT ACTION</span>
                <h2>No dead end.</h2>
                <p>If the provider allows exceptions, the user can still contact them. Otherwise the case can be archived without losing the decision history.</p>
                <Button variant="soft" onClick={() => go('archived')}><Icon name="archive" /> Archive case</Button>
                <Button variant="ghost" onClick={() => go('home')}>Keep for reference</Button>
              </aside>
            </div>
          </section>
        )}

        {view === 'dossier' && (
          <section className="page">
            <PageHeader
              eyebrow="DOSSIER READINESS"
              title={`${readyCount} of ${documents.length} ready.`}
              copy="A reusable household dossier with property-specific requirements layered on top."
              status={<Pill tone={dossierReady ? 'success' : 'warning'}>{dossierReady ? 'Ready to submit' : `${documents.length - readyCount} missing`}</Pill>}
            />

            <div className="dossier-layout">
              <div className="document-list">
                {documents.map((document) => (
                  <article className="document-row" key={document.label}>
                    <div className="document-icon"><Icon name="file" /></div>
                    <div className="document-row__copy">
                      <strong>{document.label}</strong>
                      <p>{document.meta}</p>
                    </div>
                    <Pill tone={document.status === 'Ready' ? 'success' : 'warning'}>{document.status}</Pill>
                  </article>
                ))}
              </div>

              <aside className="decision-card decision-card--sticky">
                <span className="eyebrow">APPLICATION READINESS</span>
                <h2>{dossierReady ? 'Package ready.' : 'Two items need attention.'}</h2>
                <p>Eligibility and dossier completeness remain separate so the user always knows what is blocking submission.</p>
                {!dossierReady && <Button variant="soft" onClick={resolveMissingDocuments}>Complete demo documents</Button>}
                <Button disabled={!dossierReady} onClick={() => go('disclosure')}>Review sharing <Icon name="arrow" /></Button>
              </aside>
            </div>
          </section>
        )}

        {view === 'disclosure' && (
          <section className="page page--narrow">
            <PageHeader
              eyebrow="PRIVACY + DISCLOSURE"
              title="Confirm document sharing."
              copy="Review exactly which personal documents will leave the workspace before the application is submitted."
              status={<Pill tone="dark">Explicit consent</Pill>}
            />
            <div className="disclosure-card panel">
              <div className="recipient">
                <span className="eyebrow">RECIPIENT</span>
                <h2>Wohnraum Bern <small>(demo)</small></h2>
                <p>Aareweg 18 · application package</p>
              </div>
              <div className="share-list">
                {documents.filter((document) => document.status === 'Ready').slice(0, 4).map((document) => (
                  <div className="share-item" key={document.label}>
                    <span className="share-item__icon"><Icon name="lock" size={16} /></span>
                    <span>{document.label}</span>
                    <Pill>Included</Pill>
                  </div>
                ))}
              </div>
              <label className="consent-row">
                <input type="checkbox" checked={shareConfirmed} onChange={(event) => setShareConfirmed(event.target.checked)} />
                <span>I have reviewed the recipient and the document set.</span>
              </label>
              <div className="notice"><Icon name="info" size={17} /><span>Confirmation creates a disclosure record with recipient, file set and timestamp.</span></div>
              <Button className="button--wide" disabled={!dossierReady || !shareConfirmed} onClick={submitApplication}>Confirm + submit application</Button>
            </div>
          </section>
        )}

        {view === 'applications' && (
          <section className="page">
            <PageHeader
              eyebrow="APPLICATION TRACKER"
              title={submitted ? 'Awaiting response.' : 'No active applications.'}
              copy="Track process state without guessing what the provider will decide."
              status={<Pill tone={submitted ? 'dark' : 'warning'}>{submitted ? 'Submitted' : 'Not started'}</Pill>}
            />

            {submitted ? (
              <div className="tracker-layout">
                <div className="timeline panel">
                  {[
                    ['Viewing', 'Completed · 24 Sep', 'Done'],
                    ['Application', 'Submitted · 26 Sep', 'Sent'],
                    ['Disclosure', '4 documents recorded', 'Recorded'],
                    ['Provider response', 'No reply yet', 'Waiting'],
                  ].map(([label, meta, status], index) => (
                    <div className="timeline-row" key={label}>
                      <div className="timeline-index">0{index + 1}</div>
                      <div className="timeline-copy"><strong>{label}</strong><p>{meta}</p></div>
                      <Pill tone={status === 'Waiting' ? 'neutral' : 'success'}>{status}</Pill>
                    </div>
                  ))}
                </div>
                <aside className="decision-card">
                  <span className="eyebrow">NEXT</span>
                  <h2>History stays traceable.</h2>
                  <p>Later updates never rewrite what was known, submitted or disclosed at the time.</p>
                  <Button variant="soft" onClick={() => go('history')}>Open disclosure history</Button>
                </aside>
              </div>
            ) : (
              <div className="empty-state panel">
                <div className="empty-state__icon"><Icon name="clock" size={26} /></div>
                <h2>Nothing to track yet.</h2>
                <p>Prepare a property case and submit a demo application to see the tracker.</p>
                <Button onClick={() => go('home')}>Go to workspace</Button>
              </div>
            )}
          </section>
        )}

        {view === 'history' && (
          <section className="page">
            <PageHeader
              eyebrow="DISCLOSURE HISTORY"
              title="Know where your documents went."
              copy="A privacy layer for rental applications: recipient, document set, timestamp and application state remain visible."
              status={<Pill tone="dark">Privacy-aware</Pill>}
            />
            <div className="history-list">
              {submitted ? (
                <article className="history-card">
                  <div className="history-card__date"><span>26</span><small>SEP<br/>2026</small></div>
                  <div className="history-card__copy">
                    <span className="eyebrow">DEMO RECORD</span>
                    <h2>Wohnraum Bern</h2>
                    <p>Identity document · residence permit · debt register extract · income evidence</p>
                  </div>
                  <Pill tone="dark">Application active</Pill>
                </article>
              ) : (
                <article className="history-card history-card--muted">
                  <div className="history-card__date"><span>—</span><small>NO<br/>SHARE</small></div>
                  <div className="history-card__copy">
                    <span className="eyebrow">PRIVATE</span>
                    <h2>Nothing shared yet</h2>
                    <p>A draft does not create a disclosure record.</p>
                  </div>
                  <Pill>Private</Pill>
                </article>
              )}
              <article className="privacy-principle panel">
                <span className="eyebrow">PRIVACY PRINCIPLE</span>
                <h2>Sharing should create a visible trace.</h2>
                <p>KLAR. can record what the applicant sent. It cannot promise deletion or retention behavior inside a recipient's systems.</p>
              </article>
            </div>
          </section>
        )}

        {view === 'archived' && (
          <section className="page page--narrow">
            <PageHeader
              eyebrow="ARCHIVED CASE"
              title="Archived, not lost."
              copy="The property remains in decision history together with the evidence and disclosure context available at that time."
              status={<Pill>Read-only</Pill>}
            />
            <div className="archive-card panel">
              <div className="archive-card__icon"><Icon name="archive" size={26} /></div>
              <div>
                <span className="eyebrow">AAREWEG 18 · DEMO</span>
                <h2>Application closed</h2>
                <p>Eligibility snapshot preserved · dossier snapshot preserved · no active process.</p>
              </div>
              <Button variant="soft" onClick={() => go('property')}>Restore case</Button>
            </div>
          </section>
        )}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {nav.map((item) => (
          <button key={item.id} className={view === item.id ? 'mobile-nav__item mobile-nav__item--active' : 'mobile-nav__item'} onClick={() => go(item.id)}>
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
