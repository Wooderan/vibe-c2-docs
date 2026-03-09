# Message Flow (Implant ↔ C2)

This diagram documents how messages move between implants and the modular C2 stack.

## End-to-End Sequence

```mermaid
sequenceDiagram
    autonumber
    participant I as Implant
    participant CH as Channel Module
    participant MQ as RabbitMQ
    participant CS as Core Server
    participant TR as Translator Module
    participant IP as Implant Provider

    I->>CH: Beacon / check-in (transport-specific)
    CH->>MQ: Publish inbound.agent_message
    MQ->>CS: Deliver inbound.agent_message
    CS->>TR: Request decode/normalize
    TR->>IP: Map to implant/provider schema
    IP-->>TR: Parsed result + capabilities
    TR-->>CS: Normalized C2 event
    CS->>CS: Persist event + update state

    CS->>TR: Build task intent (C2-native)
    TR->>IP: Convert to implant command
    IP-->>TR: Provider command payload
    TR-->>CS: Encoded outbound command
    CS->>MQ: Publish outbound.task
    MQ->>CH: Deliver outbound.task
    CH-->>I: Send task to implant

    I->>CH: Task result / output
    CH->>MQ: Publish inbound.task_result
    MQ->>CS: Deliver inbound.task_result
    CS->>TR: Normalize response
    TR-->>CS: C2 result model
    CS->>CS: Persist result + audit log
```

## Responsibility Map

```mermaid
flowchart LR
    I[Implant] --> CH[Channel Module]
    CH --> MQ[(RabbitMQ)]
    MQ --> CS[Core Server]
    CS --> TR[Translator]
    TR --> IP[Implant Provider]
    IP --> TR
    TR --> CS
    CS --> MQ
    MQ --> CH
    CH --> I
```

## Notes

- `Channel` handles transport/session delivery only.
- `Translator` handles language/model conversion only.
- `Implant Provider` handles implant family specifics (commands/build/capabilities).
- `Core Server` owns orchestration, policy, persistence, and audit.
- All inter-service traffic should carry `message_id` and `correlation_id`.
