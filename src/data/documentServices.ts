import { GraduationCap, Heart, Baby, ShieldCheck, Building2, Landmark, type LucideIcon } from 'lucide-react';

export type AttestationService = {
  slug: string;
  title: string;
  navTitle: string;
  icon: LucideIcon;
  shortDescription: string;
  overview: string;
  workflow: string[];
  requiredDocuments: string[];
  processingTime: string;
  faqs: { question: string; answer: string }[];
};

export const attestationServices: AttestationService[] = [
  {
    slug: 'educational-certificate',
    title: 'Educational Certificate Attestation',
    navTitle: 'Educational',
    icon: GraduationCap,
    shortDescription:
      'Verification and legal attestation for SSC, HSC, Bachelor, Master degrees, marksheets, and transcripts.',
    overview:
      'Our educational certificate attestation service helps students and professionals authenticate their academic credentials for study, work, and migration abroad. We manage the complete chain of verification — from the issuing Education Board through the Ministry of Education and the Ministry of Foreign Affairs (MOFA) — and finally submit the documents to the target embassy for consular legalization. Every certificate is handled with a secure chain-of-custody so your original documents are returned safely.',
    workflow: ['Education Board', 'Ministry of Education', 'Ministry of Foreign Affairs (MOFA)', 'Target Embassy'],
    requiredDocuments: [
      'Original Degree/Diploma Certificate',
      'Academic Transcript / Marksheet',
      'Passport Copy',
      'NID Copy',
    ],
    processingTime: '3 to 7 Working Days',
    faqs: [
      {
        question: 'Do I need to submit original copies?',
        answer:
          'Yes. Ministry and embassy attestation requires the original degree, diploma, or marksheet. Photocopies cannot be attested. We return all originals to you once the process is complete.',
      },
      {
        question: 'How long does embassy stamping take?',
        answer:
          'After MOFA attestation, embassy consular stamping typically takes 1–3 working days, subject to the target embassy’s slot availability and submission queue.',
      },
      {
        question: 'Can you attest a provisional or pending certificate?',
        answer:
          'Embassies generally require the final certificate. In some cases a provisional certificate with a supporting letter may be accepted — our team will confirm the exact requirement for your target country.',
      },
    ],
  },
  {
    slug: 'marriage-certificate',
    title: 'Marriage Certificate Attestation',
    navTitle: 'Marriage',
    icon: Heart,
    shortDescription:
      'Official legalization of Nikahnama and Marriage Registration Certificates for family residence & spousal visas.',
    overview:
      'Marriage certificate attestation is essential for family residence permits, spousal visas, and dependent sponsorships abroad. We handle the full legalization chain — Notary Public, the Ministry of Law, and MOFA — before submitting to the target embassy. We also provide certified English translations of the original Bengali Nikahnama so the documents are accepted by foreign authorities.',
    workflow: ['Notary Public', 'Ministry of Law', 'Ministry of Foreign Affairs (MOFA)', 'Target Embassy'],
    requiredDocuments: [
      'Original Nikahnama (Bengali)',
      'Official English Translation',
      'Both Spouses’ Passport Copies',
      'NID Copies',
    ],
    processingTime: '3 to 5 Working Days',
    faqs: [
      {
        question: 'Do I need to submit original copies?',
        answer:
          'You must provide the original Nikahnama and Marriage Registration Certificate. A certified English translation is also required, which we can prepare on your behalf.',
      },
      {
        question: 'How long does embassy stamping take?',
        answer:
          'Once the Ministry of Law and MOFA attestation are complete, embassy stamping usually takes 1–3 working days, depending on the embassy’s consular schedule.',
      },
      {
        question: 'Is an English translation mandatory?',
        answer:
          'Most foreign embassies and immigration departments require an official English translation of the Bengali Nikahnama. We provide certified translation services as part of the package.',
      },
    ],
  },
  {
    slug: 'birth-certificate',
    title: 'Birth Certificate Attestation',
    navTitle: 'Birth',
    icon: Baby,
    shortDescription:
      'Legalization of Digital Government Birth Registration Certificates for child visa applications and family migration.',
    overview:
      'Birth certificate attestation supports child dependent visas, school admissions, and family migration. We verify your Digital Government Birth Registration Certificate (17-digit online-verified) at the local registrar level, then complete MOFA attestation and final embassy legalization. Our team ensures the online verification record matches the physical document before submission.',
    workflow: ['Local Registrar Verification', 'Ministry of Foreign Affairs (MOFA)', 'Target Embassy'],
    requiredDocuments: [
      'Original Digital Birth Certificate (17-digit online verified)',
      "Parents’ Passport Copies",
      'Parents’ NID Copies',
    ],
    processingTime: '2 to 4 Working Days',
    faqs: [
      {
        question: 'Do I need to submit original copies?',
        answer:
          'Yes, the original digital birth certificate print with the 17-digit verification number must be submitted. We verify it online before initiating attestation.',
      },
      {
        question: 'How long does embassy stamping take?',
        answer:
          'Because the registrar and MOFA steps are fast, embassy stamping generally finishes within 1–2 working days, subject to embassy availability.',
      },
      {
        question: 'What if the birth certificate is not yet online verified?',
        answer:
          'The certificate must be verified online through the registrar. If it is not yet digitized, we can advise you on the correction process before attestation begins.',
      },
    ],
  },
  {
    slug: 'police-clearance',
    title: 'Police Clearance Certificate',
    navTitle: 'Police Clearance',
    icon: ShieldCheck,
    shortDescription:
      'End-to-end assistance for obtaining and foreign ministry attestation of Bangladeshi Police Clearance Certificates.',
    overview:
      'A Police Clearance Certificate (PCC) is a core requirement for work visas, permanent residency, and long-stay immigration. We guide you through the complete online application, coordinate Special Branch verification, and handle MOFA attestation for international use. Our team manages the paperwork end-to-end so you avoid repeated visits to government offices.',
    workflow: ['Online Police Application', 'Verification by Special Branch', 'MOFA Attestation'],
    requiredDocuments: [
      'Valid Passport Copy (attested)',
      'Current Address Proof',
      '2 Passport-Size Lab Print Photos',
    ],
    processingTime: '7 to 12 Working Days',
    faqs: [
      {
        question: 'Do I need to submit original copies?',
        answer:
          'You need an attested passport copy, current address proof, and two passport-size lab print photos. The PCC itself is issued fresh through the online application we file for you.',
      },
      {
        question: 'How long does embassy stamping take?',
        answer:
          'PCC issuance and Special Branch verification take the majority of the time (7–12 days). MOFA attestation and embassy stamping then add 1–3 working days thereafter.',
      },
      {
        question: 'Can the PCC be obtained from abroad?',
        answer:
          'Bangladeshi PCC is normally processed from within Bangladesh. If you are overseas, we coordinate on your behalf using an authorized representative and a power of attorney.',
      },
    ],
  },
  {
    slug: 'commercial-documents',
    title: 'Commercial Documents Attestation',
    navTitle: 'Commercial',
    icon: Building2,
    shortDescription:
      'Legal verification for Trade Licenses, Incorporation Certificates, Bank Solvency, and Export/Import documents.',
    overview:
      'Commercial document attestation enables Bangladeshi businesses to operate, trade, and invest overseas. We legalize Trade Licenses, Certificate of Incorporation, Bank Solvency certificates, and export/import paperwork through the Chamber of Commerce, Ministry of Commerce, and MOFA, before final embassy attestation. Whether you are opening a branch abroad or bidding on an international tender, we ensure your corporate documents carry full legal weight.',
    workflow: [
      'Chamber of Commerce',
      'Ministry of Commerce',
      'Ministry of Foreign Affairs (MOFA)',
      'Target Country Embassy',
    ],
    requiredDocuments: [
      'Original Business Document',
      'Company Trade License',
      'Board Resolution / Authorization Letter',
    ],
    processingTime: '5 to 7 Working Days',
    faqs: [
      {
        question: 'Do I need to submit original copies?',
        answer:
          'Yes, the original business document plus your company Trade License and a Board Resolution or Authorization Letter must be provided for Chamber and Ministry verification.',
      },
      {
        question: 'How long does embassy stamping take?',
        answer:
          'After Chamber of Commerce, Ministry of Commerce, and MOFA attestation, embassy stamping generally takes 2–4 working days depending on the embassy’s workload.',
      },
      {
        question: 'Do you handle documents for multiple countries?',
        answer:
          'Absolutely. We attest commercial documents for any target country and coordinate with the relevant embassy in Dhaka for final consular legalization.',
      },
    ],
  },
  {
    slug: 'embassy-attestation',
    title: 'Embassy & Foreign Ministry Attestation',
    navTitle: 'Embassy',
    icon: Landmark,
    shortDescription:
      'Direct embassy submission services for UAE, Saudi Arabia (KSA), Qatar, Oman, Kuwait, and European embassies in Dhaka.',
    overview:
      'Our embassy attestation service provides direct, reliable submission to the consular sections of UAE, Saudi Arabia (KSA), Qatar, Oman, Kuwait, and European embassies based in Dhaka. After your documents are verified by MOFA in Dhaka, we handle the full embassy stamping process, tracking each file until it is returned with the official consular seal. This is the final — and most critical — step in making your documents legally valid abroad.',
    workflow: ['MOFA Dhaka Verification', 'Respective Foreign Embassy Consular Section Stamping'],
    requiredDocuments: [
      'MOFA-Attested Original Documents',
      'Passport Copy',
      'Job Offer / Sponsorship Letter',
    ],
    processingTime: '3 to 6 Working Days (subject to embassy slot availability)',
    faqs: [
      {
        question: 'Do I need to submit original copies?',
        answer:
          'Yes. Documents must already be MOFA-attested originals. You also need your passport copy and the relevant job offer or sponsorship letter for the embassy’s review.',
      },
      {
        question: 'How long does embassy stamping take?',
        answer:
          'Embassy stamping typically takes 3–6 working days. Timelines vary by mission and are subject to each embassy’s consular slot and submission calendar.',
      },
      {
        question: 'Which embassies do you support?',
        answer:
          'We support UAE, Saudi Arabia (KSA), Qatar, Oman, Kuwait, and major European embassies operating in Dhaka, along with other missions on request.',
      },
    ],
  },
];

export const getAttestationService = (slug: string): AttestationService | undefined =>
  attestationServices.find((service) => service.slug === slug);
