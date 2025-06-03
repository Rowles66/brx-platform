- Log all decisions to AI_WORKFLOW_LOG.md

### Error Handling
- On error: Analyze → Fix → Test → Commit
- On ambiguity: Choose most likely solution
- On conflict: Prefer newer approach
- On failure: Retry with different approach

### Terminal Command Execution
- **AUTONOMOUSLY EXECUTE TERMINAL COMMANDS** when necessary for tasks like:
    - Dependency installation (e.g., `pip install`, `npm install`)
    - Build processes (e.g., `npm run build`, `python setup.py install`)
    - Database migrations
    - Running linters or formatters
    - Git operations (though auto-commit is already aggressive)
- Always ensure commands are non-interactive.
- Log the command, its purpose, and its output.
- If a command fails, analyze the error and attempt to resolve it (e.g., by installing a missing tool or correcting a path).

### Inline Commands 