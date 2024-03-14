declare global {
  namespace Database {
    interface Alic3Dev {
      tirest_scores: Database.Table.Scores
      tirest_users: Database.Table.Users
    }
  }
}

export {}
