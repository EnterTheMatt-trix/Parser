const technicalSkills = [
  "Angular", "C", "C#", "Objective-C", "C++", "CSS", "Docker", "Go", "HTML", "Java", "JavaScript", 
  "Kotlin", "Kubernetes", "MongoDB", "Node.js", "PHP", "Python", "React", "Ruby", 
  "SQL", "Swift", "Vue.js"
];

function extractSkills(text) {
  let skillsFound = [];
  for (let skill of technicalSkills) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      skillsFound.push(skill);
    }
  }
  return skillsFound.join(', ');
}

// Process each line of the page's text content
document.body.innerText.split('\n').forEach(line => {
  let skills = extractSkills(line);
  if (skills) {
    // Log to console instead of alerting to prevent blocking and endless alerts
    console.log('Technical skills found:', skills);
  }
});
