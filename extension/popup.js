document.addEventListener("DOMContentLoaded", () => {
  // Get the matched skills from storage
  chrome.storage.local.get(["matchedSkills"], (data) => {
    const matchedSkills = data.matchedSkills || {};
    const container = document.getElementById("skills-container");

    // If no skills were found, display a message
    if (Object.keys(matchedSkills).length === 0) {
      container.textContent = "No skills found on this page.";
      return;
    }

    // Create a list of matched skills
    const ul = document.createElement("ul");
    for (const [canonicalSkill, synonyms] of Object.entries(matchedSkills)) {
      const li = document.createElement("li");
      li.textContent = canonicalSkill; // Display the canonical skill name
      ul.appendChild(li);
    }

    container.textContent = ""; // Clear the loading message
    container.appendChild(ul);
  });
});