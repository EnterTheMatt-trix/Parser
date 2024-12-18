document.addEventListener("DOMContentLoaded", () => {
  const scanButton = document.getElementById("scanButton");
  const container = document.getElementById("skills-container");

  scanButton.addEventListener("click", async () => {
    // 1. Query the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 2. Execute 'program.js' on the current tab
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["program.js"]  // The content script file
    });

    // 3. Short delay to let 'program.js' finish parsing
    setTimeout(() => {
      // 4. Retrieve matchedSkills from chrome.storage.local
      chrome.storage.local.get(["matchedSkills"], (data) => {
        const matchedSkills = data.matchedSkills || {};
        container.innerHTML = ""; // Clear existing content

        if (Object.keys(matchedSkills).length === 0) {
          container.textContent = "No skills found on this page.";
          return;
        }

        // Convert matchedSkills object into an array of skill names
        const skillNames = Object.keys(matchedSkills);

        // Sort the skill names alphabetically (case-insensitive)
        skillNames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

        // Create a bullet list of sorted skills
        const ul = document.createElement("ul");
        skillNames.forEach(skillName => {
          const li = document.createElement("li");
          li.textContent = skillName;
          ul.appendChild(li);
        });

        container.appendChild(ul);
      });
    }, 500); // half-second delay to ensure 'program.js' finishes
  });
});