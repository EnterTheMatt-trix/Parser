// Define the list of skills to match
const skillsList = [
  "Angular", "C", "C#", "Objective-C", "C++", "CSS", "Docker", "Go", "HTML",
  "Java", "JavaScript", "Kotlin", "Kubernetes", "MongoDB", "Node.js", "PHP",
  "Python", "React", "Ruby", "SQL", "Swift", "Vue.js"
];

// Extract all text content from the entire document
const pageText = document.body.innerText;

// Split the text into tokens, preserving meaningful special characters
const tokens = pageText
  .split(/[\s,;!?(){}<>[\]:"'`~]+/)
  .filter(Boolean);

// Normalize tokens and skills for case-insensitive comparison
const normalizedTokens = tokens.map(token => token.toLowerCase());
const normalizedSkills = skillsList.map(skill => skill.toLowerCase());

// Find matches by checking each normalized skill against the tokens
const foundSkills = skillsList.filter(skill => {
  const normalizedSkill = skill.toLowerCase();
  return normalizedTokens.includes(normalizedSkill);
});

// Log the matched skills to the console
console.log("Skills found:", foundSkills);