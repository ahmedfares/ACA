# ADR 0001: Use a Modular Monolith for Phase 1

## Status

Accepted.

## Context

The product has many domains, but the initial team is one experienced developer with about two hours per week. Microservices would add operational cost and slow delivery.

## Decision

Use a Next.js modular monolith with clear feature boundaries, shared validation, Prisma persistence, and an AI provider interface.

## Consequences

- Faster development and simpler deployment.
- Easier end-to-end testing.
- Future services can be extracted only when real scale or ownership pressure exists.
