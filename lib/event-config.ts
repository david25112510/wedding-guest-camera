export const eventConfig = {
  couple: {
    firstName: "Lidieyne",
    secondName: "Alexandre",
    initials: ["L", "A"] as const,
  },
  date: "19.09.2026",
  maximumPhotosPerGuest: 24,
};

export const coupleNames =
  `${eventConfig.couple.firstName} & ${eventConfig.couple.secondName}`;
