// Authoritative phrasing: the "say this, not that" swaps that make you sound in
// control in meetings, interviews and client calls.
//
// This is the *linguistic* side of articulation — word choice and framing, not
// pronunciation. Every swap is a real, usable line, and each one explains why the
// stronger version lands better. Pure data + pure helpers (no React, no DOM).

export const SWAP_CATEGORIES = [
  { id: 'apology', label: 'Apology → appreciation', blurb: 'Stop apologising for taking up space. Thank people instead.' },
  { id: 'hedge', label: 'Hedging → certainty', blurb: 'Drop the “just”, “kind of” and “I think maybe”.' },
  { id: 'permission', label: 'Permission → statement', blurb: 'State your position; don’t ask permission to have one.' },
  { id: 'filler', label: 'Filler → pause', blurb: 'Replace “um / like / you know” with a beat of silence.' },
  { id: 'ownership', label: 'Blame → ownership', blurb: 'Own the outcome without grovelling.' },
  { id: 'disagree', label: 'Hedged disagreement → clear', blurb: 'Disagree plainly, without going soft or sharp.' },
  { id: 'interrupt', label: 'Yielding → holding', blurb: 'Hold your thread when you get talked over.' },
  { id: 'feedback', label: 'Defensiveness → curiosity', blurb: 'Take feedback without shrinking or deflecting.' },
  { id: 'refuse', label: 'Soft no → clear no', blurb: 'Decline without over-explaining.' },
  { id: 'time', label: 'Panic → buying time', blurb: 'Buy a beat instead of rambling.' },
  { id: 'meeting', label: 'Passive → directing', blurb: 'Move meetings and decisions forward.' },
  { id: 'interview', label: 'Modesty → evidence', blurb: 'Answer with proof, not apologies.' }
]

