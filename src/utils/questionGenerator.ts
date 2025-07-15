
import { BloomTaxonomy } from "@/types/education";
import { ExtractedConcept } from "./conceptExtractor";

export const generateIntelligentQuestion = (concept: ExtractedConcept, bloom: BloomTaxonomy): string => {
  const { text, type } = concept;
  
  const words = text.split(' ').filter(w => w.length > 4 && /^[A-Z]/.test(w));
  const keyTerm = words[0] || 'the concept';
  
  const questionTemplates = {
    remember: {
      definition: [`What is ${keyTerm}?`, `Define ${keyTerm}.`, `List the characteristics of ${keyTerm}.`],
      fact: [`What are the key facts about ${keyTerm}?`, `When did ${keyTerm} occur?`, `What is ${keyTerm}?`],
      process: [`What are the steps in ${keyTerm}?`, `List the stages of ${keyTerm}.`, `What happens during ${keyTerm}?`],
      general: [`What is ${keyTerm}?`, `Define ${keyTerm}.`, `What are the main points about ${keyTerm}?`]
    },
    understand: {
      definition: [`Explain the meaning of ${keyTerm}.`, `Why is ${keyTerm} important?`, `How would you describe ${keyTerm}?`],
      fact: [`Explain why ${keyTerm} is significant.`, `What does ${keyTerm} tell us?`, `How does ${keyTerm} relate to the topic?`],
      process: [`Explain how ${keyTerm} works.`, `Why does ${keyTerm} happen?`, `What is the purpose of ${keyTerm}?`],
      general: [`Explain ${keyTerm}.`, `Why is ${keyTerm} important?`, `How does ${keyTerm} work?`]
    },
    apply: {
      definition: [`How would you apply ${keyTerm} in practice?`, `Give an example of ${keyTerm}.`, `When would you use ${keyTerm}?`],
      fact: [`How can ${keyTerm} be applied?`, `What are the practical implications of ${keyTerm}?`, `How does ${keyTerm} affect practice?`],
      process: [`How would you implement ${keyTerm}?`, `Apply ${keyTerm} to a real situation.`, `Demonstrate ${keyTerm}.`],
      general: [`How would you use ${keyTerm}?`, `Apply ${keyTerm} to an example.`, `When is ${keyTerm} relevant?`]
    },
    analyze: {
      definition: [`Compare ${keyTerm} with similar concepts.`, `What are the components of ${keyTerm}?`, `Analyze the elements of ${keyTerm}.`],
      fact: [`Analyze the significance of ${keyTerm}.`, `What factors contribute to ${keyTerm}?`, `Break down ${keyTerm}.`],
      process: [`Analyze the steps of ${keyTerm}.`, `What are the critical points in ${keyTerm}?`, `Compare different approaches to ${keyTerm}.`],
      general: [`Analyze ${keyTerm}.`, `What are the key components of ${keyTerm}?`, `Compare ${keyTerm} with alternatives.`]
    },
    evaluate: {
      definition: [`Evaluate the importance of ${keyTerm}.`, `Judge the effectiveness of ${keyTerm}.`, `Assess the value of ${keyTerm}.`],
      fact: [`Evaluate the impact of ${keyTerm}.`, `Judge the significance of ${keyTerm}.`, `Assess the reliability of ${keyTerm}.`],
      process: [`Evaluate the efficiency of ${keyTerm}.`, `Judge the effectiveness of ${keyTerm}.`, `Assess the quality of ${keyTerm}.`],
      general: [`Evaluate ${keyTerm}.`, `Judge the merit of ${keyTerm}.`, `Assess ${keyTerm}.`]
    },
    create: {
      definition: [`Create a new application for ${keyTerm}.`, `Design a system using ${keyTerm}.`, `Develop an example of ${keyTerm}.`],
      fact: [`Create a plan based on ${keyTerm}.`, `Design a solution using ${keyTerm}.`, `Develop strategies for ${keyTerm}.`],
      process: [`Create an improved version of ${keyTerm}.`, `Design a new approach to ${keyTerm}.`, `Develop alternatives to ${keyTerm}.`],
      general: [`Create something new using ${keyTerm}.`, `Design a system with ${keyTerm}.`, `Develop ${keyTerm} further.`]
    }
  };

  const templates = questionTemplates[bloom][type] || questionTemplates[bloom].general;
  return templates[Math.floor(Math.random() * templates.length)];
};

export const generateIntelligentAnswer = (concept: ExtractedConcept): string => {
  return concept.text.length > 200 ? concept.text.substring(0, 200) + '...' : concept.text;
};

export const generateIntelligentMCQQuestion = (concept: ExtractedConcept, bloom: BloomTaxonomy): string => {
  const question = generateIntelligentQuestion(concept, bloom);
  return question.endsWith('?') ? question : question + '?';
};

export const generateIntelligentMCQOptions = (concept: ExtractedConcept): string[] => {
  const correctAnswer = concept.text.length > 120 ? concept.text.substring(0, 120) + '...' : concept.text;
  
  const distractors = concept.type === 'definition' ? [
    'A process that occurs in different circumstances',
    'A concept not related to this topic',
    'An outdated theory that has been disproven'
  ] : concept.type === 'fact' ? [
    'A common misconception about this topic',
    'Information from a different field of study',
    'A theoretical assumption without evidence'
  ] : concept.type === 'process' ? [
    'A different sequence of events',
    'An alternative method not discussed',
    'A process that occurs in reverse order'
  ] : [
    'An unrelated concept from this field',
    'A contradictory statement',
    'Information not supported by the source'
  ];
  
  return [correctAnswer, ...distractors.slice(0, 3)];
};
