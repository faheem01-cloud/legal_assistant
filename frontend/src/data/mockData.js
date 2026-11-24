// mockData.js - LegalMind AI Indian Legal Knowledge Base & Mock Data

export const SUGGESTION_PROMPTS = [
  {
    id: 'rights',
    title: 'Understand My Legal Rights',
    description: 'Explore statutory rights, remedies, and dispute resolution options for civil or consumer disputes.',
    prompt: 'What are my legal remedies under Indian law if a vendor breaches a commercial service contract and causes financial losses?'
  },
  {
    id: 'section',
    title: 'Explain a Legal Section',
    description: 'Deconstruct complex statutory language into clear, structured, plain-language insights.',
    prompt: 'Explain Section 138 of the Negotiable Instruments Act, 1881 regarding dishonour of cheques and the mandatory legal notice process.'
  },
  {
    id: 'document',
    title: 'Analyze a Legal Document',
    description: 'Identify high-risk clauses, indemnities, unilateral termination rights, and governing law.',
    prompt: 'What are the most critical risk clauses I should watch out for before signing an Indian commercial lease agreement?'
  }
];

export const QUICK_TOPIC_PILLS = [
  { label: 'Section 73 Contract Act', query: 'What damages can be claimed under Section 73 of the Indian Contract Act for breach of contract?' },
  { label: 'Cheque Bounce u/s 138', query: 'What is the procedure and timeline for sending a statutory demand notice for cheque bounce under Section 138 NI Act?' },
  { label: 'Consumer Court E-commerce', query: 'How do I file a grievance against an e-commerce platform for non-delivery under Consumer Protection Act 2019?' },
  { label: 'Cyber Fraud u/s 66D IT Act', query: 'What legal actions can be taken for online financial phishing fraud under the Information Technology Act 2000?' },
  { label: 'BNS 2023 vs IPC Provisions', query: 'What are the main changes introduced in Bharatiya Nyaya Sanhita 2023 regarding cheating and criminal breach of trust?' }
];

