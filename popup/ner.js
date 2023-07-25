function detectEntities(text) {
    // Convert the text to lowercase for case-insensitive matching
    const lowercaseText = text.toLowerCase();
  
    // Define regular expressions for common location patterns
    const locationRegexes = [
      /(?:^|\W)new york(?:$|\W)/, // Match "new york" as a whole word
      /(?:^|\W)los angeles(?:$|\W)/, // Match "los angeles" as a whole word
      // Add more location patterns as needed...
    ];
  
    // Initialize an array to store detected entities
    const detectedEntities = [];
  
    // Check for each location pattern in the text
    locationRegexes.forEach(regex => {
      const matches = lowercaseText.match(regex);
      if (matches) {
        const location = matches[0].trim();
        detectedEntities.push({ type: 'LOCATION', text: location });
      }
    });
  
    // Return the detected entities
    return detectedEntities;
  }
  