import { useMemo, useState } from 'react'

type View = 'home' | 'property' | 'eligibility' | 'dossier' | 'disclosure' | 'applications'
type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'dark'

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

const criteria: Criterion[] = [
  {
    label: 'Household size',
    detail: 'Minimum 2 people · Your household: 2',
    status: 'Verified',
    tone: 'success',
  },
  {
    label: 'Income threshold',
    detail: 'Within the published household range',
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
]

const initialDocuments: DocumentItem[] = [
  { label: 'Identity document', meta: 'Valid · shared with 2 providers', status: 'Ready' },
  { label: 'Residence permit', meta: 'Valid · shared with 1 provider', status: 'Ready' },
  { label: 'Debt register extract', meta: 'Valid until 14 Dec', status: 'Ready' },
  { label: 'Income evidence', meta: 'Updated 18 Sep', status: 'Ready' },
  { label: 'Cover letter', meta: 'Required for Aareweg 18', status: 'Missing' },
  { label: 'Second applicant form', meta: 'Required for this property', status: 'Missing' },
]

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`pill pill--${tone}`}>{children}</span>
}

function Icon({ name }: { name: 'home' | 'file' | 'lock' | 'check' | 'arrow' | 'plus' }) {
  const symbols = {
    home: '⌂',
    file: '▤',
    lock: '◈',
    check: '✓',
    arrow: '→',
    plus: '+',
  }
  return <span className="icon" aria-hidden="true">{symbols[name]}</span>
}

