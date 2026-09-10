import type { ExtractedProfileField } from '../types'
import { newId } from './id'

// ProfileExtractionService — deterministic keyword-based extraction so the
// "Talk once -> Build the profile" demo is predictable. A real LLM/NLU
// pipeline can replace this function without changing callers.
const RULES: { pattern: RegExp; field: string; category: ExtractedProfileField['category'] }[] = [
  { pattern: /assam\b/i, field: 'Region: Assam', category: 'place' },
  { pattern: /meghalaya\b/i, field: 'Region: Meghalaya', category: 'place' },
  { pattern: /nagaland\b/i, field: 'Region: Nagaland', category: 'place' },
  { pattern: /manipur\b/i, field: 'Region: Manipur', category: 'place' },
  { pattern: /te(a|ea)ch(er|ing)? mathematics|mathematics teacher/i, field: 'Occupation: Teacher (Mathematics)', category: 'occupation' },
  { pattern: /government clerk|clerk/i, field: 'Occupation: Government clerk', category: 'occupation' },
  { pattern: /weaver|weaving/i, field: 'Occupation: Weaver', category: 'occupation' },
  { pattern: /bihu/i, field: 'Music: Bihu songs', category: 'music' },
  { pattern: /naga folk/i, field: 'Music: Naga folk songs', category: 'music' },
  { pattern: /khasi folk/i, field: 'Music: Khasi folk chants', category: 'music' },
  { pattern: /carrom/i, field: 'Hobby: Carrom', category: 'hobby' },
  { pattern: /loom|weav/i, field: 'Interest: Weaving / loom', category: 'hobby' },
  { pattern: /mathematics/i, field: 'Interest: Mathematics', category: 'hobby' },
  { pattern: /morning tea|drinks tea in the morning/i, field: 'Routine: Morning tea', category: 'routine' },
]

export const ProfileExtractionService = {
  /** Extract structured Care & Memory Passport fields from a caregiver transcript. */
  async extract(transcript: string): Promise<ExtractedProfileField[]> {
    await new Promise((r) => setTimeout(r, 900))
    const found: ExtractedProfileField[] = []
    for (const rule of RULES) {
      if (rule.pattern.test(transcript)) {
        const [field, value] = rule.field.split(': ')
        found.push({
          id: newId('extract'),
          field,
          value,
          category: rule.category,
          status: 'pending',
        })
      }
    }
    return found
  },
}
