export class ChatMessages {
  role: string
  content: string
}

export class CreateChatCompletionDto {
  messages: ChatMessages[];
}
