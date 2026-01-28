# Claude/Codex Review Loop (Quick Start)

Use this when you want to run a review loop without outside help.

## 1) Verify Codex MCP is available
In Claude Code, run `/mcp` and confirm `codex-cli` is enabled. If it is disabled, enable it in the /mcp panel.

## 2) Implement (Claude Code)
Paste this prompt into Claude Code:

```
TASK: <describe what you want built>

WORKFLOW:
1) Implement the task fully.
2) Call Codex via MCP to review the changes.
3) Fix issues raised by Codex.
4) If Codex found significant issues, request one more review.

FOCUS AREAS:
- Bugs
- Edge cases
- Security concerns
- Performance risks
- Missing tests
```

## 3) Review request (Codex via MCP)
If you need a direct review request, paste this into Claude Code:

```
Use the codex-cli MCP tool to review my changes. Use the git diff from the last commit.
Prioritize bugs, edge cases, security concerns, performance issues, and missing tests.
Return findings as:
1) Critical issues
2) Major issues
3) Minor issues
4) Missing tests
5) Suggested fixes
```

## 4) Fix + optional re-review
- Apply fixes in Claude Code.
- If there were critical/major issues, ask Codex for a final pass using the same review request.

## Troubleshooting
- If `codex-cli` does not start, run this once in a terminal to refresh install:
  `npx -y @cexll/codex-mcp-server`

## Stop condition
- No critical/major issues remaining and any required tests pass.
