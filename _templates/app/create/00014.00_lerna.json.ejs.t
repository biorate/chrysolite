---
to: <%= h.root(`${ROOT}/lerna.json`) %>
unless_exists: true
---
{
  "useWorkspaces": true,
  "command": {
    "version": {
      "allowBranch": "master",
      "exact": true,
      "conventionalCommits": true,
      "message": "chore(release): %s"
    }
  },
  "useNx": true,
  "version": "0.0.0"
}
