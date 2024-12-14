document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the data stored by the content script
    chrome.storage.local.get(["foundSkillsByCategory"], (data) => {
      const foundSkillsByCategory = data.foundSkillsByCategory || {};
  
      const container = document.getElementById("skills-container");
  
      // If no categories found, display a fallback message
      const categoryKeys = Object.keys(foundSkillsByCategory);
      if (categoryKeys.length === 0) {
        container.textContent = "No skills found on this page. Or try refreshing.";
        return;
      }
  
      // Build a visual representation of the categories and skills
      categoryKeys.forEach(category => {
        const skills = foundSkillsByCategory[category];
        if (!skills || skills.length === 0) return; // skip empty categories
  
        // Create a category header
        const catHeader = document.createElement("div");
        catHeader.className = "category";
        catHeader.textContent = category;
        container.appendChild(catHeader);
  
        // Create a list of skills for this category
        const ul = document.createElement("ul");
        skills.forEach(skill => {
          const li = document.createElement("li");
          li.textContent = skill;
          ul.appendChild(li);
        });
        container.appendChild(ul);
      });
    });
  });