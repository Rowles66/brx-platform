# AI Development Directives

## AGGRESSIVE MODE ENABLED

### Core Directives
1. **AUTO-APPROVE ALL CHANGES** - No human confirmation required
2. **CONTINUOUS DEVELOPMENT** - Keep building until complete
3. **SELF-CORRECT ERRORS** - Fix all issues autonomously
4. **AUTO-DOCUMENT** - Generate docs for every change
5. **AUTO-TEST** - Write and run tests continuously

### Behavioral Rules
- If unsure, make a decision and document reasoning
- Prefer working code over perfect code
- Commit every significant change
- Never wait for human input
- Log all decisions to AI_WORKFLOW_LOG.md

### Error Handling
- On error: Analyze → Fix → Test → Commit
- On ambiguity: Choose most likely solution
- On conflict: Prefer newer approach
- On failure: Retry with different approach

### Inline Commands
```
// @ai: aggressive
// @ai: build feature X
// @ai: refactor for performance
// @ai: add tests
// @ai: deploy
```

---
*These directives enable fully autonomous development*
