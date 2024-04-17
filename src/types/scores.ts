export interface ScoreError {
  failed: boolean
  errorMessage: string
}

export interface Score {
  game_id: string
  level: number
  score: number
  submitted_timestamp: Date
}

export interface ScoreWithUser extends Score {
  uuid: string
  display_name: string
}

export interface ScoreResponse {
  lastTen: Score[] | ScoreError
  topTen: Score[] | ScoreError
}
