# Figma JIRA Issue Stickies Plugin

This Figma plugin allows you to fetch open issues assigned to a specified user from JIRA and create stickies in Figma for each issue.

## Features

- Fetch open issues assigned to a specified user from JIRA.
- Create a sticky in Figma for each fetched issue.
- Stickies contain the issue title and a hyperlink to the issue in JIRA.

## Usage

1. Install the plugin to your Figma account.
2. Run the plugin in Figma.
3. A dialog will appear, enter the email address of the assignee whose open issues you want to fetch.
4. Click the `Run` button.
5. The plugin will fetch the open issues from JIRA, create a sticky for each issue, and place them on the current Figma page.

## Development

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Build the plugin with `npm run build`.
4. Load the plugin in Figma.

## API

The plugin interacts with a proxy server to communicate with the JIRA API. Ensure to update the `proxyURL`, `jiraParams` and `auth` variables in the `fetchOpenIssuesFromJIRA` function accordingly.

## Contributing

Feel free to open issues or PRs if you find any problems or have suggestions for improvements.

## License

MIT
