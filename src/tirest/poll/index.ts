import { pollPaused } from './paused'
import { pollPlaying } from './playing'

export { pollPaused, pollPlaying }

export default {
  paused: pollPaused,
  playing: pollPlaying,
}
