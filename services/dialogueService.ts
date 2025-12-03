import { DIALOGUE_DATA } from '../constants';
import type { Topic, MenuOption, Subtype, NeedCategory, Question } from '../types';

export function getQuestion(topic: Topic, questionIndex: number): Question | null {
  const topicData = DIALOGUE_DATA[topic];
  if (topicData && questionIndex < topicData.questions.length) {
    return topicData.questions[questionIndex];
  }
  return null;
}

function findOptionByValue(value: string): MenuOption | null {
  for (const topicKey in DIALOGUE_DATA) {
    const topic = DIALOGUE_DATA[topicKey as Topic];
    for (const question of topic.questions) {
      const foundOption = question.options.find(opt => opt.value === value);
      if (foundOption) {
        return foundOption;
      }
    }
  }
  return null;
}

export function calculateRecommendation(topic: Topic, answerValues: string[]): string {
  const answeredOptions = answerValues.map(findOptionByValue).filter(opt => opt !== null) as MenuOption[];

  const totalNeedScore = answeredOptions.reduce((sum, opt) => sum + opt.needScore, 0);

  const subtypeCounts: Record<Subtype, number> = {
    BIOLOGY: 0,
    ENVIRONMENT: 0,
    CONSISTENCY: 0,
    EMOTIONAL: 0,
    COGNITIVE: 0,
  };

  answeredOptions.forEach(opt => {
    subtypeCounts[opt.subtype]++;
  });

  const primarySubtype = (Object.keys(subtypeCounts) as Subtype[]).reduce((a, b) =>
    subtypeCounts[a] > subtypeCounts[b] ? a : b
  );
  
  // Scoring thresholds: 8 questions, max score 3 per question = 24.
  // LOW: 0-8, MODERATE: 9-16, HIGH: 17+
  let needCategory: NeedCategory = 'LOW';
  if (totalNeedScore >= 17) {
    needCategory = 'HIGH';
  } else if (totalNeedScore >= 9) {
    needCategory = 'MODERATE';
  }

  const recommendation = DIALOGUE_DATA[topic].recommendations[needCategory]?.[primarySubtype];
  
  return recommendation || "Thank you for your sharing. Here is a recommendation";
}
