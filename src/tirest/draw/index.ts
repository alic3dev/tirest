import { drawBlock } from 'tirest/draw/block'
import { drawClear } from 'tirest/draw/clear'
import { drawField } from 'tirest/draw/field'
import { drawHoldingWindow } from 'tirest/draw/holdingWindow'
import { drawPreviewWindow } from 'tirest/draw/previewWindow'
import { drawInfo } from 'tirest/draw/info'

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
