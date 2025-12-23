import { Topic, MenuOption } from './types';

// --- DATA REPOSITORY ---
const DIALOGUE_FLOW: Record<string, any> = {
  'sleep': {
    questions: [
      "How confident do you feel that you are getting enough quality sleep every night?",
      "Which element of your sleep hygiene routine is most challenging for you to maintain?",
      "How does a poor night's sleep typically affect your mood the following day?",
      "What type of activities are you doing prior to bed?",
    ],
    questionOptions: [
      ["Very confident", "Moderately confident", "Slightly confident", "Not confident at all"],
      ["Consistency", "Environment", "Biology", "Cognitive"],
      ["Irritable", "Lethargic", "Focus suffers", "Unaffected"],
      ["Reading", "TV", "Planning", "Exercising"]
    ],
    responses: {
      HIGH: "Your sleep pattern suggests biological misalignment. Establish a fixed wake time.",
      MODERATE: "Your sleep is functional but could be strengthened. Focus on morning light.",
      LOW: "Your sleep system is well-aligned. Maintain your current routine."
    },
  },
  'exercise': {
    questions: [
      "How often do you find yourself too tired for physical activity you genuinely want to do?",
      "What is the single biggest mental hurdle that stops you from being as active as you'd like to be?",
      "How interconnected do you believe exercise and energy levels are?",
      "What does exercise mean to you?",
    ],
    questionOptions: [
      ["Daily", "Often", "Sometimes", "Rarely"],
      ["Motivation", "Time", "Fatigue", "Boredom"],
      ["Strong", "Moderate", "Small", "No association"],
      ["Self-expression", "Duty", "Stress relief", "Performance"]
    ],
    responses: {
      HIGH: "Your energy pattern suggests a mismatch between recovery needs and activity.",
      MODERATE: "Your energy levels show periodic instability. Identify your strongest energy window.",
      LOW: "Your energy regulation appears stable. Maintain biological alignment."
    }
  },
  'food': {
    questions: [
      "If you had to describe the nutritional quality of your daily diet, what would it be?",
      "How much of what you drink is plain water compared to other drinks?",
      "What is your least favorite eating habit?",
      "How do you feel when having your largest meal of the day?",
    ],
    questionOptions: [
      ["Strong", "Major", "Minor", "No need"],
      ["Mostly", "Moderate", "Some", "Very little"],
      ["Snacking", "Mindless", "Emotional", "Skipping"],
      ["Satisfied", "Rushed", "Overly full", "Focused"]
    ],
    responses: {
      HIGH: "Standardize meal timing into three predictable anchors spaced roughly 4–5 hours apart.",
      MODERATE: "Strengthen predictability by maintaining consistent meal timing.",
      LOW: "Maintain hunger and satiety alignment by continuing to space meals predictably."
    }
  },
  'habits': { 
    questions: [
      "How confident are you that your current daily habits set you up for long-term well-being?",
      "What is the biggest barrier to maintaining sustained change?",
      "How do you typically accomplish the formation of a new habit?",
      "How confident are you in your ability to start a new positive habit?",
    ],
    questionOptions: [
      ["Very confident", "Moderately", "Slightly", "Not confident"],
      ["Short-term", "Forget", "No steps", "No belief"],
      ["Environment", "Appealing", "Small step", "Reinforcing"],
      ["Confident", "Slightly", "Moderately", "Not confident"]
    ],
    responses: {
      HIGH: "Identify your window of highest daily alertness and assign your most important habit to that window.",
      MODERATE: "Assign habits to consistent windows that align with energy peaks.",
      LOW: "Your biological rhythms support habit execution effectively."
    }
  }
};

// --- LOGIC FUNCTIONS ---

export const getQuestion = (topic: Topic, index: number) => {
  // We cast topic to string to match the keys in DIALOGUE_FLOW
  const flow = DIALOGUE_FLOW[topic as unknown as string];
  
  if (!flow || index >= flow.questions.length) {
    return null;
  }

  const text = flow.questions[index];
  const optionsRaw = flow.questionOptions[index];
  
  const options: MenuOption[] = optionsRaw.map((opt: string) => ({
    text: opt,
    value: opt,
    needScore: 0, 
    subtype: 'COGNITIVE'
  }));

  return { text, options };
};

export const calculateRecommendation = (topic: Topic, userAnswers: string[]): string => {
  const flow = DIALOGUE_FLOW[topic as unknown as string];
  if (!flow) return "No recommendation available.";

  let score = 0;
  userAnswers.forEach(ans => {
      const lower = ans.toLowerCase();
      if (lower.includes('not confident') || lower.includes('rarely')) score += 3;
      else if (lower.includes('slightly') || lower.includes('sometimes')) score += 2;
      else if (lower.includes('moderately')) score += 1;
  });

  if (score >= 6) return flow.responses.HIGH;
  if (score >= 3) return flow.responses.MODERATE;
  return flow.responses.LOW;
};
