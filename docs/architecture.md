# Architecture Draft

## High-Level Components

- **Operator UI / API Client**: interface for operators.
- **Teamserver API**: authentication, task management, and orchestration.
- **Agent Channel**: secure communication path between agents and teamserver.
- **Persistence Layer**: stores users, agents, tasks, and audit logs.
- **Telemetry / Logging**: captures operational and security events.

## Initial Deployment Shape

- Single teamserver instance for early development.
- One primary database.
- Optional reverse proxy for TLS termination.

## Trust Boundaries

- Internet/agent network to teamserver.
- Operator network to teamserver.
- Teamserver to database.

## Baseline Security Controls

- Encrypted transport for all external connections.
- RBAC for all operator actions.
- Strict audit logging for sensitive workflows.

## Pending Decisions

1. API protocol style and versioning strategy.
2. Queueing model for task dispatch.
3. Database engine and schema partitioning strategy.
