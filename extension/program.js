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

  // Multi-word matching, no special treatment
  const multiWordMatches = {};
  const lowerPageText = pageText.toLowerCase();

  for (const [canonicalSkill, phrases] of Object.entries(multiWordSynonyms)) {
    const lowerPhrases = phrases.map(p => p.toLowerCase());
    const isFound = lowerPhrases.some(phrase => lowerPageText.includes(phrase));
    if (isFound) multiWordMatches[canonicalSkill] = phrases;
  } 

// Multi-word matching, treatment for compound skills with '/'
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