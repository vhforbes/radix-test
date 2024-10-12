export interface UserCreatedEvent {
  email: string;
  name: string;
  confirmationToken: string;
}
