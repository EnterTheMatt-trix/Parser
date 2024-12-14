(async function() {
  // 1. Fetch the JSON using chrome.runtime.getURL
  const response = await fetch(chrome.runtime.getURL('technologies.json'));
  const skillSynonyms = await response.json();

  // 2. Extract page text
  const pageText = document.body.innerText;

  // 3. Split into tokens
  const tokens = pageText.split(/[\s,;!?(){}<>[\]:"'`~]+/).filter(Boolean);
  const normalizedTokens = tokens.map(token => token.toLowerCase());

  // 4. Find matches
  const foundSkills = [];
  for (const [canonicalSkill, variants] of Object.entries(skillSynonyms)) {
    const lowerVariants = variants.map(v => v.toLowerCase());
    const isFound = lowerVariants.some(variant => normalizedTokens.includes(variant));
    if (isFound) {
      foundSkills.push(canonicalSkill);
    }
  }

  // 5. Log the results
  chrome.storage.local.set({ foundSkills }, () => {
    console.log("Skills found:", foundSkills);
  });
  
})();