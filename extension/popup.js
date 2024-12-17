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

    // 3. Short delay to let the content script finish
    setTimeout(() => {
      // 4. Retrieve matchedSkills from chrome.storage.local
      chrome.storage.local.get(["matchedSkills"], (data) => {
        const matchedSkills = data.matchedSkills || {};
        container.innerHTML = ""; // Clear existing content

        if (Object.keys(matchedSkills).length === 0) {
          container.textContent = "No skills found on this page.";
          return;
        }

        // Display the matched skills
        const ul = document.createElement("ul");
        for (const [canonicalSkill] of Object.entries(matchedSkills)) {
          const li = document.createElement("li");
          li.textContent = canonicalSkill;
          ul.appendChild(li);
        }
        container.appendChild(ul);
      });
    }, 500); // half-second delay to ensure 'program.js' finishes
  });
});