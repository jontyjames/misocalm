/**
 * Misophonia Self-Assessment Quiz
 * 13 questions (prime), 3 options each (prime), max score 26
 */

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'When someone near you starts chewing with their mouth open, what happens?',
    options: [
      { label: 'Barely notice', description: 'It doesn\'t really register for me', score: 0 },
      { label: 'It\'s annoying', description: 'I notice and it bothers me, but I move on', score: 1 },
      { label: 'Something inside me snaps', description: 'I feel a rush of anger or disgust I can\'t explain', score: 2 },
    ],
  },
  {
    id: 2,
    question: 'The feeling you get from these sounds is closest to...',
    options: [
      { label: 'Mild irritation', description: 'Like a background annoyance', score: 0 },
      { label: 'Frustration that builds', description: 'It starts small and grows the longer it continues', score: 1 },
      { label: 'Rage, disgust, or panic', description: 'An intense physical and emotional response', score: 2 },
    ],
  },
  {
    id: 3,
    question: 'During a meal with someone who eats loudly, your body...',
    options: [
      { label: 'Feels normal', description: 'I can eat and chat without issue', score: 0 },
      { label: 'Tenses up a bit', description: 'I notice some discomfort but manage', score: 1 },
      { label: 'Goes into survival mode', description: 'Jaw clenches, chest tightens, I need to escape', score: 2 },
    ],
  },
  {
    id: 4,
    question: 'Which of these sounds bother you most?',
    options: [
      { label: 'Loud sounds', description: 'Volume is the issue, not the type', score: 0 },
      { label: 'A mix of loud and soft', description: 'Some loud sounds and some quiet ones get to me', score: 1 },
      { label: 'Specific soft sounds', description: 'It\'s about the type, not the volume. Quiet sounds can be the worst', score: 2 },
    ],
  },
  {
    id: 5,
    question: 'Have you ever left a room, put on headphones, or changed seats because of a sound?',
    options: [
      { label: 'No, that sounds extreme', description: 'I\'ve never needed to do that', score: 0 },
      { label: 'Once or twice', description: 'In really bad situations, yes', score: 1 },
      { label: 'This is my life', description: 'I do this regularly. It\'s how I cope', score: 2 },
    ],
  },
  {
    id: 6,
    question: 'Has a sound someone makes ever changed how you feel about them?',
    options: [
      { label: 'No, that\'s just a sound', description: 'Sounds don\'t affect my relationships', score: 0 },
      { label: 'Maybe briefly', description: 'In the moment I felt different, but it passed', score: 1 },
      { label: 'Yes, and it\'s confusing', description: 'I\'ve felt guilt about how much a sound changed my feelings', score: 2 },
    ],
  },
  {
    id: 7,
    question: 'When you know you\'ll be in a situation with trigger sounds, do you...',
    options: [
      { label: 'Not think about it', description: 'I don\'t plan around sounds', score: 0 },
      { label: 'Feel a little uneasy', description: 'I might think about it but I go anyway', score: 1 },
      { label: 'Dread it, plan around it, or avoid it', description: 'I change plans, bring headphones, or sometimes don\'t go', score: 2 },
    ],
  },
  {
    id: 8,
    question: 'How long have certain sounds bothered you like this?',
    options: [
      { label: 'A few months', description: 'This is relatively new for me', score: 0 },
      { label: 'A few years', description: 'It\'s been building over time', score: 1 },
      { label: 'As long as I can remember', description: 'I can trace this back to childhood', score: 2 },
    ],
  },
  {
    id: 9,
    question: 'Does watching someone jiggle their leg, chew gum, or fidget bother you similarly?',
    options: [
      { label: 'No', description: 'Visual things don\'t bother me the same way', score: 0 },
      { label: 'A little, less than sounds', description: 'I notice it but it\'s not as intense', score: 1 },
      { label: 'Yes, same feeling', description: 'Certain movements trigger the same response as sounds', score: 2 },
    ],
  },
  {
    id: 10,
    question: 'When you react to a trigger sound, do you feel your reaction is...',
    options: [
      { label: 'Totally reasonable', description: 'Anyone would be annoyed by this', score: 0 },
      { label: 'A bit much sometimes', description: 'I know I react more than most people', score: 1 },
      { label: 'Way out of proportion and I can\'t control it', description: 'I wish I could stop reacting this way', score: 2 },
    ],
  },
  {
    id: 11,
    question: 'What do you currently do to deal with difficult sounds?',
    options: [
      { label: 'Nothing specific', description: 'I don\'t have strategies for this', score: 0 },
      { label: 'A few workarounds', description: 'Headphones, white noise, or leaving when I can', score: 1 },
      { label: 'I\'ve built an entire system', description: 'Multiple strategies, specific headphones, seating preferences, avoidance patterns', score: 2 },
    ],
  },
  {
    id: 12,
    question: 'Have these sound sensitivities ever made you feel alone or misunderstood?',
    options: [
      { label: 'Not really', description: 'It\'s not something I think about', score: 0 },
      { label: 'Sometimes', description: 'I\'ve felt like no one gets it', score: 1 },
      { label: 'Deeply', description: 'I\'ve felt broken, alone, or like something is wrong with me', score: 2 },
    ],
  },
  {
    id: 13,
    question: 'Before this quiz, had you heard the word "misophonia"?',
    options: [
      { label: 'No, this is new', description: 'I didn\'t know there was a name for this', score: 0 },
      { label: 'I\'ve come across it', description: 'I\'ve seen the word but haven\'t looked into it deeply', score: 1 },
      { label: 'Yes, and I\'ve been looking for help', description: 'I know what it is and I\'ve been searching for support', score: 2 },
    ],
  },
];