export const SWAPS = [
  // apology -> appreciation
  { id: 'a1', category: 'apology', weak: 'Sorry I’m late.', strong: 'Thanks for waiting.', why: 'Gratitude reads as respect for their time; apology reads as guilt.' },
  { id: 'a2', category: 'apology', weak: 'Sorry to bother you.', strong: 'I’d value your input on this.', why: 'You are not a nuisance — you are asking a colleague to do their job.' },
  { id: 'a3', category: 'apology', weak: 'Sorry, I don’t understand.', strong: 'Help me understand that part.', why: 'Asks for clarity without making your confusion a fault.' },
  { id: 'a4', category: 'apology', weak: 'Sorry for the delay.', strong: 'Thanks for your patience — here’s where we landed.', why: 'Moves straight from apology to result.' },
  { id: 'a5', category: 'apology', weak: 'Sorry to jump in.', strong: 'Quick addition here.', why: 'Announces the contribution instead of begging for the floor.' },

  // hedging -> certainty
  { id: 'h1', category: 'hedge', weak: 'I just wanted to check in…', strong: 'I’m checking in on the delivery date.', why: '“Just” shrinks the ask to almost nothing.' },
  { id: 'h2', category: 'hedge', weak: 'I think maybe we could…', strong: 'I recommend we…', why: 'Recommendation is a decision-shaped sentence.' },
  { id: 'h3', category: 'hedge', weak: 'This might be a stupid idea, but…', strong: 'Here’s an option worth considering:', why: 'Never disqualify your own idea before they hear it.' },
  { id: 'h4', category: 'hedge', weak: 'It’s kind of a problem.', strong: 'This is a problem we need to solve.', why: 'Softeners make real risks sound optional.' },
  { id: 'h5', category: 'hedge', weak: 'I’m not sure if this is right, but…', strong: 'My read is this — tell me if you see it differently.', why: 'States a position and stays open, without pre-apologising.' },

  // permission -> statement
  { id: 'p1', category: 'permission', weak: 'Is it okay if I…?', strong: 'I’m going to… unless you’d rather otherwise.', why: 'Kills the round-trip while still giving them a veto.' },
  { id: 'p2', category: 'permission', weak: 'Can I make a suggestion?', strong: 'One suggestion:', why: 'Asking permission to help wastes the moment.' },
  { id: 'p3', category: 'permission', weak: 'Do you mind if I ask…?', strong: 'A question on that:', why: 'Framing beats asking leave to speak.' },
  { id: 'p4', category: 'permission', weak: 'Would it be alright to…?', strong: 'I’ll take that on.', why: 'Ownership, not a request.' },

  // filler -> pause
  { id: 'f1', category: 'filler', weak: 'Um, so, yeah…', strong: 'Here’s the position.', why: 'A full stop and a breath sound more certain than a filler.' },
  { id: 'f2', category: 'filler', weak: 'It’s, um, sort of done.', strong: 'It’s done.', why: 'Precision signals reliability.' },
  { id: 'f3', category: 'filler', weak: 'Honestly, basically, it’s fine.', strong: 'It’s fine.', why: '“Honestly/basically” imply the rest wasn’t.' },
  { id: 'f4', category: 'filler', weak: 'I mean, like, you know…', strong: '(pause) Let me put it simply.', why: 'Silence reads as thinking; fillers read as stalling.' },

  // blame -> ownership
  { id: 'o1', category: 'ownership', weak: 'It wasn’t my fault that…', strong: 'Here’s what happened and how I’m fixing it.', why: 'Leaders move to the fix, not the defence.' },
  { id: 'o2', category: 'ownership', weak: 'I dropped the ball, sorry.', strong: 'I missed that. Here’s the recovery plan.', why: 'Names the miss and immediately pairs it with action.' },
  { id: 'o3', category: 'ownership', weak: 'Nobody told me.', strong: 'Understood — here’s how I’ll adjust.', why: 'Explanation without blame.' },

  // hedged disagreement -> clear
  { id: 'd1', category: 'disagree', weak: 'Yeah, but…', strong: 'I see it differently — here’s why.', why: '“Yeah, but” makes them brace; this makes them listen.' },
  { id: 'd2', category: 'disagree', weak: 'I don’t know, I guess so.', strong: 'I don’t agree, and here’s my reasoning.', why: 'Agreeing to avoid friction is a debt you pay later.' },
  { id: 'd3', category: 'disagree', weak: 'That’s a terrible idea.', strong: 'I’d push back on that — the trade-off is…', why: 'Keeps the idea in the room and your credibility intact.' },
  { id: 'd4', category: 'disagree', weak: 'With respect, you’re wrong.', strong: 'Here’s the gap I see in that.', why: 'Attacks the gap, not the person.' },

  // yielding -> holding
  { id: 'i1', category: 'interrupt', weak: 'Sorry, sorry, go on.', strong: 'Yes — and to finish my point…', why: 'Acknowledges them and keeps your thread.' },
  { id: 'i2', category: 'interrupt', weak: 'No no, you first.', strong: 'Give me twenty seconds to land this.', why: 'A time-boxed ask is hard to refuse.' },
  { id: 'i3', category: 'interrupt', weak: '(trailing off when talked over)', strong: 'I’m not finished — one more line.', why: 'Calm and factual; it reclaims the floor.' },

  // defensiveness -> curiosity
  { id: 'fb1', category: 'feedback', weak: 'I know, I’m terrible at this.', strong: 'Good catch. I’ll fix that.', why: 'Self-criticism invites more criticism.' },
  { id: 'fb2', category: 'feedback', weak: 'You don’t understand the context.', strong: 'Let me add the context.', why: 'Same information, no accusation.' },
  { id: 'fb3', category: 'feedback', weak: 'I’ll try to do better.', strong: 'Here’s the specific change I’ll make.', why: '“Try” is a promise to attempt; a change is a commitment.' },

  // soft no -> clear no
  { id: 'n1', category: 'refuse', weak: 'I can’t, sorry, I’m really swamped.', strong: 'I can’t take that on this week. I could next week.', why: 'A clear no plus a real alternative.' },
  { id: 'n2', category: 'refuse', weak: 'Maybe, I’ll try.', strong: 'No — but here’s what I can do.', why: '“Maybe” costs everyone a follow-up.' },
  { id: 'n3', category: 'refuse', weak: 'I’d love to but…', strong: 'That’s not one for me right now.', why: 'No fake enthusiasm to soften a no.' },

  // panic -> buying time
  { id: 't1', category: 'time', weak: 'Uhh, that’s a good question…', strong: 'Good question — let me give you a considered answer.', why: 'Buys a beat and frames the pause as care.' },
  { id: 't2', category: 'time', weak: 'I don’t know, I’ve no idea.', strong: 'I don’t know yet. I’ll come back to you by three.', why: 'Not knowing is fine; no plan is not.' },
  { id: 't3', category: 'time', weak: 'Sooo, yeah, um…', strong: 'Let me take that in two parts.', why: 'Structured thinking sounds like command.' },

  // passive -> directing
  { id: 'm1', category: 'meeting', weak: 'Does that make sense?', strong: 'What questions do you have?', why: 'Assumes clarity instead of doubting it.' },
  { id: 'm2', category: 'meeting', weak: 'We should probably maybe think about…', strong: 'Decision: we do X by Friday.', why: 'A decision sentence ends the drift.' },
  { id: 'm3', category: 'meeting', weak: 'Can we maybe schedule a call?', strong: 'Let’s take fifteen minutes on Thursday.', why: 'Proposes the concrete next step.' },
  { id: 'm4', category: 'meeting', weak: 'I’ll try to follow up.', strong: 'I’ll send the notes by end of day.', why: 'A date makes it real.' },

  // modesty -> evidence
  { id: 'v1', category: 'interview', weak: 'I’m a hard worker, I guess.', strong: 'I delivered X, which cut Y by Z%.', why: 'Evidence beats adjectives.' },
  { id: 'v2', category: 'interview', weak: 'I’ve only done a little of that.', strong: 'I’ve done that at small scale — here’s the result.', why: 'Frames the same fact as experience.' },
  { id: 'v3', category: 'interview', weak: 'I don’t have much experience.', strong: 'Here’s the closest thing I’ve done, and what I learned.', why: 'Redirects to transferable proof.' }
]

