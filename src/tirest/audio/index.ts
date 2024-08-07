import type { Tirest } from 'tirest/types'

import { Synth, Channel, utils } from 'zer0'

const noteTable = utils.createNoteTable(0, 6, utils.frequencyRoots.magic)

let _audioContext: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (_audioContext) return _audioContext

  _audioContext = new window.AudioContext()

  return _audioContext
}

let _mainChannel: Channel | null = null
const FULL_GAIN_VALUE: number = 0.2

function getMainChannel(audioContext: AudioContext): Channel {
  if (_mainChannel) return _mainChannel

  _mainChannel = new Channel({
    audioContext,
    withAnalyser: false,
  })
  _mainChannel.gain.gain.value = FULL_GAIN_VALUE

  return _mainChannel
}

let _synth: Synth | null = null

function getSynth(audioContext: AudioContext): Synth {
  if (_synth) return _synth

  const channel: Channel = getMainChannel(audioContext)

  const bpm: number = 240

  _synth = new Synth({
    audioContext,
    channel,
    shouldSave: false,
  })
  _synth.setBPM(bpm)
  _synth.addOscillator('triangle', 0.5)

  const synthOffset = new Synth({
    audioContext,
    channel,
    shouldSave: false,
  })
  synthOffset.setBPM(bpm)
  synthOffset.removeOscillator(0)
  synthOffset.addOscillator('triangle', 0.333)

  synthOffset.setPortamento(0.025)
  synthOffset.setHold(1)
  synthOffset.setGainCurve([0, 0.3, 0.3, 0.0, 0.3, 0.75, 0.0, 0.3, 0.3, 0])

  const synthTwo = new Synth({
    audioContext,
    channel,
    shouldSave: false,
  })
  synthTwo.addOscillator('triangle', 0.25)

  const highNotes: string[] =
    `E B C D C B A  A C E D C B  C D E C A A  D F A G F E  C E D C B  B C D E C A A  E B C D C B A  A C E D C B  C D E C A A  D F A G F E  C E D C B  B C D E C A A  E C D B C A G# B  E C D B C E A G#  E B C D C B A  A C E D C B  C D E C A A  D F A G F E  C E D C B  B C D E C A A  E B C D C B A  A C E D C B  C D E C A A  D F A G F E  C E D C B  B C D E C A A  E C D B C A G# B  E C D B C E A G#  E B C D C B A  A C E D C B  C D E C A A  D F A G F E  C E D C B  B C D E C A A `.split(
      ' ',
    )

  const lowNotes: string[] =
    'E E A A G# E A  D D C C E E A  E E A A G# E A  D D C C E E A  A A G# G# A A G#  A A G# G# A A G#  E E A A G# E A  D D C C E E A  E E A A G# E A  D D C C E E A  A A G# G# A A G#  A A G# G# A A G#  E E A A G# E A  D D C C E E A '.split(
      ' ',
    )

  synthTwo.setBPM(bpm * (lowNotes.length / highNotes.length))

  const totalDuration: number = (60 / bpm) * (highNotes.length + 1)

  function playNotes() {
    for (let i: number = 0; i < highNotes.length; i++) {
      if (!highNotes[i]) continue

      const frequency: number = // @ts-expect-error
        noteTable[
          highNotes[i] === 'A' || highNotes[i] === 'B' || highNotes[i] === 'G#'
            ? 3
            : 4
        ][highNotes[i]]
      const offset: number = i ? i + (Math.sin(i * 6 + Math.PI / 2) + 1) / 4 : i //+ (Math.random() > 0.75 ? 0.6 : 0)

      _synth!.playNote(frequency, offset)
      synthOffset.playNote(frequency, offset + 0.1)
    }

    for (let i: number = 0; i < lowNotes.length; i++) {
      if (!lowNotes[i]) continue

      const offset: number = i // ? i + (Math.sin(i * 4 + Math.PI / 2) + 1) / 6 : i //+ (Math.random() > 0.75 ? 0.6 : 0)

      synthTwo.playNote(
        // @ts-expect-error
        noteTable[lowNotes[i] === 'A' || lowNotes[i] === 'G#' ? 2 : 3][
          lowNotes[i]
        ],
        offset,
      )
    }

    setTimeout((): void => {
      playNotes()
    }, totalDuration * 1000)
  }

  playNotes()

  return _synth
}

export function start(tirest: Tirest): void {
  const audioContext: AudioContext = getAudioContext()

  const mainChannel: Channel = getMainChannel(audioContext)
  const newGain: number = FULL_GAIN_VALUE * (tirest.settings.musicVolume / 100)

  if (newGain <= 0) {
    mainChannel.gain.gain.value = 0
  } else {
    mainChannel.gain.gain.exponentialRampToValueAtTime(
      newGain,
      audioContext.currentTime + 0.1,
    )
  }

  getSynth(audioContext)
}

export function stop(): void {
  const audioContext: AudioContext = getAudioContext()
  audioContext.close()

  _audioContext = null
  _mainChannel = null
  _synth = null
}
