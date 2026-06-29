---
name: impeccable
description: Engineering craftsmanship standard for writing impeccable, production-grade code. Use when the user wants code held to the highest bar — clean, correct, well-named, minimal, and self-explanatory — or asks for an "impeccable", "polished", or "production-ready" implementation.
---

# Impeccable

A standard for code that reads as if it were always meant to be there. Impeccable
code is not clever — it is obvious, correct, and quiet.

## Principles

1. **Read like the surrounding code.** Match the file's existing naming,
   comment density, and idioms. New code should be indistinguishable from
   well-written existing code.
2. **Smallest change that fully solves the problem.** No speculative
   abstraction, no unrelated refactors, no "while I'm here" edits.
3. **Names carry intent.** A name should make a comment unnecessary. Prefer
   `pendingInvoices` over `data2`. Verbs for functions, nouns for values.
4. **Make illegal states unrepresentable.** Use types, enums, and narrow
   interfaces so wrong code won't compile or won't typecheck.
5. **Handle the error path first.** Validate inputs, return early, keep the
   happy path unindented at the bottom.
6. **No dead weight.** Remove unused imports, commented-out code, and
   stale TODOs. Every line earns its place.

## Checklist before declaring done

- [ ] Does it compile / typecheck / lint with zero new warnings?
- [ ] Are edge cases (empty, null, max, concurrent) handled?
- [ ] Is there a test that fails without the change and passes with it?
- [ ] Could a teammate understand this without asking you?
- [ ] Did you remove everything you added for debugging?
- [ ] Are public functions documented where the codebase documents them?

## Anti-patterns to reject

- Catching errors only to swallow them silently.
- Comments that restate the code (`i++ // increment i`).
- Deep nesting where a guard clause would flatten it.
- Premature optimization that obscures intent.
- Copy-pasted blocks that should be one function.

## When unsure

State the trade-off plainly and pick the option that is easiest to delete
later. Reversible decisions are cheap; make them quickly and move on.
