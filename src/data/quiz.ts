import type { Trait } from './types';

export interface QuizAnswer {
  label: string;
  /** Points added to each trait when picked. */
  points: Partial<Record<Trait, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'saturday',
    question: 'It’s Saturday morning. You are…',
    answers: [
      { label: 'In bed with a book and a hot chocolate. Do not perceive me.', points: { cozy: 3 } },
      { label: 'Already three hobbies deep, one of them involves glue.', points: { chaotic: 3 } },
      { label: 'Deep in a Wikipedia rabbit hole about octopuses.', points: { brainy: 2, gremlin: 1 } },
      { label: 'Getting ready for brunch I organised. Outfit: iconic.', points: { dramatic: 3 } },
    ],
  },
  {
    id: 'snack',
    question: 'Pick a snack. Choose wisely.',
    answers: [
      { label: 'Toast. Butter side up, ideally.', points: { cozy: 2, brainy: 1 } },
      { label: 'Whatever I dropped (five-second rule applies).', points: { gremlin: 3 } },
      { label: 'Spaghetti, dry, straight from the packet.', points: { chaotic: 2, gremlin: 1 } },
      { label: 'Chocolate, for my future Nobel Prize.', points: { dramatic: 2, brainy: 1 } },
    ],
  },
  {
    id: 'lab-animal',
    question: 'You are assigned a lab partner. It is an animal. Which one?',
    answers: [
      { label: 'A cat who is technically a liquid.', points: { cozy: 2, brainy: 1 } },
      { label: 'A wombat. Small, stubborn, iconic.', points: { gremlin: 2, chaotic: 1 } },
      { label: 'A pigeon who has opinions about Monet.', points: { dramatic: 2, brainy: 1 } },
      { label: 'A chicken with a fake dinosaur tail.', points: { chaotic: 3 } },
    ],
  },
  {
    id: 'group-chat',
    question: 'Your role in the group chat?',
    answers: [
      { label: 'Sends 40 voice notes then vanishes for a week.', points: { chaotic: 2, dramatic: 1 } },
      { label: '“Actually…” followed by a source.', points: { brainy: 3 } },
      { label: 'Only communicates in strange memes.', points: { gremlin: 3 } },
      { label: 'Remembers everyone’s birthday. Sends a cute sticker.', points: { cozy: 3 } },
    ],
  },
  {
    id: 'superpower',
    question: 'Choose a deeply scientific superpower.',
    answers: [
      { label: 'Levitating, like that frog.', points: { dramatic: 2, chaotic: 1 } },
      { label: 'Never spilling coffee ever again.', points: { cozy: 2, brainy: 1 } },
      { label: 'Chatting with fish in bubble language.', points: { gremlin: 3 } },
      { label: 'Detecting bad statistics from across the room.', points: { brainy: 3 } },
    ],
  },
  {
    id: 'stub-toe',
    question: 'You stub your toe. Your response?',
    answers: [
      { label: 'A very dramatic “OUCH”. It’s scientifically proven to help.', points: { chaotic: 1, dramatic: 2 } },
      { label: 'A quiet “ow” and an apology to the furniture.', points: { cozy: 3 } },
      { label: 'Immediately google the anatomy of the toe.', points: { brainy: 2, gremlin: 1 } },
      { label: 'Do it again to check the results replicate.', points: { chaotic: 3 } },
    ],
  },
  {
    id: 'paper-title',
    question: 'If you wrote a paper, its title would be…',
    answers: [
      { label: '“I Have Done A Lot Of Research And Nobody Asked”', points: { brainy: 2, dramatic: 1 } },
      { label: '“Why Is Everything Slightly Sticky: A Field Study”', points: { gremlin: 2, chaotic: 1 } },
      { label: '“Blankets: Are More Better? (Yes)”', points: { cozy: 3 } },
      { label: '“Me: A Retrospective”', points: { dramatic: 3 } },
    ],
  },
];

/** Archetypes shown on the result card, keyed by dominant trait. */
export const archetypes: Record<Trait, { title: string; blurb: string }> = {
  chaotic: {
    title: 'The Chaotic Experimentalist',
    blurb: 'You don’t have hypotheses, you have brilliant ideas at 2am. Goggles on, let’s go.',
  },
  cozy: {
    title: 'The Cosy Theorist',
    blurb: 'Your lab is a blanket fort and your research is impeccable. You run on warm drinks.',
  },
  brainy: {
    title: 'The Footnote Enjoyer',
    blurb: 'You read the methods section for fun. Peer reviewers fear you.',
  },
  gremlin: {
    title: 'The Mischief Maker',
    blurb: 'You ask the questions everyone else is too polite to ask. Science is better for it.',
  },
  dramatic: {
    title: 'The Main Character Scientist',
    blurb: 'Your research has a soundtrack. Your conference talks get standing ovations.',
  },
};