export const MOCK_RESPONSES = {
  default: {
    shortAnswer: "Under Indian jurisprudence, statutory remedies depend upon the precise nature of the contractual relationship, statutory obligations, and demonstrable direct losses incurred.",
    explanation: "Indian law requires establishing the existence of a valid legal relationship, an actionable default or breach, direct causal nexus with injury or damage, and mitigation of losses. Courts consistently reject claims for remote or indirect damages unless expressly contemplated by the parties at the time of agreement.",
    provisions: [
      {
        act: "The Indian Contract Act, 1872",
        section: "Section 73",
        title: "Compensation for loss or damage caused by breach of contract",
        summary: "Entitles the aggrieved party to receive compensation for any loss naturally arising in the usual course of things, excluding remote and indirect damages."
      },
      {
        act: "Specific Relief Act, 1963",
        section: "Section 10",
        title: "Specific performance in respect of contracts",
        summary: "Mandates that specific performance of a contract shall be enforced by the court subject to statutory exceptions under sections 11(2), 14, and 16."
      }
    ],
    steps: [
      "Gather and organize all primary evidentiary documents, invoices, signed agreements, and written correspondences.",
      "Calculate quantifiable actual damages incurred directly as a result of the breach.",
      "Issue a formal legal notice granting the defaulting party a statutory cure period (typically 15 to 30 days).",
      "Check whether the contract contains a mandatory pre-litigation mediation or arbitration clause under the Arbitration and Conciliation Act, 1996.",
      "Consult a qualified advocate enrolled with the Bar Council of India to evaluate jurisdiction and filing in competent civil or commercial courts."
    ],
    sources: [
      {
        id: 'src-1',
        title: 'Statutory Right to Damages for Breach',
        act: 'The Indian Contract Act, 1872',
        section: 'Section 73',
        citation: 'Act No. 9 of 1872 • Central Acts Corpus',
        page: 'Page 24, Chapter VI',
        relevanceScore: 98,
        category: 'Statute',
        excerpt: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it.',
        fullText: 'Section 73. Compensation for loss or damage caused by breach of contract: When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it.\n\nSuch compensation is not to be given for any remote and indirect loss or damage sustained by reason of the breach.\n\nExplanation: In estimating the loss or damage arising from a breach of contract, the means which existed of remedying the inconvenience caused by the non-performance of the contract must be taken into account.'
      },
      {
        id: 'src-2',
        title: 'Doctrine of Mitigation and Liquidated Damages',
        act: 'Supreme Court of India — Landmark Precedent',
        section: 'AIR 1969 SC 1205',
        citation: 'Maula Bux v. Union of India (1969) 2 SCC 554',
        page: 'Bench: Shah, J.C., Ramaswami, V., Mitter, G.K.',
        relevanceScore: 94,
        category: 'Case Law',
        excerpt: 'Under Section 74 read with Section 73 of the Contract Act, in every case of breach of contract the person aggrieved by the breach is not required to prove actual loss where liquidated damages are a genuine pre-estimate; but where loss is ascertainable, proof of actual loss must be established.',
        fullText: 'The Court observed: For forfeiture of earnest money or security deposit to be valid under Section 74 of the Indian Contract Act, it must represent a genuine pre-estimate of damages. In cases where the loss caused by breach can be conveniently assessed by the court, the party claiming compensation must lead evidence of actual loss suffered.'
      },
      {
        id: 'src-3',
        title: 'Specific Performance Mandatory Regime',
        act: 'Specific Relief Act, 1963',
        section: 'Section 10 (as amended by Act 18 of 2018)',
        citation: 'Central Acts • Ministry of Law and Justice',
        page: 'Page 8, Part II',
        relevanceScore: 89,
        category: 'Statute',
        excerpt: 'The specific performance of a contract shall be enforced by the court subject to the provisions contained in sub-section (2) of section 11, section 14 and section 16. The 2018 Amendment removed judicial discretion and made specific performance a general rule.',
        fullText: 'Prior to the 2018 amendment, specific performance was an equitable, discretionary remedy. Post the Specific Relief (Amendment) Act 2018, the word "may" was replaced with "shall", making specific performance of contracts mandatory under Indian law, unless barred under section 14 (non-enforceable contracts) or section 16 (personal bars to relief).'
      }
    ],
    disclaimer: "LegalMind AI is an informational and research technology platform, not a law firm. This analysis does not constitute legal advice or create an attorney-client relationship. Indian legal provisions must be verified against current official gazette notifications and assessed by an advocate."
  },

  cheque: {
    shortAnswer: "Under Section 138 of the Negotiable Instruments Act, 1881, dishonour of a cheque due to insufficiency of funds constitutes a quasi-criminal offence punishable with imprisonment up to 2 years, a fine up to twice the cheque amount, or both.",
    explanation: "To institute proceedings under Section 138, strict statutory timelines must be strictly adhered to. The Supreme Court has held that timeline compliance is jurisdictional: presentation within 3 months, statutory demand notice within 30 days of receiving the dishonour memo, 15 days cure period for the drawer, and filing the criminal complaint under Section 142 within 30 days after expiry of the 15-day period.",
    provisions: [
      {
        act: "Negotiable Instruments Act, 1881",
        section: "Section 138",
        title: "Dishonour of cheque for insufficiency, etc., of funds in the account",
        summary: "Creates statutory liability when a cheque drawn for discharge of a legally enforceable debt is returned unpaid."
      },
      {
        act: "Negotiable Instruments Act, 1881",
        section: "Section 142",
        title: "Cognizance of offences and Territorial Jurisdiction",
        summary: "Mandates complaint in writing before a Judicial Magistrate First Class / Metropolitan Magistrate within whose jurisdiction the branch where the payee maintains an account is situated."
      },
      {
        act: "Negotiable Instruments Act, 1881",
        section: "Section 139",
        title: "Presumption in favour of holder",
        summary: "Statutory presumption that the holder of the cheque received it for the discharge of a debt or liability, shifting the burden of proof to the accused."
      }
    ],
    steps: [
      "Obtain the original dishonoured cheque along with the official Bank Return Memo showing reason (e.g. 'Funds Insufficient' or 'Exceeds Arrangement').",
      "Draft and send a formal Statutory Legal Demand Notice within 30 days of the date of the Bank Return Memo via Registered Post AD or Speed Post.",
      "Provide the drawer exactly 15 clear days from the date of receipt/delivery of the notice to make the payment.",
      "If the drawer fails to make payment within 15 days, draft a criminal complaint under Section 138 r/w Section 142 of NI Act.",
      "File the complaint before the competent Judicial Magistrate / Metropolitan Magistrate Court within 30 days of the cause of action arising."
    ],
    sources: [
      {
        id: 'ni-src-1',
        title: 'Statutory Presumption and Dishonour Framework',
        act: 'The Negotiable Instruments Act, 1881',
        section: 'Section 138 & Section 139',
        citation: 'Act No. 26 of 1881 • Central Legislation',
        page: 'Chapter XVII, Sections 138-148',
        relevanceScore: 99,
        category: 'Statute',
        excerpt: 'Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid...',
        fullText: 'Section 138 mandates: (a) Cheque presented within validity period (3 months); (b) Payee makes demand in writing within 30 days of receipt of bank memo; (c) Drawer fails to make payment within 15 days of notice receipt. Section 139 establishes a reverse burden of proof.'
      },
      {
        id: 'ni-src-2',
        title: 'Jurisdiction of Section 138 Complaints',
        act: 'Supreme Court of India — Constitution Bench',
        section: 'AIR 2014 SC 3519',
        citation: 'Dashrath Rupsingh Rathod v. State of Maharashtra & 2015 Amendment',
        page: 'Bench: R.M. Lodha, C.J., T.S. Thakur, J.',
        relevanceScore: 96,
        category: 'Case Law',
        excerpt: 'Following the 2015 Amendment Ordinance and Act, Section 142(2) specifically provides that the complaint shall be inquired into and tried only by a court within whose local jurisdiction the branch of the bank where the payee maintains the account is situated.',
        fullText: 'Under Section 142(2)(a), if the cheque is delivered for collection through an account, the court within whose local jurisdiction the branch of the bank where the payee maintains the account is located shall have exclusive territorial jurisdiction to try the complaint.'
      }
    ],
    disclaimer: "LegalMind AI is an informational legal assistant. Cheque bounce proceedings involve strict limitation periods under Section 142. Please instruct an advocate immediately upon receipt of a bank memo."
  },

  consumer: {
    shortAnswer: "Under the Consumer Protection Act, 2019, consumers have statutory rights against unfair trade practices, defective goods, and deficiency in services, enforceable before District, State, and National Consumer Disputes Redressal Commissions.",
    explanation: "The 2019 Act repealed the 1986 Act, introducing e-commerce liability, product liability (Chapter VI), and e-filing via the e-Daakhil portal. District Commissions have pecuniary jurisdiction up to ₹50 Lakhs (as revised by 2021 Rules), with no court fee required for claims up to ₹5 Lakhs.",
    provisions: [
      {
        act: "Consumer Protection Act, 2019",
        section: "Section 2(47)",
        title: "Unfair Trade Practice definition",
        summary: "Includes misleading advertisements, failure to issue bill/cash memo, refusing to refund payment within stipulated timeframe."
      },
      {
        act: "Consumer Protection Act, 2019",
        section: "Section 35",
        title: "Manner in which complaint shall be made",
        summary: "Allows filing a complaint physically or electronically through the e-Daakhil portal at the consumer's place of residence or work."
      },
      {
        act: "Consumer Protection Act, 2019",
        section: "Section 84",
        title: "Liability of product manufacturer & service provider",
        summary: "Holds manufacturers and e-commerce platforms liable for harm caused by defective products or deceptive service claims."
      }
    ],
    steps: [
      "Preserve order confirmations, payment receipts, screenshots of product descriptions, and communication with customer support.",
      "Lodge a formal grievance on the National Consumer Helpline (NCH) portal (consumerhelpline.gov.in) or call 1915.",
      "Send a written legal notice to the seller and the marketplace aggregator providing 15 days for full refund or replacement.",
      "If unaddressed, register on the e-Daakhil portal (edaakhil.nic.in) and file an electronic consumer complaint before the competent District Consumer Commission.",
      "Claim refund, interest, compensation for mental agony, and litigation costs under Section 39 of the Act."
    ],
    sources: [
      {
        id: 'copra-1',
        title: 'Consumer Protection (Consumer Disputes Redressal Commissions) Rules, 2021',
        act: 'Consumer Protection Act, 2019',
        section: 'Pecuniary Jurisdiction Rules 2021',
        citation: 'Notification G.S.R. 892(E) • Ministry of Consumer Affairs',
        page: 'Pecuniary Limits Revision',
        relevanceScore: 97,
        category: 'Statute',
        excerpt: 'District Commission: Claims not exceeding ₹50 Lakhs. State Commission: Claims exceeding ₹50 Lakhs but not exceeding ₹2 Crores. National Commission: Claims exceeding ₹2 Crores.',
        fullText: 'The pecuniary jurisdiction of the District Commission is determined solely on the value of goods or services paid as consideration, rather than the total compensation claimed.'
      }
    ],
    disclaimer: "LegalMind AI is not a substitute for professional legal counsel. Consumer claims must be filed within the 2-year limitation period from the date the cause of action arose."
  }
};

