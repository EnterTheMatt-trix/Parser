document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["foundSkillsByCategory"], (data) => {
      const foundSkillsByCategory = data.foundSkillsByCategory || {};
      const container = document.getElementById("skills-container");
  
      if (!Object.keys(foundSkillsByCategory).length) {
        container.textContent = "No skills found on this page.";
        return;
      }
  
      function displayMatches(node, parentElement, pathStack = []) {
        for (const [key, value] of Object.entries(node)) {
          if (key === "__matches") {
            // This is an array of matched skills
            const ul = document.createElement("ul");
            value.forEach(skill => {
              const li = document.createElement("li");
              li.textContent = skill;
              ul.appendChild(li);
            });
            parentElement.appendChild(ul);
          } else if (typeof value === "object") {
            // This is another subcategory
            const subCatDiv = document.createElement("div");
            subCatDiv.style.marginLeft = (pathStack.length * 10) + "px";
            subCatDiv.textContent = key;
            parentElement.appendChild(subCatDiv);
  
            // Recurse
            displayMatches(value, parentElement, [...pathStack, key]);
          }
        }
      }
  
      displayMatches(foundSkillsByCategory, container);
    });
  });