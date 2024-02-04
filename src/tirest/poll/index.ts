import { pollPaused } from 'tirest/poll/paused'
import { pollPlaying } from 'tirest/poll/playing'
import { pollGameOver } from 'tirest/poll/gameOver'

export { pollPaused, pollPlaying, pollGameOver }

export default {
  paused: pollPaused,
  playing: pollPlaying,
  gameOver: pollGameOver,
}