export const MOCK_HISTORY = [
  {
    id: 'hist-1',
    title: 'Breach of Commercial Service Agreement Damages',
    date: 'Today, 2:15 PM',
    timestamp: '2026-11-19T14:15:00',
    category: 'Contract Law',
    preview: 'Under Section 73 of the Indian Contract Act, 1872, the aggrieved party is entitled to compensation for loss naturally arising in the usual course...',
    query: 'What are my legal remedies under Indian law if a vendor breaches a commercial service contract and causes financial losses?',
    sourcesCount: 3
  },
  {
    id: 'hist-2',
    title: 'Section 138 NI Act Cheque Bounce Procedure',
    date: 'Yesterday, 5:40 PM',
    timestamp: '2026-11-18T17:40:00',
    category: 'Banking & Negotiable Instruments',
    preview: 'Strict 30-day statutory notice requirement upon receiving the Bank Return Memo. Failure to comply results in jurisdictional bar under Section 142...',
    query: 'Explain Section 138 of the Negotiable Instruments Act, 1881 regarding dishonour of cheques and the mandatory legal notice process.',
    sourcesCount: 2
  },
  {
    id: 'hist-3',
    title: 'E-commerce Defective Goods Refund via e-Daakhil',
    date: '16 Nov 2026',
    timestamp: '2026-11-16T11:20:00',
    category: 'Consumer Protection',
    preview: 'Filing complaints under Consumer Protection Act 2019 and revised Pecuniary Jurisdiction Rules 2021 before District Commission...',
    query: 'How do I file a grievance against an e-commerce platform for non-delivery under Consumer Protection Act 2019?',
    sourcesCount: 1
  },
  {
    id: 'hist-4',
    title: 'Commercial Lease Unilateral Lock-in Clause Review',
    date: '12 Nov 2026',
    timestamp: '2026-11-12T16:05:00',
    category: 'Property & Tenancy',
    preview: 'Examining enforceable lock-in periods versus penalty clauses under Section 74 of the Indian Contract Act and Transfer of Property Act 1882...',
    query: 'What are the most critical risk clauses I should watch out for before signing an Indian commercial lease agreement?',
    sourcesCount: 3
  }
];

