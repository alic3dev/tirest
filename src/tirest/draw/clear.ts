export function drawClear(ctx: CanvasRenderingContext2D) {
  ctx.reset()
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.fillStyle = '#00000006'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.strokeStyle = '#000000'
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