function App() {
  const [view, setView] = useState<View>('home')
  const [listingUrl, setListingUrl] = useState('')
  const [propertyAdded, setPropertyAdded] = useState(false)
  const [documents, setDocuments] = useState(initialDocuments)
  const [submitted, setSubmitted] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const readyCount = useMemo(
    () => documents.filter((document) => document.status === 'Ready').length,
    [documents],
  )

  function addProperty() {
    setPropertyAdded(true)
    setView('property')
  }

  function resolveMissingDocuments() {
    setDocuments((current) =>
      current.map((document) =>
        document.status === 'Missing' ? { ...document, status: 'Ready' } : document,
      ),
    )
  }

  function submitApplication() {
    setSubmitted(true)
    setView('applications')
  }

  const nav = [
    { id: 'home' as View, label: 'Home' },
    { id: 'applications' as View, label: 'Applications' },
    { id: 'dossier' as View, label: 'Dossier' },
    { id: 'disclosure' as View, label: 'Privacy' },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${showMobileMenu ? 'sidebar--open' : ''}`}>
        <button className="brand" onClick={() => setView('home')} aria-label="KLAR home">
          KLAR.
        </button>
        <nav className="sidebar__nav" aria-label="Primary navigation">
          {nav.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? 'nav-item nav-item--active' : 'nav-item'}
              onClick={() => {
                setView(item.id)
                setShowMobileMenu(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <Pill tone="neutral">Concept MVP</Pill>
          <p>Swiss rental decision workspace</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => setShowMobileMenu((value) => !value)}>
            KLAR.
          </button>
          <div className="topbar__meta">
            <span>Household workspace</span>
            <Pill tone="dark">2 applicants</Pill>
          </div>
        </header>

        {view === 'home' && (
          <section className="page page--home">
            <div className="hero">
              <Pill tone="dark">SWISS RENTAL WORKSPACE</Pill>
              <h1>Know before<br />you apply.</h1>
              <p>
                Understand published rental criteria, prepare the right dossier and keep track of where your personal documents go.
              </p>
            </div>

            <div className="add-property panel">
              <div>
                <span className="eyebrow">ADD A PROPERTY</span>
                <h2>Start with a listing you already found.</h2>
              </div>
              <div className="input-row">
                <input
                  value={listingUrl}
                  onChange={(event) => setListingUrl(event.target.value)}
                  placeholder="Paste Homegate, Flatfox or provider link"
                  aria-label="Property listing URL"
                />
                <button className="button button--dark" onClick={addProperty}>
                  <Icon name="plus" /> Add property
                </button>
              </div>
              <button className="text-button" onClick={addProperty}>Or add property manually →</button>
            </div>

            <div className="metric-grid">
              <button className="metric-card" onClick={() => setView('eligibility')}>
                <span className="eyebrow">ELIGIBILITY</span>
                <strong>{propertyAdded ? '1 property' : '0 properties'}</strong>
                <p>{propertyAdded ? '1 eligible · 1 item needs review' : 'Add a property to check known criteria.'}</p>
                <span className="card-link">View eligibility <Icon name="arrow" /></span>
              </button>
              <button className="metric-card" onClick={() => setView('dossier')}>
                <span className="eyebrow">DOSSIER</span>
                <strong>{readyCount} of {documents.length} ready</strong>
                <p>{documents.length - readyCount} items need attention before the next application.</p>
                <span className="card-link">Open dossier <Icon name="arrow" /></span>
              </button>
              <button className="metric-card" onClick={() => setView('disclosure')}>
                <span className="eyebrow">PRIVACY</span>
                <strong>{submitted ? '1 disclosure' : 'No disclosures yet'}</strong>
                <p>See what was shared, with whom and when.</p>
                <span className="card-link">View history <Icon name="arrow" /></span>
              </button>
            </div>
          </section>
        )}

        {view === 'property' && (
          <section className="page">
            <div className="page-heading">
              <div>
                <span className="eyebrow">PROPERTY CASE</span>
                <h1>Aareweg 18, Bern</h1>
                <p>One property becomes one decision case: criteria, dossier, application and disclosure stay connected.</p>
              </div>
              <Pill tone="neutral">Saved</Pill>
            </div>

            <div className="property-layout">
              <article className="panel property-hero-card">
                <div className="property-visual">
                  <span>3 rooms</span>
                  <strong>CHF 1’650</strong>
                  <small>Bern · Demo property</small>
                </div>
                <div className="property-copy">
                  <span className="eyebrow">KNOWN INFORMATION</span>
                  <h2>Municipal housing criteria</h2>
                  <p>Source is treated as a demo rule pack for this portfolio MVP. Final selection always remains with the provider.</p>
                  <button className="button button--dark" onClick={() => setView('eligibility')}>
                    Check eligibility <Icon name="arrow" />
                  </button>
                </div>
              </article>

              <div className="stack">
                <article className="mini-panel">
                  <span className="eyebrow">VIEWING</span>
                  <strong>24 Sep · 17:00</strong>
                  <p>Scheduled · Worbstrasse area</p>
                </article>
                <article className="mini-panel">
                  <span className="eyebrow">DOSSIER</span>
                  <strong>{readyCount} / {documents.length} ready</strong>
                  <p>{documents.length - readyCount} property-specific items remain.</p>
                </article>
              </div>
            </div>
          </section>
        )}

        {view === 'eligibility' && (
          <section className="page">
            <div className="page-heading">
              <div>
                <span className="eyebrow">ELIGIBILITY</span>
                <h1>You can apply.</h1>
                <p>Based on the known criteria currently attached to this demo property.</p>
              </div>
              <Pill tone="success">4 of 5 verified</Pill>
            </div>

            <div className="eligibility-layout">
              <div className="criteria-list">
                {criteria.map((criterion) => (
                  <article className="criterion" key={criterion.label}>
                    <div className="criterion__mark"><Icon name="check" /></div>
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
                <h2>Unknown ≠ not eligible.</h2>
                <p>Missing evidence stays visible and actionable. KLAR. does not convert uncertainty into a negative decision.</p>
                <button className="button button--dark" onClick={() => setView('dossier')}>
                  Continue to dossier <Icon name="arrow" />
                </button>
              </aside>
            </div>
          </section>
        )}

        {view === 'dossier' && (
          <section className="page">
            <div className="page-heading">
              <div>
                <span className="eyebrow">DOSSIER READINESS</span>
                <h1>{readyCount} of {documents.length} ready.</h1>
                <p>A reusable household dossier with property-specific requirements layered on top.</p>
              </div>
              <Pill tone={readyCount === documents.length ? 'success' : 'warning'}>
                {readyCount === documents.length ? 'Ready to submit' : `${documents.length - readyCount} missing`}
              </Pill>
            </div>

            <div className="dossier-layout">
              <div className="document-list">
                {documents.map((document) => (
                  <article className="document-row" key={document.label}>
                    <div className="document-icon"><Icon name="file" /></div>
                    <div>
                      <strong>{document.label}</strong>
                      <p>{document.meta}</p>
                    </div>
                    <Pill tone={document.status === 'Ready' ? 'success' : 'warning'}>{document.status}</Pill>
                  </article>
                ))}
              </div>

              <aside className="decision-card">
                <span className="eyebrow">APPLICATION READINESS</span>
                <h2>{readyCount === documents.length ? 'Package ready.' : 'Two items need attention.'}</h2>
                <p>KLAR. separates eligibility from dossier completeness so users know exactly what is blocking submission.</p>
                {readyCount !== documents.length && (
                  <button className="button button--secondary" onClick={resolveMissingDocuments}>
                    Complete demo documents
                  </button>
                )}
                <button
                  className="button button--dark"
                  disabled={readyCount !== documents.length}
                  onClick={() => setView('disclosure')}
                >
                  Review sharing <Icon name="arrow" />
                </button>
              </aside>
            </div>
          </section>
        )}

        {view === 'disclosure' && (
          <section className="page">
            <div className="page-heading">
              <div>
                <span className="eyebrow">PRIVACY + DISCLOSURE</span>
                <h1>{submitted ? 'Your sharing history.' : 'Confirm document sharing.'}</h1>
                <p>Personal documents should leave a visible trace instead of disappearing into email threads.</p>
              </div>
              <Pill tone="dark">Privacy-aware</Pill>
            </div>

            {!submitted ? (
              <div className="disclosure-card panel">
                <div>
                  <span className="eyebrow">RECIPIENT</span>
                  <h2>Wohnraum Bern <small>(demo)</small></h2>
                  <p>Aareweg 18 · application package</p>
                </div>
                <div className="share-list">
                  {documents.filter((document) => document.status === 'Ready').slice(0, 4).map((document) => (
                    <div className="share-item" key={document.label}>
                      <Icon name="lock" />
                      <span>{document.label}</span>
                      <Pill tone="neutral">Included</Pill>
                    </div>
                  ))}
                </div>
                <div className="notice">
                  Confirming creates a disclosure record with recipient, file set and timestamp.
                </div>
                <button
                  className="button button--dark button--wide"
                  disabled={readyCount !== documents.length}
                  onClick={submitApplication}
                >
                  Confirm + submit application
                </button>
              </div>
            ) : (
              <div className="history-list">
                <article className="history-card">
                  <div>
                    <span className="eyebrow">26 SEP 2026 · DEMO</span>
                    <h2>Wohnraum Bern</h2>
                    <p>Identity document · residence permit · debt register extract · income evidence</p>
                  </div>
                  <Pill tone="dark">Application active</Pill>
                </article>
              </div>
            )}
          </section>
        )}

        {view === 'applications' && (
          <section className="page">
            <div className="page-heading">
              <div>
                <span className="eyebrow">APPLICATION TRACKER</span>
                <h1>{submitted ? 'Awaiting response.' : 'No active applications.'}</h1>
                <p>Track application state without guessing what the provider will decide.</p>
              </div>
              <Pill tone={submitted ? 'neutral' : 'warning'}>{submitted ? 'Submitted' : 'Not started'}</Pill>
            </div>

            {submitted ? (
              <div className="timeline panel">
                {[
                  ['Viewing', 'Completed · 24 Sep', 'Done'],
                  ['Application', 'Submitted · 26 Sep', 'Sent'],
                  ['Disclosure', '4 files recorded', 'Recorded'],
                  ['Provider response', 'No reply yet', 'Waiting'],
                ].map(([label, meta, status], index) => (
                  <div className="timeline-row" key={label}>
                    <div className="timeline-index">0{index + 1}</div>
                    <div>
                      <strong>{label}</strong>
                      <p>{meta}</p>
                    </div>
                    <Pill tone={status === 'Waiting' ? 'neutral' : 'success'}>{status}</Pill>
                  </div>
                ))}
                <button className="text-button" onClick={() => setView('disclosure')}>Open disclosure history →</button>
              </div>
            ) : (
              <div className="empty-state panel">
                <span className="eyebrow">EMPTY STATE</span>
                <h2>Your applications will appear here.</h2>
                <p>First add a property, review eligibility and prepare the dossier.</p>
                <button className="button button--dark" onClick={() => setView('home')}>Add a property</button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