export const MOCK_LIBRARY_DATA = [
  {
    id: 'lib-1',
    title: 'The Constitution of India, 1950',
    category: 'Constitution of India',
    type: 'Supreme Law',
    year: '1950',
    chunksCount: '448 Articles, 12 Schedules',
    description: 'The supreme legal document governing the Republic of India, outlining fundamental rights (Part III), directive principles, and the structure of judiciary and legislature.',
    keySections: ['Article 14 - Right to Equality', 'Article 19 - Freedom of Speech & Trade', 'Article 21 - Right to Life & Personal Liberty', 'Article 32 - Constitutional Remedies (Writs)'],
    badge: 'Supreme Law of the Land'
  },
  {
    id: 'lib-2',
    title: 'The Indian Contract Act, 1872',
    category: 'Civil law',
    type: 'Central Legislation',
    year: '1872',
    chunksCount: '238 Sections • 14,200 Indexed Passages',
    description: 'Fundamental statute governing contract formation, consideration, voidable agreements, agency, indemnity, guarantee, bailment, and damages for breach.',
    keySections: ['Section 10 - What agreements are contracts', 'Section 27 - Agreement in restraint of trade void', 'Section 73 - Compensation for breach of contract', 'Section 74 - Liquidated damages and penalty'],
    badge: 'Core Commercial Code'
  },
  {
    id: 'lib-3',
    title: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
    category: 'Criminal law',
    type: 'Penal Code',
    year: '2023',
    chunksCount: '358 Sections • 22,400 Indexed Chunks',
    description: 'The modernized criminal code replacing the Indian Penal Code 1860, introducing community service, organized crime provisions, and reformed penal sentencing.',
    keySections: ['Section 103 - Murder definition & punishment', 'Section 316 - Criminal breach of trust', 'Section 318 - Cheating and dishonestly inducing delivery', 'Section 351 - Criminal intimidation'],
    badge: 'New Criminal Law 2024'
  },
  {
    id: 'lib-4',
    title: 'The Negotiable Instruments Act, 1881',
    category: 'Civil law',
    type: 'Commercial Statute',
    year: '1881',
    chunksCount: '148 Sections • 8,900 Indexed Passages',
    description: 'Regulates promissory notes, bills of exchange, and cheques, including criminal sanctions and procedural guidelines for dishonour under Section 138.',
    keySections: ['Section 138 - Dishonour of cheque', 'Section 139 - Presumption in favour of holder', 'Section 141 - Offences by companies', 'Section 142 - Cognizance of offences & jurisdiction'],
    badge: 'Banking & Commercial'
  },
  {
    id: 'lib-5',
    title: 'Consumer Protection Act, 2019',
    category: 'Consumer rights',
    type: 'Welfare Legislation',
    year: '2019',
    chunksCount: '107 Sections • 6,400 Indexed Passages',
    description: 'Establishes Central Consumer Protection Authority (CCPA), rules for e-commerce transactions, product liability claims, and dispute resolution via e-Daakhil.',
    keySections: ['Section 2(47) - Unfair trade practice', 'Section 35 - Filing consumer complaints', 'Section 84 - Product liability of manufacturer', 'Section 94 - Prevention of unfair trade in e-commerce'],
    badge: 'Consumer Welfare'
  },
  {
    id: 'lib-6',
    title: 'Information Technology Act, 2000',
    category: 'Cyber law',
    type: 'Technology Law',
    year: '2000',
    chunksCount: '94 Sections • 7,850 Indexed Passages',
    description: 'Provides legal recognition for electronic transactions, digital signatures, cyber contraventions, interception powers, and penalties for hacking and data theft.',
    keySections: ['Section 43 - Damage to computer system', 'Section 43A - Compensation for failure to protect data', 'Section 66C - Identity theft', 'Section 66D - Cheating by personation using computer'],
    badge: 'Cyber & Digital Law'
  },
  {
    id: 'lib-7',
    title: 'Digital Personal Data Protection Act, 2023 (DPDP)',
    category: 'Cyber law',
    type: 'Privacy Legislation',
    year: '2023',
    chunksCount: '44 Sections • 4,120 Indexed Chunks',
    description: 'Comprehensive regulatory framework for processing digital personal data, specifying obligations of Data Fiduciaries, Consent Managers, and rights of Data Principals.',
    keySections: ['Section 6 - Notice and consent requirements', 'Section 8 - General obligations of Data Fiduciary', 'Section 11 - Rights of Data Principal', 'Section 33 - Penalties up to ₹250 Crores'],
    badge: 'Data Privacy Standard'
  },
  {
    id: 'lib-8',
    title: 'Arbitration and Conciliation Act, 1996',
    category: 'Civil law',
    type: 'Dispute Resolution',
    year: '1996',
    chunksCount: '86 Sections • 11,500 Indexed Passages',
    description: 'Governs domestic and international commercial arbitrations, enforcement of foreign arbitral awards, and judicial non-intervention in commercial disputes.',
    keySections: ['Section 7 - Arbitration agreement', 'Section 9 - Interim measures by court', 'Section 11 - Appointment of arbitrators', 'Section 34 - Setting aside arbitral awards'],
    badge: 'ADR & Commercial'
  },
  {
    id: 'lib-9',
    title: 'Landmark Precedents — Supreme Court of India',
    category: 'Judgments',
    type: 'Case Law Reporter',
    year: '1950 - 2026',
    chunksCount: '25,000+ Precedents • 120,000 Citations',
    description: 'Curated corpus of authoritative Constitutional Bench and Division Bench judgments across contract interpretation, commercial equity, fundamental rights, and criminal jurisprudence.',
    keySections: ['Kesavananda Bharati v. State of Kerala (Basic Structure)', 'K.S. Puttaswamy v. Union of India (Right to Privacy)', 'Associate Builders v. DDA (Arbitral Award Scrutiny)', 'Satender Kumar Antil v. CBI (Bail Guidelines)'],
    badge: 'Judicial Precedents'
  }
];

