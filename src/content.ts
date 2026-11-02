// All copy lives here — edit this file to change what the site says.
// Numbers marked "sample" are placeholders until real case-study data exists.

export const site = {
  brand: 'Strand',
  tagline: 'AI agency',
  email: 'hello@strand.agency',
  socials: [
    { label: 'LinkedIn', href: '#' },
    { label: 'X', href: '#' },
    { label: 'Instagram', href: '#' },
  ],
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
  ],
  cta: 'Book a call',
}

export const hero = {
  lines: ['We build', 'AI agents'],
  lead: 'that',
  rotating: ['think.', 'sell.', 'support.', 'scale.'],
  sub: 'Strand is an AI agency. We design, build and run agents and automations that take real work off your team’s plate.',
}

export const intent = {
  lines: ['From what your', 'team does by hand', 'to what runs', 'on its own.'],
  sub: 'We map the work, find what an agent can own, and wire it into the tools you already use.',
  nodes: ['Workflow', 'Agent', 'System'],
}

export const services = {
  lines: ['We design the', 'agents.', 'And the systems', 'behind them.'],
  items: [
    {
      title: 'AI Agents',
      body: 'Agents for sales, support and ops that plan, use your tools and hand off to a human when it matters.',
      tags: ['Tool use', 'Memory', 'Guardrails'],
    },
    {
      title: 'Automation',
      body: 'Replace copy-paste work across CRM, inbox, sheets and internal tools with pipelines that don’t break.',
      tags: ['APIs', 'Webhooks', 'n8n'],
    },
    {
      title: 'Voice & Chat',
      body: 'Assistants on web, WhatsApp and phone that answer, qualify and book — around the clock.',
      tags: ['Voice', 'WhatsApp', 'Web chat'],
    },
    {
      title: 'AI Products',
      body: 'Full-stack apps with an LLM at the core: retrieval, evals, dashboards and the infra to run them.',
      tags: ['RAG', 'Evals', 'Next.js'],
    },
  ],
  marquee: ['AI Agents', 'Automation', 'Voice AI', 'RAG', 'Copilots', 'Evals', 'Integrations', 'Workflows'],
}

export const work = [
  {
    id: 'sales',
    num: '01',
    tag: 'AI Sales Agent',
    ghost: 'OUTBOUND',
    desc: 'An outbound agent that finds leads, writes the first message and books meetings on autopilot.',
    result: { value: 3.4, decimals: 1, suffix: '×', label: 'more meetings booked' }, // sample
  },
  {
    id: 'support',
    num: '02',
    tag: 'Support Agent',
    ghost: 'SUPPORT',
    desc: 'A WhatsApp and web agent that resolves most tickets before a human ever sees them.',
    result: { value: 68, decimals: 0, suffix: '%', label: 'tickets auto-resolved' }, // sample
  },
  {
    id: 'ops',
    num: '03',
    tag: 'Ops Copilot',
    ghost: 'SIGNAL',
    desc: 'A copilot that watches every metric, explains what changed and drafts the fix.',
    result: { value: 11, decimals: 0, suffix: ' hrs', label: 'saved per manager, weekly' }, // sample
  },
]

export const process = {
  lines: ['How we', 'ship it.'],
  steps: [
    { title: 'Discover', when: 'Week 0', body: 'One workshop. We map your workflows and pick the highest-ROI agent to build first.' },
    { title: 'Prototype', when: 'Week 1', body: 'A working agent on your real data in days — not a slide deck.' },
    { title: 'Build', when: 'Weeks 2–5', body: 'Integrations, guardrails, evals and a dashboard your team will actually open.' },
    { title: 'Run & scale', when: 'Ongoing', body: 'We monitor, tune and roll the next workflow onto the same foundation.' },
  ],
}

export const about = {
  lines: ['AI should feel', 'like your best', 'new hire.'],
  body: 'Not a chatbot bolted onto your website. Strand builds agents that understand your business, work inside your tools and get better every week — with people in the loop where it counts.',
  signature: 'Small senior team. Big leverage.',
  stats: [
    // sample
    { value: 40, decimals: 0, suffix: '+', label: 'Agents in production' },
    { value: 1.2, decimals: 1, suffix: 'M', label: 'Tasks automated' },
    { value: 6, decimals: 0, suffix: ' wks', label: 'Idea to production' },
  ],
}

export const contact = {
  lines: ['Got work that', 'should run itself?', "Let's talk."],
  cta: 'Book a call',
}
