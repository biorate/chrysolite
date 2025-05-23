---
to: <%= h.root(`${ROOT}/pnpm-workspace.yaml`) %>
unless_exists: true
---
packages:
  - apps/*/**
  - packages/*/**