export const MOCK_DOCUMENT_ANALYSIS = {
  fileName: 'Enterprise_Cloud_Services_Agreement_2026.pdf',
  fileSize: '2.4 MB',
  pageCount: 18,
  overview: {
    documentType: 'Master Services Agreement (MSA) & Cloud SLA',
    governingLaw: 'Laws of Republic of India; Exclusive Jurisdiction of Courts at Bengaluru, Karnataka',
    effectiveDate: '1st December 2026',
    parties: [
      { name: 'Apex Infrastructure Technologies Pvt. Ltd.', role: 'Service Provider / Vendor' },
      { name: 'IndoGlobal Retail Ventures Ltd.', role: 'Customer / Client' }
    ],
    contractValue: '₹36,00,000 per annum + 18% GST (Tier-1 Enterprise)',
    summary: 'A commercial B2B contract governing enterprise cloud hosting, data replication, and managed infrastructure services. While technical specifications are standard, several contractual clauses heavily favour the Service Provider with aggressive liability caps and asymmetrical indemnity.'
  },
  keyClauses: [
    {
      name: 'Clause 9.2 — Limitation of Liability',
      type: 'Liability',
      severity: 'high',
      text: 'Vendor liability for all claims arising out of this Agreement, whether in contract, tort, or negligence, is strictly capped at the aggregate fees paid in the immediately preceding 1 month.',
      commentary: 'Extremely aggressive limitation. If catastrophic data loss occurs, recovery is capped at 1 month fee (₹3,00,000) irrespective of business loss.'
    },
    {
      name: 'Clause 12.4 — Unilateral Termination for Convenience',
      type: 'Termination',
      severity: 'medium',
      text: 'Vendor may terminate this Agreement without cause upon giving 14 days prior written notice. Customer may only terminate upon 60 days prior written notice subject to early termination fees.',
      commentary: 'Asymmetrical termination clause. 14 days is insufficient to migrate enterprise cloud workloads without significant business interruption.'
    },
    {
      name: 'Clause 14.1 — IP & Data Ownership',
      type: 'Intellectual Property',
      severity: 'low',
      text: 'Customer retains all right, title, and interest in Customer Data. Vendor retains all IP rights in system analytics, telemetry, and platform enhancements.',
      commentary: 'Standard market clause protecting proprietary customer data, provided telemetry cannot be reverse-engineered to identify proprietary client metadata.'
    },
    {
      name: 'Clause 16.3 — Dispute Resolution & Arbitration',
      type: 'Dispute Resolution',
      severity: 'medium',
      text: 'All disputes shall be referred to sole arbitration seated in Bengaluru under Arbitration and Conciliation Act 1996. Sole arbitrator to be appointed solely by the Vendor.',
      commentary: 'Unilateral arbitrator appointment by one party violates Section 12(5) read with the Seventh Schedule of the Arbitration Act as affirmed in Perkins Eastman (SC 2019).'
    }
  ],
  obligations: [
    {
      party: 'Service Provider',
      title: 'Uptime & Service Level Guarantee',
      description: 'Maintain 99.9% monthly infrastructure availability. Service credits of 5% applied for each full 0.5% downtime below target.'
    },
    {
      party: 'Customer',
      title: 'Payment Terms & Invoicing',
      description: 'Remit quarterly recurring fees within 15 days of invoice date. Delayed payments attract penal interest at 18% per annum.'
    },
    {
      party: 'Service Provider',
      title: 'Data Protection & DPDP Act Compliance',
      description: 'Implement reasonable technical safeguards in accordance with the Digital Personal Data Protection Act, 2023.'
    }
  ],
  datesAndDeadlines: [
    { label: 'Agreement Effective Date', date: '01 Dec 2026', type: 'milestone' },
    { label: 'Infrastructure Setup & UAT Completion', date: '15 Dec 2026', type: 'deadline' },
    { label: 'Quarterly Payment Milestone 1', date: '01 Jan 2027', type: 'payment' },
    { label: 'Annual Renewal Notice Window', date: '01 Oct 2027 to 31 Oct 2027', type: 'renewal' }
  ],
  potentialRisks: [
    {
      level: 'High Risk',
      title: 'Arbitration Clause Unilateral Appointment Invalid under Indian Law',
      description: 'Clause 16.3 gives the vendor sole authority to appoint the arbitrator. The Supreme Court in Perkins Eastman Architects DVM v. HSCC (India) Ltd. (2019) settled that an interested party cannot unilaterally nominate the sole arbitrator. This clause would face immediate challenge under Section 11(6) of the Arbitration Act.',
      recommendation: 'Negotiate mutual appointment or institutional arbitration via DIAC or MCIA.'
    },
    {
      level: 'High Risk',
      title: 'Disproportionate 1-Month Liability Cap vs Business Exposure',
      description: 'The liability cap of 1 month (₹3 Lakhs) fails to reflect potential damages from data breaches, non-compliance with CERT-In directions, or severe cloud outages.',
      recommendation: 'Carve out data security breaches, gross negligence, and IP infringement from the general liability cap, and raise the cap to 12 months fees.'
    },
    {
      level: 'Medium Risk',
      title: 'Short 14-Day Vendor Termination Notice',
      description: 'Vendor can shut down infrastructure on 14 days notice, creating severe operational vulnerability for mission-critical applications.',
      recommendation: 'Demand minimum 60 days notice with mandatory transition assistance obligations.'
    }
  ],
  lawyerQuestions: [
    'Should we challenge the unilateral arbitrator appointment in Clause 16.3 and insist on an institutional body like Bangalore International Mediation and Arbitration Centre?',
    'Can we carve out gross negligence and statutory DPDP Act data breach penalties from the aggregate liability limitation in Clause 9.2?',
    'What exit assistance and data handover SLAs must be added under Indian law before agreeing to the 14-day vendor termination clause?'
  ]
};
