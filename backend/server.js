require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { createWorker } = require('tesseract.js');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const PORT = process.env.PORT || 5000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/api/upload-content', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file.' });
  }

  try {
    const extension = req.file.originalname.toLowerCase().split('.').pop();
    let text = '';
    if (extension === 'txt') {
      text = req.file.buffer.toString('utf8');
    } else if (extension === 'pdf') {
      text = (await pdfParse(req.file.buffer)).text;
    } else if (extension === 'docx') {
      text = (await mammoth.extractRawText({ buffer: req.file.buffer })).value;
    } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
      const worker = await createWorker('eng');
      const result = await worker.recognize(req.file.buffer);
      text = result.data.text;
      await worker.terminate();
    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    if (!text.trim()) {
      return res.status(422).json({ error: 'No readable text was found in this file.' });
    }
    return res.json({ text: text.trim() });
  } catch (error) {
    console.error('Unable to extract uploaded content:', error);
    return res.status(422).json({ error: 'Unable to read text from this file.' });
  }
});

// ============================================================================
// HELPER: AI + Rule-Based Compliance Checking Engine
// ============================================================================
async function runComplianceEngine(title, contentText, rules, facts) {
  // 1. Try Real Gemini AI Analysis first if GEMINI_API_KEY is present in .env
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `
You are Proofroom, an AI Brand Compliance Engine.
Analyze the following submitted marketing content against the company's Brand Vault Rules and Approved Facts.

BRAND RULES:
${JSON.stringify(rules, null, 2)}

APPROVED FACTS:
${JSON.stringify(facts, null, 2)}

SUBMITTED CONTENT TITLE: "${title}"
SUBMITTED CONTENT TEXT:
"""
${contentText}
"""

Identify any unsupported claims, factual mismatches, forbidden terminology, or exaggerated/off-brand tone in the SUBMITTED CONTENT TEXT.
Even if the text is short or generic, check if it makes any unverified claims, lacks brand grounding, or violates tone/terminology rules.
Return ONLY a valid JSON array of findings (between 1 to 4 findings). Each object in the array MUST have these exact keys:
[
  {
    "severity": "High" | "Medium" | "Low",
    "confidence": "High",
    "evidence_label": "Outdated/Conflicting" | "Conditional",
    "category_title": "Unsupported claim" | "Incorrect terminology" | "Tone issue",
    "issue_explanation": "Brief explanation of why this excerpt conflicts with the Brand Vault",
    "source_code": "Code + Title + Version from the closest matching Brand Rule or Approved Fact (e.g., F-014 · Packaging specification · v2.1)",
    "source_rule_summary": "The exact description or claim_statement from that Brand Rule or Approved Fact",
    "original_excerpt": "The exact sentence or phrase from SUBMITTED CONTENT TEXT",
    "suggested_correction": "A rewritten, brand-compliant version of that exact sentence"
  }
]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const rawJson = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsedFindings = JSON.parse(rawJson);
          if (Array.isArray(parsedFindings) && parsedFindings.length > 0) {
            return parsedFindings;
          }
        }
      }
    } catch (aiErr) {
      console.error('Gemini AI fallback triggered:', aiErr.message);
    }
  }

  // 2. Smart Dynamic Rule & Fact Matcher (works even without an API key)
  const findings = [];
  const sentences = contentText.match(/[^.!?]+[.!?]*/g) || [contentText];

  sentences.forEach((rawSentence) => {
    const sentence = rawSentence.trim();
    if (!sentence) return;
    const lower = sentence.toLowerCase();

    // Check Recycled / Packaging claims
    if (lower.includes('recycled') || lower.includes('plastic') || lower.includes('100%') || lower.includes('bottle')) {
      if (!lower.includes('80% recycled plastic, excluding the cap')) {
        const fact = facts.find((f) => f.fact_code === 'F-014') || facts[0];
        findings.push({
          severity: 'High',
          confidence: 'High',
          evidence_label: 'Outdated/Conflicting',
          category_title: 'Unsupported claim',
          issue_explanation: 'Packaging or percentage claim must match the verified specification.',
          source_code: fact ? `${fact.fact_code} · ${fact.title} · ${fact.version}` : 'F-014 · Packaging specification · v2.1',
          source_rule_summary: fact ? fact.claim_statement : 'Bottle body: 80% recycled plastic. Cap excluded.',
          original_excerpt: sentence,
          suggested_correction: 'Our bottles are made with 80% recycled plastic, excluding the cap.',
        });
      }
    }

    // Check Speed / Percentage claims
    if (lower.includes('50%') || lower.includes('faster') || lower.includes('best') || lower.includes('guaranteed')) {
      const fact = facts.find((f) => f.fact_code === 'F-016') || facts[1] || facts[0];
      findings.push({
        severity: 'High',
        confidence: 'High',
        evidence_label: 'Outdated/Conflicting',
        category_title: 'Unsupported claim',
        issue_explanation: 'Performance or sweeping claim conflicts with approved pilot metrics.',
        source_code: fact ? `${fact.fact_code} · ${fact.title} · ${fact.version}` : 'F-016 · Enterprise pilot · v1.0',
        source_rule_summary: fact ? fact.claim_statement : 'In a 2024 enterprise pilot, customer teams reduced manual processing by up to 23%.',
        original_excerpt: sentence,
        suggested_correction: 'In a 2024 enterprise pilot, customer teams reduced manual processing by up to 23%.',
      });
    }

    // Check all Brand Vault Rules dynamically
    rules.forEach((rule) => {
      if (!rule.forbidden_terms || rule.forbidden_terms.length === 0) return;

      const matchedTerm = rule.forbidden_terms.find((term) =>
        lower.includes(term.toLowerCase())
      );

      if (matchedTerm) {
        const correctedSentence = sentence.replace(
          new RegExp(matchedTerm, 'gi'),
          rule.preferred_term || 'refill concentrates'
        );
        findings.push({
          severity: rule.category === 'Terminology' ? 'Medium' : 'Low',
          confidence: 'High',
          evidence_label: rule.category === 'Terminology' ? 'Outdated/Conflicting' : 'Conditional',
          category_title: rule.category === 'Terminology' ? 'Incorrect terminology' : 'Tone issue',
          issue_explanation: `"${matchedTerm}" conflicts with approved Brand Vault guidelines.`,
          source_code: `${rule.rule_code} · ${rule.title} · ${rule.version}`,
          source_rule_summary: rule.description,
          original_excerpt: sentence,
          suggested_correction:
            rule.category === 'Terminology'
              ? correctedSentence
              : rule.preferred_term || "It's a simple step toward a less wasteful routine.",
        });
      }
    });
  });

  // 3. If user typed custom text that didn't trigger specific keywords, generate a dynamic Tone/Clarity check on their first sentence so Proof Cards always work on custom text!
  if (findings.length === 0 && sentences.length > 0) {
    const firstSentence = sentences[0].trim();
    const toneRule = rules.find((r) => r.category !== 'Terminology') || rules[0];
    findings.push({
      severity: 'Low',
      confidence: 'High',
      evidence_label: 'Conditional',
      category_title: 'Tone & brand alignment',
      issue_explanation: `Submitted draft ("${firstSentence.slice(0, 40)}...") should align with DemoBrand Co.'s calm, grounded brand voice and verified claims.`,
      source_code: toneRule ? `${toneRule.rule_code} · ${toneRule.title} · ${toneRule.version}` : 'G-001 · Calm, grounded voice · v2.0',
      source_rule_summary: toneRule ? toneRule.description : 'Use calm, practical, everyday language grounded in verified product facts.',
      original_excerpt: firstSentence,
      suggested_correction: `${firstSentence.replace(/[.!?]+$/, '')} — designed as a simple step toward a less wasteful routine.`,
    });
  }

  return findings;
}

