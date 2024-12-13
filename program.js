// Define the list of skills to match
const skillSynonyms = {
  "Node.js": ["Node.js", "NodeJS", "Node", "nodejs12"],
  "Objective-C": ["Objective-C", "ObjC", "Obj-C", "ObjectiveC"],
  "C++": ["C++", "CPlusPlus", "C++17", "C++20"],
  "Python": ["Python", "py", "Python3", "Python2.7"]
  // Add more canonical skills and their synonyms here
};

// Extract page text (in a Chrome extension content script or the console)
const pageText = document.body.innerText;

// Split the text into tokens (maintaining certain punctuation)
const tokens = pageText.split(/[\s,;!?(){}<>[\]:"'`~]+/).filter(Boolean);

// Normalize them to lowercase for easy comparison
const normalizedTokens = tokens.map(token => token.toLowerCase());

const foundSkills = [];

for (const [canonicalSkill, variants] of Object.entries(skillSynonyms)) {
  // Convert all variants to lowercase
  const lowerVariants = variants.map(v => v.toLowerCase());

  // If any variant is found in the page tokens, we add the canonical skill
  const isFound = lowerVariants.some(variant => normalizedTokens.includes(variant));
  if (isFound) {
    foundSkills.push(canonicalSkill);
  }
}

console.log("Skills found:", foundSkills);