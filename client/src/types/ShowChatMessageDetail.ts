export default interface ShowChatMessageDetail {
  sender: string;
  message: string;
  style: ShowChatMessageStyle;
}

type ShowChatMessageStyle =
  | "list-group-item-light"
  | "list-group-item-warning"
  | "list-group-item-danger"
  | "";
