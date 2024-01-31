import { drawBlock } from './block'
import { drawField } from './field'
import { drawHoldingWindow } from './holdingWindow'
import { drawPreviewWindow } from './previewWindow'
import { drawScore } from './score'

export { drawBlock, drawField, drawHoldingWindow, drawPreviewWindow, drawScore }

export default {
  block: drawBlock,
  field: drawField,
  holdingWindow: drawHoldingWindow,
  previewWindow: drawPreviewWindow,
  score: drawScore,
}
