import { pollPaused } from './paused'
import { pollPlaying } from './playing'
import { pollGameOver } from './gameOver'

export { pollPaused, pollPlaying, pollGameOver }

export default {
  paused: pollPaused,
  playing: pollPlaying,
  gameOver: pollGameOver,
}