// ============================================================================
// ROUTES
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running & connected to Proofroom backend!' });
});

// GET All Brand Vault Data (Rules, Facts, Assets)
app.get('/api/brand-vault', async (req, res) => {
  try {
    const { data: rules, error: rulesErr } = await supabase
      .from('brand_rules')
      .select('*');

    const { data: facts, error: factsErr } = await supabase
      .from('approved_facts')
      .select('*');

    const { data: assets, error: assetsErr } = await supabase
      .from('brand_assets')
      .select('*');

    if (rulesErr) console.error('brand_rules error:', rulesErr.message);
    if (factsErr) console.error('approved_facts error:', factsErr.message);
    if (assetsErr) console.error('brand_assets error:', assetsErr.message);

    res.json({
      rules: rules || [],
      facts: facts || [],
      assets: assets || [],
      debugErrors: {
        rules: rulesErr?.message || null,
        facts: factsErr?.message || null,
        assets: assetsErr?.message || null,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Add New Brand Rule (Brand Guidelines / Voice & Tone / Terminology)
app.post('/api/brand-vault/rules', async (req, res) => {
  try {
    const { rule_code, category, title, description, forbidden_terms, preferred_term, approved_by } = req.body;
    const isTerminology = category === 'Terminology';
    const prefix = isTerminology ? 'T' : 'G';

    const { data, error } = await supabase
      .from('brand_rules')
      .insert([
        {
          rule_code: rule_code || `${prefix}-0${Math.floor(10 + Math.random() * 89)}`,
          category: category || 'Brand Guidelines',
          title,
          description,
          ...(forbidden_terms ? { forbidden_terms } : {}),
          ...(preferred_term ? { preferred_term } : {}),
          version: 'v1.0',
          approved_by: approved_by || 'Elena Ruiz',
          status: 'Approved',
        },
      ])
      .select();

    if (error) {
      console.error('Brand rule insert error:', error);
      throw error;
    }
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Brand rule route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST Add New Approved Fact (Approved Facts and Claims)
app.post('/api/brand-vault/facts', async (req, res) => {
  try {
    const { fact_code, category, title, claim_statement, description, approved_by } = req.body;

    const { data, error } = await supabase
      .from('approved_facts')
      .insert([
        {
          fact_code: fact_code || `F-0${Math.floor(16 + Math.random() * 80)}`,
          title,
          claim_statement: claim_statement || description || '',
          version: 'v1.0',
          approved_by: approved_by || 'Nina Patel',
          status: 'Approved',
        },
      ])
      .select();

    if (error) {
      console.error('Approved fact insert error:', error);
      throw error;
    }
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Approved fact route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST Add New Brand Asset (Brand Logos and Assets)
app.post('/api/brand-vault/assets', async (req, res) => {
  try {
    const { asset_code, title, description, asset_type } = req.body;

    const { data, error } = await supabase
      .from('brand_assets')
      .insert([
        {
          asset_code: asset_code || `A-0${Math.floor(10 + Math.random() * 89)}`,
          title,
          asset_type: asset_type || 'Brand asset',
          description: description || '',
          version: 'v1.0',
          status: 'Approved',
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Content & Analyze
app.post('/api/reviews/analyze', async (req, res) => {
  try {
    const {
      title = 'A simpler clean — launch email',
      content_type = 'Email campaign',
      body_text,
      creator_name = 'Maya Lewis',
      creator_initials = 'ML',
      reviewId,
      content_version_id,
    } = req.body;

    const existingReviewId = reviewId || content_version_id || null;

    if (!body_text) {
      return res.status(400).json({ error: 'Content text is required' });
    }

    const { data: rules } = await supabase.from('brand_rules').select('*');
    const { data: facts } = await supabase.from('approved_facts').select('*');

    let contentVersion;

    if (existingReviewId) {
      // Re-analyze an existing In review item — update the same content_versions row
      const { data: updatedVersions, error: versionError } = await supabase
        .from('content_versions')
        .update({
          title,
          content_type,
          body_text,
          status: 'In review',
        })
        .eq('id', existingReviewId)
        .select();

      if (versionError) throw versionError;
      if (!updatedVersions || updatedVersions.length === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }
      contentVersion = updatedVersions[0];

      // Replace prior findings so re-review doesn't stack duplicate proof cards
      const { error: deleteCardsError } = await supabase
        .from('proof_cards')
        .delete()
        .eq('content_version_id', contentVersion.id);
      if (deleteCardsError) throw deleteCardsError;
    } else {
      const review_code = `PR-0${Math.floor(24 + Math.random() * 75)}`;

      // Insert Content Version securely without breaking .single()
      const { data: insertedVersions, error: versionError } = await supabase
        .from('content_versions')
        .insert([
          {
            review_code,
            title,
            content_type,
            version: 'v1.0',
            body_text,
            creator_name,
            creator_initials,
            status: 'In review',
          },
        ])
        .select();

      if (versionError) throw versionError;
      contentVersion = insertedVersions[0];
    }

    const detectedFindings = await runComplianceEngine(title, body_text, rules || [], facts || []);

    let insertedCards = [];
    if (detectedFindings.length > 0) {
      const cardsPayload = detectedFindings.map((f) => ({
        ...f,
        content_version_id: contentVersion.id,
        resolution_status: 'Open',
      }));

      const { data: cardsData, error: cardsError } = await supabase
        .from('proof_cards')
        .insert(cardsPayload)
        .select();

      if (cardsError) throw cardsError;
      insertedCards = cardsData;
    }

    res.status(existingReviewId ? 200 : 201).json({
      review: contentVersion,
      proofCards: insertedCards,
    });
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews/latest', async (req, res) => {
  try {
    const { data: reviews, error: revErr } = await supabase
      .from('content_versions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (revErr) throw revErr;
    if (!reviews || reviews.length === 0) {
      return res.json({ review: null, proofCards: [], passport: null });
    }

    const latestReview = reviews[0];

    const { data: proofCards } = await supabase
      .from('proof_cards')
      .select('*')
      .eq('content_version_id', latestReview.id)
      .order('created_at', { ascending: true });

    const { data: passports } = await supabase
      .from('release_passports')
      .select('*')
      .eq('content_version_id', latestReview.id)
      .limit(1);

    res.json({
      review: latestReview,
      proofCards: proofCards || [],
      passport: passports && passports.length > 0 ? passports[0] : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Specific Review by ID (for Dashboard row clicks)
app.get('/api/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: reviews, error: revErr } = await supabase
      .from('content_versions')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (revErr) throw revErr;
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = reviews[0];

    const { data: proofCards } = await supabase
      .from('proof_cards')
      .select('*')
      .eq('content_version_id', review.id)
      .order('created_at', { ascending: true });

    const { data: passports } = await supabase
      .from('release_passports')
      .select('*')
      .eq('content_version_id', review.id)
      .limit(1);

    res.json({
      review,
      proofCards: proofCards || [],
      passport: passports && passports.length > 0 ? passports[0] : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/proof-cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_status, exception_reason } = req.body;

    const { data, error } = await supabase
      .from('proof_cards')
      .update({ resolution_status, exception_reason })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reviewer_name = 'Elena Ruiz · Brand lead',
      decision = 'Approved',
      final_body_text,
    } = req.body;

    const { data: updatedVersions, error: updateErr } = await supabase
      .from('content_versions')
      .update({
        status: decision === 'Approved' ? 'Approved' : 'Changes requested',
        version: 'v1.1',
        ...(final_body_text ? { body_text: final_body_text } : {}),
      })
      .eq('id', id)
      .select();

    if (updateErr) throw updateErr;
    const updatedVersion = updatedVersions[0];

    await supabase.from('reviews').insert([
      {
        content_version_id: id,
        reviewer_name,
        decision,
        comments: 'All findings resolved against Brand Vault.',
      },
    ]);

    const { data: cards } = await supabase
      .from('proof_cards')
      .select('*')
      .eq('content_version_id', id);

    const passport_code = `RP-2026-0${Math.floor(24 + Math.random() * 75)}`;

    const { data: passports, error: passErr } = await supabase
      .from('release_passports')
      .upsert(
        [
          {
            passport_code,
            content_version_id: id,
            review_code: updatedVersion.review_code,
            approved_version: 'v1.1',
            reviewer_name,
            evidence_refs: (cards || []).map((c) => ({
              title: c.category_title,
              source: c.source_code,
            })),
            resolved_changes: (cards || []).map((c) => ({
              title: c.category_title,
              detail: `${c.original_excerpt} → ${c.suggested_correction}`,
              code: c.source_code.split(' · ')[0] + ' ↗',
            })),
            is_valid: decision === 'Approved',
          },
        ],
        { onConflict: 'passport_code' }
      )
      .select();

    if (passErr) throw passErr;

    res.json({
      review: updatedVersion,
      passport: passports[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. GET Dashboard Summary & Recent Reviews
app.get('/api/dashboard', async (req, res) => {
  try {
    const { data: reviews } = await supabase
      .from('content_versions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: openCards } = await supabase
      .from('proof_cards')
      .select('id')
      .eq('resolution_status', 'Open');

    res.json({
      reviews: reviews || [],
      openIssuesCount: (openCards || []).length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proofroom backend server is running on port ${PORT}`);
});