function detectLanguage(text) {
    // Tokenize the text into words
    const words = text.split(/\s+/);
  
    // Define the language-specific characteristics
    const languageCharacteristics = {
      en: ['the', 'a', 'an', 'is', 'of', 'and', 'in'], // English
      es: ['el', 'la', 'es', 'de', 'y', 'en'], // Spanish
      fr: ['le', 'la', 'est', 'de', 'et', 'en'], // French
      de: ['der', 'die', 'das', 'ist', 'und', 'in'], // German
      // Add more languages as needed...
    };
  
    // Initialize a language-to-score mapping
    const languageScores = {};
  
    // Calculate the score for each language based on the number of common words
    for (const language in languageCharacteristics) {
      const commonWords = languageCharacteristics[language];
      const score = words.reduce((acc, word) => acc + (commonWords.includes(word) ? 1 : 0), 0);
      languageScores[language] = score;
    }
  
    // Find the language with the highest score
    let detectedLanguage = 'en'; // Default to English if no match is found
    let maxScore = 0;
    for (const language in languageScores) {
      if (languageScores[language] > maxScore) {
        detectedLanguage = language;
        maxScore = languageScores[language];
      }
    }
  
    // Return the detected language code
    return detectedLanguage;
  }
  