// VoiceService — mock STT / language ID, real browser TTS.
// Real Bhashini/Whisper/AI4Bharat integration can replace transcribe()
// and detectLanguage() later without changing callers.

const MOCK_TRANSCRIPTS = [
  'She grew up in Assam, used to teach mathematics, loves Bihu songs, and usually drinks tea in the morning.',
  'He worked as a government clerk for many years, enjoys playing carrom, and likes Naga folk songs.',
  'She was a weaver for over forty years, loves talking about her loom, and enjoys Khasi folk chants.',
]

export const VoiceService = {
  /** Mock transcription — in the real system this calls Whisper/Bhashini STT. */
  async transcribe(_audioBlob?: Blob): Promise<string> {
    await delay(1200)
    return MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)]
  },

  /** Mock language identification. */
  async detectLanguage(_audioBlob?: Blob): Promise<string> {
    await delay(400)
    return 'Assamese'
  },

  /** Real text-to-speech via the browser's SpeechSynthesis API — no API key needed. */
  speak(text: string, language = 'en-IN') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = languageToBcp47(language)
    utterance.rate = 0.95
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  },

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  },
}

function languageToBcp47(language: string): string {
  const map: Record<string, string> = {
    Assamese: 'en-IN',
    Khasi: 'en-IN',
    Meitei: 'en-IN',
    Nepali: 'ne-NP',
    'Ao (Nagamese/English mixed)': 'en-IN',
    'Bengali / Kokborok': 'bn-IN',
    English: 'en-IN',
  }
  return map[language] ?? 'en-IN'
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
