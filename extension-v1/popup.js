// popup.js

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve found skills from chrome.storage
    chrome.storage.local.get(["foundSkills"], (data) => {
      const skillsDiv = document.getElementById("skills");
      const foundSkills = data.foundSkills || [];
  
      if (foundSkills.length === 0) {
        skillsDiv.textContent = "No skills found on this page.";
      } else {
        skillsDiv.textContent = foundSkills.join(", ");
      }
    });
  });