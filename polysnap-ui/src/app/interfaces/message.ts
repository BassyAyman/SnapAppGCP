export interface Message {
  sender: string,
  receiver: string,
  content: string,
  durationInMinutes: number,
  creationDate: Date | null,
}
