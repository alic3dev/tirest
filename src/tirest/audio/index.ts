import { Synth, Channel, utils } from 'zer0'

const noteTable = utils.createNoteTable(0, 6, utils.frequencyRoots.magic)

let _audioContext: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (_audioContext) return _audioContext

  _audioContext = new window.AudioContext()

  return _audioContext
}

let _mainChannel: Channel | null = null

function getMainChannel(audioContext: AudioContext): Channel {
  if (_mainChannel) return _mainChannel

  _mainChannel = new Channel(audioContext, audioContext.destination, false)
  _mainChannel.gain.gain.value = 0.2

  return _mainChannel
}

let _synth: Synth | null = null

function getSynth(audioContext: AudioContext): Synth {
  if (_synth) return _synth

  const channel: Channel = getMainChannel(audioContext)

  const bpm: number = 60

  _synth = new Synth(audioContext, undefined, channel.destination)
  _synth.setBPM(bpm)
  const synthTwo = new Synth(audioContext, undefined, channel.destination)

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

      _synth!.playNote(
        // @ts-expect-error
        noteTable[
          highNotes[i] === 'A' || highNotes[i] === 'B' || highNotes[i] === 'G#'
            ? 4
            : 5
        ][highNotes[i]],
        i,
      )
    }

    for (let i: number = 0; i < lowNotes.length; i++) {
      if (!lowNotes[i]) continue
      synthTwo.playNote(
        // @ts-expect-error
        noteTable[lowNotes[i] === 'A' || lowNotes[i] === 'G#' ? 2 : 3][
          lowNotes[i]
        ],
        i,
      )
    }

    setTimeout((): void => {
      playNotes()
    }, totalDuration * 1000)
  }

  playNotes()

  return _synth
}

export function start(): void {
  const audioContext: AudioContext = getAudioContext()

  const synth: Synth = getSynth(audioContext)
}
