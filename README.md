# blessed-standup

This is a tool for teams to share their daily standup status from the comfort of
their terminal with their team. It is written as an example
[react-blessed](https://github.com/Yomguithereal/react-blessed) application that
interacts with a Google Drive spreadsheet.

## Usage

This looks for a .blessedstanduprc file in the directory where you are running
it from. This file requires a `CLIENT_ID` and `CLIENT_SECRET` to interact with
the Google Drive API. To generate these:

0. https://console.developers.google.com/project
1. Create or select a project
2. Enable and Manage APIs -> Drive API -> [Enable API]
3. Select [Credentials] on the left navigation menu
4. Create client ID
5. Configure consent screen
6. Select "Other" for “Application type” 
7. Put your Client ID and Client Secret into `.blessedstanduprc`

### Required Google Spreadsheet structure:

File name: **Blessed Standup**

Sheet name: **Status**

| Date       | Human                  | Yesterday | Today | Blockers |
|------------|------------------------|-----------|-------|----------|
| 12/25/2015 | `git config user.name` | Text      | Text  | Text     |

Sheet name: **Team**

| Member name            |
|------------------------|
| `git config user.name` |
| `git config user.name` |
| `git config user.name` |
| ...                    |


## MIT License

Copyright (c) 2015 Dustan Kasten | dustan.kasten@gmail.com Licensed under the MIT license.

