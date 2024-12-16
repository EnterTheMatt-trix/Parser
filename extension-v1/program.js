(async function() {
  // 1. Fetch your categorized skill definitions (JSON)
  const response = await fetch(chrome.runtime.getURL('categorized_technologies.json'));
  const skillCategories = await response.json();

  // 2. Extract the page text and tokenize
  const pageText = document.body.innerText;
  const tokens = pageText.split(/[\s,;!?(){}<>[\]:"'`~\/&]+/).filter(Boolean);
  const normalizedTokens = tokens.map(token => token.toLowerCase());

  // 3. Prepare an object for matched skills keyed by category
  const foundSkillsByCategory = {};

  // 4. Iterate over categories
  for (const [categoryName, skillMap] of Object.entries(skillCategories)) {
    // Example skillMap structure:
    // {
    //   "C++": ["C++", "C++17", "cplusplus"],
    //   "Python": ["Python", "py", "python3"]
    // }
    foundSkillsByCategory[categoryName] = [];

    for (const [canonicalSkill, variants] of Object.entries(skillMap)) {
      const lowerVariants = variants.map(v => v.toLowerCase());
      const isFound = lowerVariants.some(variant => normalizedTokens.includes(variant));
      if (isFound) {
        foundSkillsByCategory[categoryName].push(canonicalSkill);
      }
    }
  }

  // 5. Remove categories that have no found skills
  Object.entries(foundSkillsByCategory).forEach(([category, skills]) => {
    if (skills.length === 0) {
      delete foundSkillsByCategory[category];
    }
  });

  // 6. Store the foundSkillsByCategory in chrome.storage.local
  chrome.storage.local.set({ foundSkillsByCategory }, () => {
    console.log("Skills by category saved:", foundSkillsByCategory);
  });
})();