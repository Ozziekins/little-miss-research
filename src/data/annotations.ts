import { medicineAndPopCultureNotes } from './collections/medicine-and-pop-culture';
import { psychologyAndTechNotes } from './collections/psychology-and-tech';
import { foodAndPhysicsNotes } from './collections/food-and-physics';
import { animalsAndMoreNotes } from './collections/animals-and-more';

/**
 * Little Miss's journal notes for each paper.
 *
 * - question:   the catchy hook used on the homepage ("Is a cat a liquid?")
 * - highlights: phrases highlighted in pastel marker. Must appear verbatim in the summary.
 * - vocab:      "new word!" margin notes. `word` must appear verbatim in the summary.
 * - scribble:   a short handwritten margin comment.
 */
export interface Annotation {
  question: string;
  highlights: string[];
  vocab?: { word: string; meaning: string }[];
  scribble?: string;
}

const originalNotes: Record<string, Annotation> = {
  'harry-potter-casts-a-spell-on-accident-prone-children': {
    question: 'Can a Harry Potter book keep kids out of hospital?',
    highlights: ['reading 700 pages of wizard drama instead of falling off things'],
    scribble: 'books = safety equipment ✓',
  },
  'the-greatest-magic-of-harry-potter-reducing-prejudice': {
    question: 'Can reading Harry Potter make you kinder?',
    highlights: ['Hermione would like everyone to know she has been saying this for years.'],
    vocab: [{ word: 'outgroups', meaning: 'people we see as “not like us”' }],
    scribble: '10 points to Gryffindor',
  },
  'the-hobbit-an-unexpected-deficiency': {
    question: 'Was Bilbo Baggins low on vitamin D?',
    highlights: ['eat a lot of second breakfasts', 'came home a braver hobbit'],
    vocab: [{ word: 'deficient', meaning: 'not getting enough of something' }],
    scribble: 'bilbo pls go outside',
  },
  'is-anakin-skywalker-suffering-from-borderline-personality-disorder': {
    question: 'What would a psychiatrist make of Anakin Skywalker?',
    highlights: ['They did not comment on the sand.'],
    vocab: [{ word: 'diagnostic criteria', meaning: 'the checklist doctors use to name a condition' }],
    scribble: 'i don’t like sand either tbh',
  },
  'traumatic-brain-injuries-in-the-asterix-comic-books': {
    question: 'How many bonks on the head happen in Asterix?',
    highlights: ['Comic-book skulls are very sturdy.'],
    scribble: '700+?!',
  },
  'trajectory-of-a-falling-batman': {
    question: 'Could Batman really glide on his cape?',
    highlights: ['less dramatic but much more comfy'],
    vocab: [{ word: 'glider', meaning: 'something that flies without an engine, using air to stay up' }],
    scribble: 'pack a parachute, bruce',
  },
  'when-zombies-attack-mathematical-modelling': {
    question: 'Would we survive a zombie outbreak? (Maths says…)',
    highlights: ['the last author really does put a question mark in his name'],
    vocab: [{ word: 'epidemiologists', meaning: 'scientists who study how diseases spread' }],
    scribble: 'Robert J. Smith? icon',
  },
  'childhood-pokemon-experience-visual-cortex': {
    question: 'Is there a Pokémon-shaped spot in your brain?',
    highlights: ['a distinct patch of visual cortex that responded to Pokémon'],
    vocab: [{ word: 'visual cortex', meaning: 'the part of the brain at the back that makes sense of what you see' }],
    scribble: 'pikachu lives here →',
  },
  'parachute-use-systematic-review-of-randomised-controlled-trials': {
    question: 'Is there proof that parachutes actually work?',
    highlights: ['They found none.', 'volunteer for the first one'],
    vocab: [{ word: 'randomised controlled trials', meaning: 'tests where people are randomly split into groups to compare a treatment fairly' }],
    scribble: 'not it!',
  },
  'parachute-use-randomized-controlled-trial': {
    question: 'What happens if you jump from a plane with an empty backpack?',
    highlights: ['the aircraft was on the ground, so the jump was about 60 cm'],
    scribble: 'always read the fine print',
  },
  'sword-swallowing-and-its-side-effects': {
    question: 'What are the side effects of swallowing swords?',
    highlights: ['“one at a time, please concentrate”'],
    vocab: [{ word: 'radiologist', meaning: 'a doctor who reads X-rays and scans' }],
    scribble: 'noted for later',
  },
  'roller-coaster-kidney-stones': {
    question: 'Can a roller coaster cure kidney stones?',
    highlights: ['Sitting at the back worked best.', 'this was not that kind of science'],
    scribble: 'best. study. ever.',
  },
  'didgeridoo-playing-sleep-apnoea': {
    question: 'Can playing the didgeridoo help you sleep?',
    highlights: ['though presumably more during the day'],
    vocab: [{ word: 'sleep apnoea', meaning: 'when breathing keeps pausing during sleep, often with snoring' }],
    scribble: 'sorry neighbours',
  },
  'santa-claus-a-public-health-pariah': {
    question: 'Is Santa a good health role model?',
    highlights: ['Santa has not yet replied to our letters.'],
    scribble: 'leave santa alone!!',
  },
  'why-rudolphs-nose-is-red': {
    question: 'Why is Rudolph’s nose red?',
    highlights: ['a scientifically respectable case for a red-nosed reindeer'],
    scribble: 'rudolph is valid ♡',
  },
  'sex-aggression-and-humour-responses-to-unicycling': {
    question: 'What do strangers shout at people on unicycles?',
    highlights: ['“lost your wheel?”'],
    vocab: [{ word: 'status-signalling', meaning: 'showing off to look important' }],
    scribble: 'haha he heard it 1000 times',
  },
  'flatulence-on-airplanes-just-let-it-go': {
    question: 'Should you hold it in on a plane?',
    highlights: ['charcoal-filled seat cushions'],
    scribble: 'airlines pls',
  },
  'the-nature-of-navel-fluff': {
    question: 'Where does belly-button fluff come from?',
    highlights: ['503 pieces of his own navel lint'],
    vocab: [{ word: 'navel', meaning: 'your belly button' }],
    scribble: 'he counted. all of them.',
  },
  'bottomless-bowls-portion-size-intake': {
    question: 'Would you notice if your soup never ran out?',
    highlights: ['with our eyes, not our stomachs'],
    vocab: [{ word: 'retracted', meaning: 'officially withdrawn by the journal' }],
    scribble: 'magic soup!!',
  },
  'on-the-rheology-of-cats': {
    question: 'Is a cat a liquid?',
    highlights: ['cats famously pour themselves into sinks, boxes and vases', 'a cat will fill a vase'],
    vocab: [{ word: 'Rheology', meaning: 'the science of how things flow' }],
    scribble: 'my cat = liquid confirmed',
  },
  'tumbling-toast-murphys-law-and-the-fundamental-constants': {
    question: 'Why does toast always land butter-side down?',
    highlights: ['The universe is anti-breakfast.'],
    vocab: [{ word: 'fundamental constants', meaning: 'the fixed numbers that set how the universe works' }],
    scribble: 'eat toast on the floor?',
  },
  'why-spaghetti-does-not-break-in-half': {
    question: 'Why won’t spaghetti snap neatly in two?',
    highlights: ['Richard Feynman reportedly spent an evening breaking spaghetti'],
    scribble: 'trying this tonight',
  },
  'of-flying-frogs-and-levitrons': {
    question: 'Can you make a frog float in mid-air?',
    highlights: ['The team floated a frog in mid-air', 'both an Ig Nobel and a Nobel'],
    vocab: [{ word: 'graphene', meaning: 'a super-thin, super-strong sheet of carbon, one atom thick' }],
    scribble: 'the frog was fine!',
  },
  'walking-with-coffee-why-does-it-spill': {
    question: 'Why does coffee spill when you walk?',
    highlights: ['watch your mug (it helps you smooth out)'],
    vocab: [{ word: 'frequency', meaning: 'how often something repeats, like a wobble per second' }],
    scribble: 'me every morning',
  },
  'duration-of-urination-does-not-change-with-body-size': {
    question: 'Do elephants and cats take the same time in the loo?',
    highlights: ['from cats to elephants, they all take roughly the same time'],
    scribble: '21 seconds!',
  },
  'frictional-coefficient-under-banana-skin': {
    question: 'Are banana peels really that slippery?',
    highlights: ['turns into a slippery gel under pressure'],
    vocab: [{ word: 'friction', meaning: 'the grip between two surfaces' }],
    scribble: 'cartoons were right',
  },
  'shape-of-a-ponytail': {
    question: 'Is there an equation for a ponytail?',
    highlights: ['the Rapunzel number. Yes, really.'],
    scribble: 'rapunzel number!!',
  },
  'hot-chocolate-effect': {
    question: 'Why does a mug of hot chocolate sing when you tap it?',
    highlights: ['The note starts low and climbs over a few seconds.'],
    vocab: [{ word: 'pitch', meaning: 'how high or low a sound is' }],
    scribble: 'try it!! ☕',
  },
  'cheerios-effect': {
    question: 'Why do the last Cheerios in the bowl cuddle up?',
    highlights: ['Your breakfast is a surface-tension demo.'],
    vocab: [{ word: 'surface-tension', meaning: 'the skin-like stretchiness on top of a liquid' }],
    scribble: 'cereal friendship',
  },
  'how-a-lollipop-dissolves': {
    question: 'How many licks to the centre of a lollipop?',
    highlights: ['About a thousand, for a typical one.'],
    scribble: '~1,000 licks',
  },
  'pressures-produced-when-penguins-pooh': {
    question: 'How do penguins keep their nests so tidy?',
    highlights: ['Penguins are very house-proud'],
    scribble: 'tidy little guys',
  },
  'intestines-mold-the-corners-of-wombat-feces': {
    question: 'How do wombats make perfect little cubes?',
    highlights: ['the only known animals that produce cube-shaped droppings', 'neat cubes'],
    scribble: 'nature’s tiny architects',
  },
  'cure-for-woodpecker-headache': {
    question: 'Why don’t woodpeckers get headaches?',
    highlights: ['a tongue that wraps around the skull like a seatbelt'],
    vocab: [{ word: 'anatomy', meaning: 'how a body is built inside' }],
    scribble: 'built-in helmet',
  },
  'dung-beetles-use-the-milky-way-for-orientation': {
    question: 'Can beetles navigate by the stars?',
    highlights: ['tiny cardboard hats', 'the glow of the Milky Way'],
    vocab: [{ word: 'planetarium', meaning: 'a dome-shaped room that shows the night sky' }],
    scribble: 'TINY HATS',
  },
  'beetles-on-the-bottle': {
    question: 'Can a beetle fall in love with a bottle?',
    highlights: ['a very large and very attractive female'],
    scribble: 'love is blind',
  },
  'dogs-are-sensitive-to-earths-magnetic-field': {
    question: 'Do dogs have a secret compass?',
    highlights: ['dogs lined up along the north–south axis'],
    vocab: [{ word: 'magnetic field', meaning: 'the invisible force around Earth that makes compasses point north' }],
    scribble: 'good dog, clever dog',
  },
  'no-evidence-of-contagious-yawning-in-tortoise': {
    question: 'Do tortoises catch yawns?',
    highlights: ['The tortoises were unbothered, which is very on-brand.'],
    vocab: [{ word: 'empathy', meaning: 'feeling what someone else feels' }],
    scribble: 'unbothered queens',
  },
  'chinese-alligator-in-heliox': {
    question: 'What does an alligator sound like on helium?',
    highlights: ['encouraged to bellow'],
    vocab: [{ word: 'resonances', meaning: 'the notes a space naturally rings at' }],
    scribble: 'squeaky gator',
  },
  'walking-like-dinosaurs-chickens-with-artificial-tails': {
    question: 'What if you gave a chicken a dinosaur tail?',
    highlights: ['Birds are living dinosaurs'],
    scribble: 'jurassic chicken',
  },
  'herring-produce-burst-pulse-sounds': {
    question: 'How do herring talk to each other?',
    highlights: ['Fast Repetitive Ticks (FRTs)'],
    scribble: 'the acronym hehe',
  },
  'whale-health-helicopter-sampling': {
    question: 'How do you give a whale a check-up?',
    highlights: ['you can’t exactly ask one for a blood sample'],
    scribble: 'gentle science ♡',
  },
  'appetite-of-leeches-ale-garlic-soured-cream': {
    question: 'Do leeches like garlic?',
    highlights: ['showed “unsteady” movement'],
    scribble: 'tipsy leeches',
  },
  'exploring-stock-managers-perceptions-cows-with-names': {
    question: 'Do cows with names make more milk?',
    highlights: ['Farms where each cow had a name reported higher milk yields.'],
    scribble: 'hi Daisy!',
  },
  'pigeons-discrimination-of-paintings-by-monet-and-picasso': {
    question: 'Can a pigeon tell Monet from Picasso?',
    highlights: ['Art critics have been a little nervous ever since.'],
    scribble: 'art pigeon',
  },
  'chickens-prefer-beautiful-humans': {
    question: 'Do chickens think you’re pretty?',
    highlights: ['matched those of human volunteers surprisingly well'],
    scribble: 'a chicken judged me',
  },
  'rats-backwards-speech-language-discrimination': {
    question: 'Can rats tell Dutch from Japanese?',
    highlights: ['tell the two languages apart by their rhythm'],
    vocab: [{ word: 'rhythm', meaning: 'the beat or pattern of sounds' }],
    scribble: 'bilingual rats??',
  },
  'sildenafil-accelerates-reentrainment-hamsters': {
    question: 'Can hamsters get jet lag?',
    highlights: ['Airlines have not added it to the snack trolley.'],
    vocab: [{ word: 'body clock', meaning: 'your built-in 24-hour timer for sleep and waking' }],
    scribble: 'jet-lagged hamsters',
  },
  'impact-protection-of-mammalian-hair-beards': {
    question: 'Are beards built-in armour?',
    highlights: ['built-in armour'],
    scribble: 'beard = helmet',
  },
  'unskilled-and-unaware-of-it': {
    question: 'Why are the least skilled people often the most confident?',
    highlights: ['The lowest scorers thought they were above average.'],
    scribble: 'humble = smart?',
  },
  'swearing-as-a-response-to-pain': {
    question: 'Does saying “ouch” really make it hurt less?',
    highlights: ['save it for special occasions'],
    vocab: [{ word: 'fight-or-flight', meaning: 'your body’s instant “get ready!” response' }],
    scribble: 'OUCH (medicinal)',
  },
  'beauty-is-in-the-eye-of-the-beer-holder': {
    question: 'Does thinking you’ve had a drink make you feel prettier?',
    highlights: ['Independent judges did not agree.'],
    scribble: 'confidence is free',
  },
  'fingernails-on-a-blackboard': {
    question: 'Why are nails on a chalkboard so awful?',
    highlights: ['the mid-range frequencies were the real villain'],
    scribble: '*shiver*',
  },
  'unsuccessful-self-treatment-of-writers-block': {
    question: 'What does a paper about writer’s block look like?',
    highlights: ['below the title, there is no text'],
    vocab: [{ word: 'manuscript', meaning: 'a paper before it’s published' }],
    scribble: 'relatable',
  },
  'chocolate-consumption-cognitive-function-and-nobel-laureates': {
    question: 'Does chocolate win Nobel Prizes?',
    highlights: ['he eats chocolate daily'],
    vocab: [{ word: 'correlation', meaning: 'two things that rise and fall together (but one doesn’t have to cause the other!)' }],
    scribble: 'research snack ♡',
  },
  'neural-correlates-dead-atlantic-salmon': {
    question: 'Can a fish from the shop show brain activity?',
    highlights: ['asked it what they were feeling'],
    vocab: [{ word: 'fMRI', meaning: 'a scanner that shows which parts of a brain are busy' }],
    scribble: 'the salmon had no notes',
  },
  'kardashian-index': {
    question: 'Are some scientists more famous than their research?',
    highlights: ['“Science Kardashian”'],
    vocab: [{ word: 'cited', meaning: 'mentioned by other scientists in their papers' }],
    scribble: 'k-index check',
  },
  'ip-over-avian-carriers': {
    question: 'Can you send internet data by pigeon?',
    highlights: ['Latency was measured in hours.'],
    vocab: [{ word: 'Latency', meaning: 'how long data takes to arrive' }],
    scribble: 'coo coo wifi',
  },
  'hyper-text-coffee-pot-control-protocol': {
    question: 'Why does the internet have an “I’m a teapot” error?',
    highlights: ['“I’m a teapot”'],
    vocab: [{ word: 'legacy', meaning: 'something that lives on long after' }],
    scribble: 'short and stout',
  },
  'chicken-chicken-chicken': {
    question: 'Can you write a whole paper with one word?',
    highlights: ['using only the word “chicken”'],
    scribble: 'chicken.',
  },
  'rooter-scigen-fake-paper': {
    question: 'Could a computer write a paper that gets accepted?',
    highlights: ['give a (also generated) talk'],
    vocab: [{ word: 'convincing-sounding', meaning: 'sounds smart, means nothing' }],
    scribble: 'bold move',
  },
  'two-three-four-atom-exchange-cat-coauthor': {
    question: 'Has a cat ever co-written a physics paper?',
    highlights: ['he added his Siamese cat, Chester, as a co-author'],
    scribble: 'dr. chester ♡',
  },
  'five-second-rule-food-contact-time': {
    question: 'Is the five-second rule real?',
    highlights: ['some transfer happened instantly', 'Carpet, oddly, was the least bad.'],
    scribble: 'carpet?? ok',
  },
  'sweetened-swimming-pools-urine-artificial-sweetener': {
    question: 'How do scientists know what’s really in the pool?',
    highlights: ['your gentle reminder to pop out to the loo'],
    vocab: [{ word: 'tracer', meaning: 'a substance you can follow to see where something went' }],
    scribble: 'be kind to the pool',
  },
  'eating-fossils-licking-rocks': {
    question: 'Why do geologists lick rocks?',
    highlights: ['Geologists often lick rocks in the field.'],
    scribble: 'tastes like science',
  },
};

export const annotations: Record<string, Annotation> = {
  ...originalNotes,
  ...medicineAndPopCultureNotes,
  ...psychologyAndTechNotes,
  ...foodAndPhysicsNotes,
  ...animalsAndMoreNotes,
};
