const converter = [
  {
    placeholder: '###YourIdeaIdHasNewComments###',
    convertedText: 'notification.postNotificationText',
    title: 'notification.postNotificationTitle',
  },
  {
    placeholder: '###YouHaveBeenAddedToNewTeam###',
    convertedText: 'notification.teamNotificationText',
    title: 'notification.teamNotificationTitle',
  },
];

export function convertPlaceholderToNotification(placeholder: string): string {
  let notification = placeholder;

  converter.map(value => {
    if (value.placeholder === placeholder) {
      notification = value.convertedText;
      return;
    }
  });

  return notification;
}

export function convertPlaceholderToTitle(placeholder: string): string {
  let title = placeholder;

  converter.map(value => {
    if (value.placeholder === placeholder) {
      title = value.title;
      return;
    }
  });

  return title;
}
