(async function () {
  // 1. Fetch the flat skill dictionary
  const response = await fetch(chrome.runtime.getURL('flat_technologies.json'));
  const flatSkillDictionary = await response.json();

  // 2. Extract the page text and tokenize
  const pageText = document.body.innerText;
  const tokens = pageText.split(/[\s,;!?(){}<>[\]:"'`~\/&]+/).filter(Boolean);
  const normalizedTokens = tokens.map(token => token.toLowerCase());

  // 3. Prepare an object to store matched skills
  const matchedSkills = {};

  // 4. Iterate over the flat dictionary
  for (const [canonicalSkill, synonyms] of Object.entries(flatSkillDictionary)) {
    const lowerSynonyms = synonyms.map(synonym => synonym.toLowerCase());
    const isFound = lowerSynonyms.some(synonym => normalizedTokens.includes(synonym));

    if (isFound) {
      matchedSkills[canonicalSkill] = synonyms; // Add the matched skill to the results
    }
  }

  // 5. Store the matched skills in chrome.storage.local
  chrome.storage.local.set({ matchedSkills }, () => {
    console.log("Matched skills saved:", matchedSkills);
  });
})();