1. point out where in the webpage the skill was found
2. make the skillsList dynamic
3. Synonym or Keyword Expansion
  Idea: Not all job descriptions use the exact skill names. For instance, they might say “ReactJS” instead of “React.” You could maintain a dictionary of synonyms or    alternative spellings for each skill. Then when you parse the tokens, you check if any synonym also appears.
  Example:
	  •	React could be in synonyms: [ "React", "React.js", "ReactJS" ]
	  •	Node.js synonyms: [ "Node", "Node.js", "NodeJS" ] 
  When matching, you’d check if the token is in any of the synonyms for the skill. This helps capture more variations.
4. Category-Based Grouping
  Idea: Organize skills by category (e.g., programming languages, frameworks, databases, DevOps tools) and highlight what categories are most in demand.
  Example:
	  •	Languages: C, C++, Python, Go
	  •	Frameworks: Angular, React, Vue.js
	  •	Databases: SQL, MongoDB
	  •	DevOps: Docker, Kubernetes
  When you parse the text, you can group matched skills by category to see how the job posting’s requirements break down.
5. Partial/Fuzzy Matching
  Idea: Sometimes job postings have typographical errors or slight variations. For example, “TSQL” might appear instead of “SQL.” You could implement a fuzzy    matching algorithm (like Levenshtein distance) that allows for minor spelling differences.
  Example:
	  •	If the token is “Kubernetes”, consider “K8s” close enough to count.
	  •	A threshold can ensure you don’t get too many false positives.
6. Highlight Skills in the Original Text

Idea: Instead of just logging matches, visually highlight them on the page. This would make your Chrome extension more interactive, allowing you to color-code or underline the skills in real-time.

Example:
	•	After identifying tokens, traverse the DOM and wrap matched skills in a <span> with a special class or inline style.
	•	This is more of a front-end integration step, but it significantly improves user experience.
