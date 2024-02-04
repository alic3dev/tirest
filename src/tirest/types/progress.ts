export interface ProgressInfo {
  clearedLines: number
  score: number
}

export interface Progress {
  totals: ProgressInfo
  byLevel: ProgressInfo[]
}
