const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('scratch_faq_drawer.txt', 'utf8');

const demoIdx = content.indexOf('demo.tsx');
const startMarker = '"use client";';
const startIdx = content.indexOf(startMarker);
let tsxCode = content.substring(startIdx, demoIdx).trim();

// Replace default CARDS with MediQ cards
const mediqCards = `const CARDS = Object.freeze([
  Object.freeze({
    id: 'overview', tab: 'OVERVIEW',
    q: 'Who We Are & What We Do',
    a: 'MEDIQ, operating as Mediq Pharma and Medical Supplies Distribution, is a Philippine-based healthcare distribution and commercial development company connecting international medical manufacturers with healthcare professionals, hospitals, surgical centers, and institutions across the country. Established in specialized ophthalmic technologies, MEDIQ aims to build a diversified healthcare portfolio while retaining its commitment to product quality, technical understanding, responsive service, and sustainable partnerships.',
  }),
  Object.freeze({
    id: 'vision', tab: 'VISION',
    q: 'Our Strategic Vision',
    a: 'To become one of the Philippines\\' most trusted and forward-thinking healthcare solutions partners, advancing the accessibility, quality, and delivery of care through innovative products, responsible commercialization, and enduring partnerships.',
  }),
  Object.freeze({
    id: 'mission', tab: 'MISSION',
    q: 'Our Core Mission',
    a: 'To bridge global healthcare innovation with the evolving needs of the Philippine market by sourcing, marketing, promoting, selling, and distributing quality medical products and technologies, while providing healthcare professionals with reliable support, education, and service.',
  }),
  Object.freeze({
    id: 'commitments', tab: 'COMMIT',
    q: 'Our Four Pillars & Commitments',
    a: '• Innovation & Access: Identify relevant healthcare technologies and support wider access to quality solutions.\\n• Product Marketing: Build brand awareness, communicate product value, and develop ethical promotional campaigns.\\n• Commercial Excellence: Support launches, sales teams, institutional engagement, and market growth.\\n• Trust & Quality: Maintain responsible compliance, reliable supply, and long-term professional partnerships.',
  }),
  Object.freeze({
    id: 'commercialization', tab: 'MARKET',
    q: 'Bringing Products to Market',
    a: 'MEDIQ combines healthcare product knowledge with commercial strategy to build awareness, develop clinical demand, expand institutional adoption, and support sustainable surgical sales through evidence-based marketing, surgeon workshops, wet-lab training, and responsible commercial practice.',
  }),
]);`;

tsxCode = tsxCode.replace(/const CARDS = Object\.freeze\(\[[\s\S]*?\]\);/, mediqCards);

// Replace DEFAULTS
const mediqDefaults = `const DEFAULTS: Required<FaqDrawerOptions> = Object.freeze({
  label: 'About MEDIQ',
  title: 'Philippine Precision & Global Healthcare',
  lead: 'Bridging international ophthalmic and medical innovations with the evolving clinical needs of the Philippine healthcare ecosystem. Pull an index card to inspect our corporate profile, vision, mission, and commercial practice.',
  drawer: 'MEDIQ · PHARMA ARCHIVE',
  count: 5,
  open: '1',
  single: true,
  askNote: 'Need institutional distribution, clinical wet-lab certification, or product support?',
  askLabel: 'Contact Commercial Team',
  askHref: '#contact',
  finish: 'graphite',
});`;

tsxCode = tsxCode.replace(/const DEFAULTS: Required<FaqDrawerOptions> = Object\.freeze\(\{[\s\S]*?\}\);/, mediqDefaults);

fs.writeFileSync('components/ui/faq-drawer.tsx', tsxCode, 'utf8');
console.log('Saved components/ui/faq-drawer.tsx, size:', tsxCode.length);

const demoCode = `"use client";

import { FaqDrawer } from "@/components/ui/faq-drawer";

export default function FaqDrawerDemo() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1d40" }}>
      <FaqDrawer style={{ flex: 1 }} finish="graphite" />
    </div>
  );
}
`;

fs.writeFileSync('components/ui/faq-drawer-demo.tsx', demoCode, 'utf8');
console.log('Saved components/ui/faq-drawer-demo.tsx');

