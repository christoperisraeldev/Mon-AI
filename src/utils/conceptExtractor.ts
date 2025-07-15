export interface ExtractedConcept {
  id: string;
  text: string;
  type: 'definition' | 'fact' | 'process' | 'cause-effect' | 'general';
  paragraph: string;
  importance: number;
}

export const extractIntelligentConcepts = (
  text: string,
  maxConcepts?: number,
  thinkingLevel?: string
): ExtractedConcept[] => {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
  const concepts: ExtractedConcept[] = [];

  for (const paragraph of paragraphs) {
    const definitionRegex = /([A-Z][^.!?]*(?:is|are|means|refers to|defined as)[^.!?]*[.!?])/g;
    const definitions: string[] = Array.from(paragraph.matchAll(definitionRegex)).map(match => match[1]);
    
    const factRegex = /([A-Z][^.!?]*(?:\d+|in \d{4}|during|caused by|results in)[^.!?]*[.!?])/g;
    const facts: string[] = Array.from(paragraph.matchAll(factRegex)).map(match => match[1]);
    
    const processRegex = /([A-Z][^.!?]*(?:first|then|next|finally|step|process)[^.!?]*[.!?])/g;
    const processes: string[] = Array.from(paragraph.matchAll(processRegex)).map(match => match[1]);
    
    const causeEffectRegex = /([A-Z][^.!?]*(?:because|due to|leads to|causes|results)[^.!?]*[.!?])/g;
    const causeEffects: string[] = Array.from(paragraph.matchAll(causeEffectRegex)).map(match => match[1]);

    const allMatches: string[] = [...definitions, ...facts, ...processes, ...causeEffects];
    
    for (const concept of allMatches) {
      if (concept.trim().length > 20) {
        let conceptType: 'definition' | 'fact' | 'process' | 'cause-effect' = 'definition';
        
        if (definitions.includes(concept)) {
          conceptType = 'definition';
        } else if (facts.includes(concept)) {
          conceptType = 'fact';
        } else if (processes.includes(concept)) {
          conceptType = 'process';
        } else if (causeEffects.includes(concept)) {
          conceptType = 'cause-effect';
        }
        
        concepts.push({
          id: `concept-${concepts.length}`,
          text: concept.trim(),
          type: conceptType,
          paragraph: paragraph.substring(0, 100) + '...',
          importance: 0.8 + Math.random() * 0.2
        });
      }
    }
  }

  if (concepts.length === 0) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 30);
    sentences.slice(0, 10).forEach((sentence, index) => {
      concepts.push({
        id: `concept-${index}`,
        text: sentence.trim(),
        type: 'general',
        paragraph: sentence.trim(),
        importance: 0.6 + Math.random() * 0.3
      });
    });
  }

  // Apply maxConcepts limit if provided
  const sortedConcepts = concepts.sort((a, b) => b.importance - a.importance);
  return maxConcepts ? sortedConcepts.slice(0, maxConcepts) : sortedConcepts;
};