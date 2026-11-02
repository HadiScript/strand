// Hand-built product shots — plain HTML/SVG so they animate, theme and stay crisp.

export function SalesMock() {
  const leads = [
    { name: 'Northwind Studio', ch: 'Email', status: 'Booked' },
    { name: 'Atlas Dental', ch: 'WhatsApp', status: 'Replied' },
    { name: 'Kite & Co.', ch: 'LinkedIn', status: 'Opened' },
    { name: 'Lumen Fitness', ch: 'Email', status: 'Queued' },
  ]
  return (
    <div className="mock mock-wide" data-thread="orbit" data-side="left">
      <div className="card card-main m-in">
        <div className="mock-top mono">
          <span>Campaign / Q4 outbound</span>
          <span className="live">
            <i /> Agent running
          </span>
        </div>
        <div className="mock-stats">
          <div>
            <b data-count="1240">0</b>
            <span className="mono">Leads found</span>
          </div>
          <div>
            <b data-count="62" data-suffix="%">0</b>
            <span className="mono">Open rate</span>
          </div>
          <div>
            <b data-count="37">0</b>
            <span className="mono">Meetings</span>
          </div>
        </div>
        <ul className="mock-rows">
          {leads.map((l) => (
            <li key={l.name} className="m-row">
              <span>{l.name}</span>
              <span className="mono dim">{l.ch}</span>
              <span className={`pill-tag tag-${l.status.toLowerCase()} mono`}>{l.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card float-br m-float">
        <div className="mono dim">Draft · written by agent</div>
        <p>
          Hi Sara — saw Northwind just launched online booking. We helped two studios cut no-shows by 30%…
          <span className="caret" />
        </p>
        <div className="mono draft-foot">
          <span>Personalised ✓</span>
          <span className="accent">Send →</span>
        </div>
      </div>

      <div className="card chip float-tl m-float2 mono">
        <span className="dot" /> Meeting booked · Thu 11:00
      </div>
    </div>
  )
}

export function SupportMock() {
  return (
    <div className="mock mock-phone" data-thread="orbit" data-side="right">
      <div className="phone m-in">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-top">
            <span className="avatar" />
            <span>
              <b>Strand Support</b>
              <small className="mono">Agent · replies instantly</small>
            </span>
          </div>
          <div className="chat">
            <p className="msg in m-row">Where’s my order #2048?</p>
            <p className="msg out m-row">It shipped this morning and arrives Thursday. Want live tracking here on WhatsApp?</p>
            <p className="msg in m-row">yes please 🙏</p>
            <p className="msg out m-row">Done — you’ll get updates as it moves. Anything else?</p>
            <p className="msg out typing m-row">
              <i />
              <i />
              <i />
            </p>
          </div>
          <div className="phone-input mono">Message…</div>
        </div>
      </div>

      <div className="card chip float-tl m-float mono">
        <span className="dot" /> Resolved in 38s · no human needed
      </div>
      <div className="card float-br small m-float2">
        <div className="mono dim">Handoff rule</div>
        <p>Refunds over $200 → route to Sara with full context.</p>
      </div>
    </div>
  )
}

export function OpsMock() {
  const bars = [38, 52, 44, 70, 58, 82, 66, 94, 76, 88, 72, 54]
  return (
    <div className="mock mock-wide" data-thread="orbit" data-side="left">
      <div className="card card-main m-in">
        <div className="mock-top mono">
          <span>Signups / last 12 days</span>
          <span className="live">
            <i /> Live
          </span>
        </div>
        <div className="mock-stats">
          <div>
            <b data-count="48.2" data-decimals="1" data-suffix="k">0</b>
            <span className="mono">Events / min</span>
          </div>
          <div>
            <b data-count="-18" data-suffix="%">0</b>
            <span className="mono">Android signups</span>
          </div>
          <div>
            <b data-count="3">0</b>
            <span className="mono">Open insights</span>
          </div>
        </div>
        <div className="chart">
          <div className="bars">
            {bars.map((h, i) => (
              <span key={i} className="bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden>
            <path
              className="chart-line"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              d="M0 80 C 25 70 30 60 50 62 S 85 40 100 45 S 140 20 160 30 S 200 12 220 18 S 270 30 300 46"
            />
          </svg>
        </div>
      </div>
      <div className="card float-br m-float">
        <div className="mono dim">Insight · just now</div>
        <p>Android signups fell 18% after v4.2 — the checkout button is hidden on small screens.</p>
        <div className="mono draft-foot">
          <span>Confidence high</span>
          <span className="accent">Fix drafted →</span>
        </div>
      </div>
    </div>
  )
}
