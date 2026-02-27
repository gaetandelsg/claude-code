# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

---

## Repository Overview

**Repository:** `gaetandelsg/claude-code`
**Status:** New repository — no source code has been committed yet. Update this file as the project evolves.

---

## Git Workflow

### Branch Naming

- AI-driven branches must follow this pattern: `claude/<task-slug>-<session-id>`
  - Example: `claude/claude-md-mm4zkbza4lecb1yu-MT5VG`
- Never push to `main` or `master` directly without explicit user permission.
- Always use the branch specified at the start of a session.

### Commit Signing

This repository requires signed commits via SSH:

```
git config commit.gpgsign true
git config gpg.format ssh
git config user.signingkey /home/claude/.ssh/commit_signing_key.pub
```

Do not bypass commit signing with `--no-gpg-sign` or `--no-verify`.

### Pushing Changes

Always push with tracking set:

```bash
git push -u origin <branch-name>
```

If a push fails due to network errors, retry with exponential backoff: 2s, 4s, 8s, 16s (max 4 retries).

Do **not** force-push (`--force`) to shared branches without explicit user instruction.

### Commit Messages

- Use the imperative mood: "Add feature" not "Added feature"
- Keep the subject line under 72 characters
- Separate subject from body with a blank line
- Explain *why* a change was made in the body, not just *what*

---

## Development Setup

> This section should be updated once the project has a defined stack and dependencies.

When setting up the project for the first time:

1. Clone the repository
2. Install dependencies (document the command here once known)
3. Copy any environment template files (document once known)
4. Run the test suite to verify a working baseline

---

## Code Conventions

> This section should be filled in once language, framework, and tooling choices are made.

General principles to follow until specific conventions are defined:

- Prefer editing existing files over creating new ones.
- Only add code that is directly necessary for the task at hand — avoid speculative abstractions.
- Do not add comments, docstrings, or type annotations to code you did not change.
- Validate only at system boundaries (user input, external APIs); trust internal code.
- Do not introduce backwards-compatibility shims for code that has no prior consumers.

---

## Testing

> This section should be updated once a test framework is in place.

- Always run the full test suite before committing.
- Do not skip failing tests to make CI pass — fix the root cause.
- New features should include tests; bug fixes should include a regression test.

---

## Security

- Never commit secrets, credentials, API keys, or tokens.
- Do not add `.env` files to version control — use `.env.example` as a template.
- Avoid introducing common vulnerabilities: SQL injection, XSS, command injection, insecure deserialization, SSRF.
- If a security issue is discovered, note it prominently and do not push the vulnerable code.

---

## Working with AI Assistants

### What AI assistants should always do

- Read files before editing them.
- Understand the existing code before suggesting modifications.
- Confirm before taking irreversible or high-blast-radius actions (deleting files, force-pushing, dropping data, modifying CI/CD).
- Keep changes minimal and focused on the task.

### What AI assistants should never do

- Push to a branch other than the one specified for the session.
- Bypass git hooks (`--no-verify`) or signing without explicit instruction.
- Delete files, branches, or data without explicit user approval.
- Make speculative "improvements" beyond what was asked.
- Commit secrets or credentials.

---

## Repository History

| Date | Change |
|------|--------|
| 2026-02-27 | Repository created; initial CLAUDE.md added |

> Keep this log updated with major structural or workflow changes.
