export interface Issue {
  body: string
  title: string
  number: number
  state: 'open' | 'closed'
}