// --- helpers -----------------------------------------------------------------

export function swapsByCategory(categoryId) {
  return SWAPS.filter((s) => s.category === categoryId)
}

export function categoryById(id) {
  return SWAP_CATEGORIES.find((c) => c.id === id) || null
}

/** Which swap families each curriculum stage trains. */
export const STAGE_CATEGORIES = {
  1: ['apology', 'hedge', 'filler'],
  2: ['permission', 'hedge', 'time'],
  3: ['disagree', 'interrupt', 'feedback', 'interview'],
  4: ['refuse', 'ownership', 'meeting', 'interview']
}

export function categoriesForStage(stageId) {
  return STAGE_CATEGORIES[stageId] || STAGE_CATEGORIES[1]
}

/**
 * Three deterministic swaps for a given curriculum day. Rotates through the
 * stage's categories and positions so no two consecutive days repeat.
 */
export function swapsForDay(day, stageId) {
  const cats = categoriesForStage(stageId)
  const out = []
  const offset = Math.max(0, Math.round(day) - 1)
  for (let i = 0; i < 3; i++) {
    const cat = cats[(offset + i) % cats.length]
    const pool = swapsByCategory(cat)
    if (!pool.length) continue
    out.push(pool[(offset + i) % pool.length])
  }
  // de-duplicate while keeping order, backfill if short
  const seen = new Set()
  const unique = []
  for (const s of out) {
    if (!seen.has(s.id)) {
      seen.add(s.id)
      unique.push(s)
    }
  }
  let cursor = 0
  while (unique.length < 3 && cursor < SWAPS.length) {
    const s = SWAPS[(offset + cursor) % SWAPS.length]
    if (!seen.has(s.id)) {
      seen.add(s.id)
      unique.push(s)
    }
    cursor += 1
  }
  return unique.slice(0, 3)
}

/** Renew the phrasing in a situational prompt so the swap is actually used. */
export function practiceLine(swap) {
  return `Say the strong version out loud: “${swap.strong}”`
}