/**
 * Result categories based on total score (max 26)
 */
export const RESULT_CATEGORIES = [
  {
    key: 'general',
    range: [0, 7],
    heading: 'You notice sounds more than most',
    accent: 'cyan',
    paragraphs: [
      'Your responses suggest you\'re more aware of sounds than the average person, but they don\'t seem to dominate your daily experience. That awareness is valid, and it\'s worth paying attention to.',
      'Sound sensitivity exists on a spectrum. Where you are right now might shift over time, and understanding your patterns early can be genuinely helpful. Many people who score in this range find that certain situations or stress levels can make sounds feel more intrusive.',
      'Whether or not this is misophonia, learning to work with your nervous system is one of the most useful things you can do for yourself. Small practices, like conscious breathing during stressful moments, can make a real difference.',
    ],
  },
  {
    key: 'moderate',
    range: [8, 15],
    heading: 'This sounds like misophonia',
    accent: 'indigo',
    paragraphs: [
      'Your responses suggest something more than ordinary annoyance with sounds. The patterns you described, the physical tension, the emotional intensity, the way certain sounds can change how you feel about a person or a place, these are hallmarks of misophonia.',
      'Misophonia is how your brain has learned to process certain sounds as threats. It\'s not a choice, and it\'s not about being too sensitive. Your nervous system is doing exactly what it was wired to do. The problem isn\'t you. It\'s that no one ever explained what was happening.',
      'The good news is that once you understand what\'s going on, you can start working with it instead of against it. Breathwork, journaling, and nervous system regulation can genuinely help reduce the intensity of your responses over time.',
    ],
  },
  {
    key: 'significant',
    range: [16, 21],
    heading: 'You\'re not overreacting. This is real.',
    accent: 'violet',
    paragraphs: [
      'Your responses paint a picture of someone whose life is significantly shaped by sound sensitivity. The avoidance, the planning, the guilt about your own reactions. This is misophonia, and it\'s been affecting you deeply.',
      'Here\'s what matters most: your brain treats certain sounds as genuine threats. That\'s why the response feels so intense, so physical, so impossible to control. It\'s not a personality flaw. It\'s neurology. And the fact that you\'ve been managing this, often without support or even a name for it, says something about your resilience.',
      'You don\'t have to push through this alone anymore. There are practices that work with your nervous system rather than against it. Breathwork to interrupt the fight-or-flight response. Journaling to process the emotional weight. A community of people who understand exactly what you\'re going through.',
    ],
  },
  {
    key: 'severe',
    range: [22, 26],
    heading: 'You\'ve been carrying this for a long time.',
    accent: 'violet',
    glow: true,
    paragraphs: [
      'Your responses tell a story of someone who has been living with intense misophonia for a long time, likely since childhood. The depth of your reactions, the systems you\'ve built to cope, the loneliness of feeling like no one understands. This is real, and you are not broken.',
      'What you experience is called misophonia. Your brain\'s threat detection system has become hypersensitive to certain sounds and movements. Every time you feel that surge of rage or disgust or panic, that\'s your nervous system trying to protect you. It\'s doing its job. It\'s just doing it too well.',
      'You\'ve been incredibly resourceful in managing this on your own. But you don\'t have to keep carrying it alone. There are people who understand exactly what this feels like, and there are practices that can help your nervous system learn to respond differently. Not overnight, but genuinely, over time.',
    ],
  },
];

/**
 * Calculate score from answers array
 * @param {number[]} answers - array of scores (0, 1, or 2) for each question
 * @returns {{ total: number, category: object }}
 */
export function calculateResult(answers) {
  const total = answers.reduce((sum, score) => sum + score, 0);
  const category = RESULT_CATEGORIES.find(
    (cat) => total >= cat.range[0] && total <= cat.range[1]
  ) || RESULT_CATEGORIES[RESULT_CATEGORIES.length - 1];

  return { total, category };
}
