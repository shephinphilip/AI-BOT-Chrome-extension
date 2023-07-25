// Import the natural language toolkit library
const nltk = require('nltk');

// Define a function to calculate the sentiment score of a text
function sentimentScore(text) {
  // Tokenize the text
  const tokens = nltk.word_tokenize(text);

  // Create a list of positive and negative words
  const positiveWords = ['good', 'great', 'awesome', 'love', 'like'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike'];

  // Count the number of positive and negative words in the text
  let positiveCount = 0;
  let negativeCount = 0;
  for (const token of tokens) {
    if (positiveWords.includes(token)) {
      positiveCount++;
    } else if (negativeWords.includes(token)) {
      negativeCount++;
    }
  }

  // Calculate the sentiment score
  const sentimentScore = positiveCount - negativeCount;

  // Return the sentiment score
  return sentimentScore;
}
