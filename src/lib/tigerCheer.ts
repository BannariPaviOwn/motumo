/** Cart-add tiger cheer: plays a real roar sample (not TTS). */

const SOUND_SRC = '/sounds/tiger-roar.mp3'
const VOLUME = 0.6
/** Full sample is longer; keep the cheer punchy. */
const PLAY_MS = 2200

let audio: HTMLAudioElement | null = null
let stopTimer: number | undefined

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!audio) {
    audio = new Audio(SOUND_SRC)
    audio.preload = 'auto'
    audio.volume = VOLUME
  }
  return audio
}

export function playTigerCheer() {
  const el = getAudio()
  if (!el) return

  if (stopTimer !== undefined) {
    window.clearTimeout(stopTimer)
    stopTimer = undefined
  }

  try {
    el.pause()
    el.currentTime = 0
  } catch {
    // Ignoring seek errors on unloaded media
  }

  const playPromise = el.play()
  if (playPromise !== undefined) {
    void playPromise.catch(() => {
      // Autoplay / play() failures are expected in some browsers — ignore quietly
    })
  }

  stopTimer = window.setTimeout(() => {
    try {
      el.pause()
      el.currentTime = 0
    } catch {
      // ignore
    }
    stopTimer = undefined
  }, PLAY_MS)
}

/** Overlay duration aligned with the audible cheer window. */
export const TIGER_CHEER_MS = PLAY_MS
