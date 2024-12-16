(async function() {
  // 1. Load the hierarchical JSON
  const response = await fetch(chrome.runtime.getURL('categorized_technologies.json'));
  const skillCategories = await response.json();

  // 2. Extract and tokenize the page text
  const pageText = document.body.innerText;
  const tokens = pageText.split(/[\s,;!?(){}<>[\]:"'`~]+/).filter(Boolean);
  const normalizedTokens = tokens.map(token => token.toLowerCase());

  // 3. This object will store the found skills
  const foundSkillsByCategory = {};

  // 4. Recursive function to traverse the JSON hierarchy
  //    'pathStack' keeps track of the path (category/subcategory) down the tree.
  function parseCategory(node, pathStack = []) {
    // If 'node' is an object, it might be either:
    //   A) Another level of subcategories
    //   B) A dictionary of skillName -> [synonyms array]
    // We need to differentiate which case it is by looking at the node’s values.
    
    // We'll do a quick check if EVERY value is an array => it’s a leaf node of skills.
    // Otherwise, if we find object values, that's another subcategory level.
    
    // Check if node is a "leaf" containing skill arrays
    const allValuesAreArrays = Object.values(node).every(v => Array.isArray(v));
    
    if (allValuesAreArrays) {
      // This is a leaf node: each key is a canonical skill, each value is synonyms.
      const matchedSkills = [];

      for (const [canonicalSkill, synonyms] of Object.entries(node)) {
        // Safety check in case the JSON has a mismatch
        if (!Array.isArray(synonyms)) {
          console.warn(`Expected synonyms array for skill '${canonicalSkill}' but got:`, synonyms);
          continue;
        }

        const lowerSynonyms = synonyms.map(s => s.toLowerCase());
        const isMatch = lowerSynonyms.some(synonym => normalizedTokens.includes(synonym));
        if (isMatch) matchedSkills.push(canonicalSkill);
      }

      // If we found any skills, store them in 'foundSkillsByCategory' under the path
      if (matchedSkills.length > 0) {
        // Build a nested object path in foundSkillsByCategory to mirror the JSON hierarchy
        let currentLevel = foundSkillsByCategory;

        // Traverse pathStack to create nested objects if they don't exist
        pathStack.forEach(levelName => {
          if (!currentLevel[levelName]) {
            currentLevel[levelName] = {};
          }
          currentLevel = currentLevel[levelName];
        });

        // The last level is where we actually store the matched skills
        // You could store them in an array or an object. Here's an array approach:
        currentLevel.__matches = (currentLevel.__matches || []).concat(matchedSkills);
      }
    } else {
      // Not all values are arrays, so this node contains subcategories
      for (const [key, value] of Object.entries(node)) {
        // 'value' might be another object or a leaf node
        if (typeof value === 'object' && value !== null) {
          parseCategory(value, [...pathStack, key]);
        } else {
          console.warn(`Unexpected data type for key '${key}':`, value);
        }
      }
    }
  }

  // 5. Kick off the recursion at the root of skillCategories
  parseCategory(skillCategories, []);

  // 6. Save results
  chrome.storage.local.set({ foundSkillsByCategory }, () => {
    console.log("Hierarchical Skills saved:", foundSkillsByCategory);
  });
})();