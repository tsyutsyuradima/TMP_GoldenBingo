export const CHOICE_TRIGGER_CONFIG = {
  triggerOnBingo: true,
  triggerOnMilestone: true,
  triggerEveryXBalls: 10, // Trigger "Binky's Choice" every 10 balls drawn
  triggerOnCombo: 3,      // Trigger if 3 cells are marked in a row (within a single draw session - though draws are single here, maybe just "every 3 marks")
  choiceDurationSeconds: 7,
};
