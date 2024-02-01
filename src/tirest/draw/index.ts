import { drawBlock } from './block'
import { drawClear } from './clear'
import { drawField } from './field'
import { drawHoldingWindow } from './holdingWindow'
import { drawPreviewWindow } from './previewWindow'
import { drawScore } from './score'

export {
  drawBlock,
  drawClear,
  drawField,
  drawHoldingWindow,
  drawPreviewWindow,
  drawScore,
}

export default {
  block: drawBlock,
  clear: drawClear,
  field: drawField,
  holdingWindow: drawHoldingWindow,
  previewWindow: drawPreviewWindow,
  score: drawScore,
}
