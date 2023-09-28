figma.showUI(__html__, { width: 300, height: 150 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'run') {
    const email = msg.email;
    await createStickiesForOpenIssues(email); // Pass the email as an argument here
    figma.closePlugin();
  }
};


async function fetchOpenIssuesFromJIRA(assigneeEmail: string) {
  const proxyURL = "https://PROXYURL/";
  const jiraParams = `project%20AND%20assignee%3D'${encodeURIComponent(assigneeEmail)}'%20AND%20statusCategory%3D%22New%22`;
  const auth = "login:password";
  const headers = {
    "Content-Type": "application/json"
  };
  const response = await fetch(proxyURL, {
    method: "POST",
    headers,
    body: JSON.stringify({ jiraParams, auth })
  });

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  console.log("Response data:", data);

  if (!data.issues) {
    console.error("Data does not contain an 'issues' property");
    throw new Error("Data does not contain an 'issues' property");
  }

  const issues = data.issues.map((issue: { key: string; fields: { summary: string } }) => ({
    title: issue.fields.summary,
    url: `https://JIRA.URL/browse/${issue.key}`,
  }));

  return issues;
}

async function createStickyWithText(title: string, url: string, y: number) {
  const sticky = figma.createSticky();
  sticky.y = y;

  // Set the sticky color to yellow
  sticky.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 0.5 } }];

  // Load the font before setting the text characters
  await figma.loadFontAsync(sticky.text.fontName as FontName);

  // Set the title and URL text
  const urlText = url.split('/browse/')[1];
  sticky.text.characters = `${title}\n\n${urlText}`;

  // Make the title bold
  const titleEndIndex = title.length;
  const boldFontName: FontName = {
    family: (sticky.text.fontName as FontName).family,
    style: "Bold",
  };
  await figma.loadFontAsync(boldFontName);
  sticky.text.setRangeFontName(0, titleEndIndex, boldFontName);

  // Set the hyperlink for the URL text
  const urlStartIndex = sticky.text.characters.indexOf(urlText);
  const urlEndIndex = urlStartIndex + urlText.length;
  sticky.text.setRangeHyperlink(urlStartIndex, urlEndIndex, { type: "URL", value: url });

  figma.currentPage.appendChild(sticky);

  // Return the created sticky
  return sticky;
}

async function createStickiesForOpenIssues(assigneeEmail: string) {
  const issues = await fetchOpenIssuesFromJIRA(assigneeEmail);

  let currentY = 0;
  const offset = 50;

  console.log("Creating stickies for issues:", issues);

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const sticky = await createStickyWithText(issue.title, issue.url, currentY);
    currentY = sticky.y + sticky.height + offset;
  }

  figma.closePlugin();
}