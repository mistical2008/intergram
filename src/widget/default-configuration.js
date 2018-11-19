export const defaultConfiguration = {
  titleClosed: "Начать чат с оператором!",
  titleOpen: "Чат с оператором",
  closedStyle: "chat", // button or chat
  closedChatAvatarUrl: "./media/demo_avatar.jpg", // only used if closedStyle is set to 'chat'
  cookieExpiration: 1, // in days. Once opened, closed chat title will be shown as button (when closedStyle is set to 'chat')
  introMessage: "Здравствуйте! Чем я могу вам помочь?",
  mangerName: "Елена",
  autoResponse:
    "Looking for the first available admin (It might take a minute)",
  autoNoResponse:
    "It seems that no one is available to answer right now. Please tell us how we can " +
    "contact you, and we will get back to you as soon as we can.",
  placeholderText: "Напишите ваше сообщение...",
  displayMessageTime: true,
  mainColor: "#107896",
  alwaysUseFloatingButton: false,
  desktopHeight: 450,
  desktopWidth: 370
};
