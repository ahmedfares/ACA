# ADR 0002: Abstract AI Provider

## Status

Accepted.

## Context

AI capabilities, prices, and reliability change quickly. The product must avoid coupling domain logic to one SDK or provider.

## Decision

All AI calls go through an `AiProvider` interface. Prompts are versioned and outputs are validated with schemas before persistence.

## Consequences

- Provider changes become localized.
- Tests can mock AI behavior.
- Prompt/version metadata can be stored with generated records.
