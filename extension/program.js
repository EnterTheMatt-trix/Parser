(async function () {
  const response = await fetch(chrome.runtime.getURL('flat_technologies.json'));
  const flatDictionary = await response.json();

  // Extract page text
  const pageText = document.body.innerText;

  // Split dictionary into multi-word and single-word entries
  const multiWordSynonyms = {};
  const singleWordSynonyms = {};

  for (const [canonicalSkill, synonyms] of Object.entries(flatDictionary)) {
    const multiWord = synonyms.filter(s => s.includes(" "));
    const singleWord = synonyms.filter(s => !s.includes(" "));

    if (multiWord.length > 0) multiWordSynonyms[canonicalSkill] = multiWord;
    if (singleWord.length > 0) singleWordSynonyms[canonicalSkill] = singleWord;
  }

  // Multi-word matching
  const multiWordMatches = {};
  const lowerPageText = pageText.toLowerCase();

  for (const [canonicalSkill, phrases] of Object.entries(multiWordSynonyms)) {
    const lowerPhrases = phrases.map(p => p.toLowerCase());
    const isFound = lowerPhrases.some(phrase => lowerPageText.includes(phrase));
    if (isFound) multiWordMatches[canonicalSkill] = phrases;
  }

// Tokenize text by splitting on whitespace
const tokensForSlashes = pageText
  .split(/[\s/]+/)  // Split on whitespace or slashes
  .filter(Boolean)  // Remove any empty strings
  .map(token => token.toLowerCase());  // Convert to lowercase
for (const [canonicalSkill, synonyms] of Object.entries(multiWordSynonyms)) {
  console.log("Split on slash", tokensForSlashes);
  console.log("Multi words", multiWordSynonyms)
  const lowerSynonyms = synonyms.map(s => s.toLowerCase());
  // Now use tokensForSlashes instead in the matching logic
  const isFound = lowerSynonyms.some(synonym => tokensForSlashes.includes(synonym));
  if (isFound) multiWordMatches[canonicalSkill] = synonyms;
}  

// Multi-word matching
const multiWordMatchesForSlashes = {};
const lowerPageTextForSlashes = pageText.toLowerCase().replace(/\//g, ' ');  // Replace all slashes with spaces
console.log('Processed page text:', lowerPageTextForSlashes);

for (const [canonicalSkill, phrases] of Object.entries(multiWordSynonyms)) {
  const lowerPhrases = phrases.map(p => p.toLowerCase());
  const isFound = lowerPhrases.some(phrase => lowerPageTextForSlashes.includes(phrase));
  if (isFound) multiWordMatches[canonicalSkill] = phrases;
}

  // Tokenize text for single-word matching
  const tokens = pageText.split(/[\s,;!?(){}<>[\]:"'`~\/&]+/).filter(Boolean);
  const normalizedTokens = tokens.map(token => token.toLowerCase());
  /*
  * What if we have 1) a third tier that is do not split on /
  * 2) split on / and run the matching as is now
  * We are splitting on /, and then matching single or multi word
  * but for ci/cd we should recognize that as a multi word 
  * How about we run a matching for phrases
  * Then, a matching for slashes
  * Then, a matching for normalized tokens
  */
  // After creating normalizedTokens
  const cleanTokens = normalizedTokens.map(token => 
    {  if (token.startsWith('.')) { return token.slice(1); }
       if (token.endsWith('.')) { return token.slice(0, -1);}
      return token; }
  );

  const singleWordMatches = {};

  for (const [canonicalSkill, synonyms] of Object.entries(singleWordSynonyms)) {
    const lowerSynonyms = synonyms.map(s => s.toLowerCase());
    // Now use cleanTokens instead of normalizedTokens in the matching logic
    const isFound = lowerSynonyms.some(synonym => cleanTokens.includes(synonym));
    if (isFound) singleWordMatches[canonicalSkill] = synonyms;
  }

  // Combine results
  const matchedSkills = { ...multiWordMatches, ...singleWordMatches };

  // Save results to storage
  chrome.storage.local.set({ matchedSkills }, () => {
    console.log("Matched Skills:", matchedSkills);
  });
})();