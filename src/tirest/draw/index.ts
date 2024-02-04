import { drawBlock } from './block'
import { drawClear } from './clear'
import { drawField } from './field'
import { drawHoldingWindow } from './holdingWindow'
import { drawPreviewWindow } from './previewWindow'
import { drawInfo } from './info'

export {
  drawBlock,
  drawClear,
  drawField,
  drawHoldingWindow,
  drawPreviewWindow,
  drawInfo,
}

export default {
  block: drawBlock,
  clear: drawClear,
  field: drawField,
  holdingWindow: drawHoldingWindow,
  previewWindow: drawPreviewWindow,
  info: drawInfo,
}
