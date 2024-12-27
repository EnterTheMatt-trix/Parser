document.addEventListener("DOMContentLoaded", () => {
  const scanButton = document.getElementById("scanButton");
  const copyButton = document.getElementById("copyButton");
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
          copyButton.disabled = true;
          return;
        }

        // Convert matchedSkills object into an array of skill names
        const skillNames = Object.keys(matchedSkills);

        // Sort the skill names alphabetically (case-insensitive)
        skillNames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

        // Join the sorted list into a comma-separated string
        const commaSeparatedSkills = skillNames.join(", ");

        container.textContent = commaSeparatedSkills;
        copyButton.disabled = false; // Enable copy button when skills are found
      });
    }, 500); // half-second delay to ensure 'program.js' finishes
  });

  copyButton.addEventListener("click", () => {
    chrome.storage.local.get(["matchedSkills"], (data) => {
      const matchedSkills = data.matchedSkills || {};
      const skillNames = Object.keys(matchedSkills);
      const sortedSkills = skillNames.sort((a, b) => 
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ).join(", ");

      // Copy to clipboard
      navigator.clipboard.writeText(sortedSkills).then(() => {
        // Temporarily change button text to indicate success
        const originalText = copyButton.textContent;
        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy:', err);
        copyButton.textContent = "Failed to copy";
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 1500);
      });
    });
  });
});