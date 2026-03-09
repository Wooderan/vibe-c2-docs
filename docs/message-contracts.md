# Message Contracts

This page defines initial RabbitMQ message contract shapes.

## `inbound.agent_message`

Purpose: carry raw/normalized inbound traffic from a channel module into core processing.

### Envelope

```json
{
  "message_id": "01JNX6R8VQ2H3CN4K9EJ1T2Z7M",
  "correlation_id": "agent-7f3b8d2d-9a31-4f3f-a0e5-0e5f9476b4ac",
  "type": "inbound.agent_message",
  "version": "1.0",
  "timestamp": "2026-03-09T21:05:12.481Z",
  "source": {
    "module": "channel-http",
    "module_instance": "channel-http-1",
    "transport": "http",
    "tenant": "default"
  },
  "payload": {
    "channel": {
      "channel_type": "http",
      "listener_id": "listener-main",
      "remote_addr": "198.51.100.24",
      "user_agent": "implant/1.2"
    },
    "agent": {
      "agent_id": "a-9f7c2d19",
      "session_id": "s-2b77df",
      "provider": "go-implant",
      "provider_version": "1.2.0",
      "host": "WS-0192",
      "platform": "windows",
      "arch": "amd64"
    },
    "message": {
      "kind": "checkin",
      "encoding": "base64",
      "content_type": "application/octet-stream",
      "body": "SGVsbG8gZnJvbSBpbXBsYW50",
      "size_bytes": 24
    },
    "security": {
      "auth_context": "mtls",
      "signature_present": true,
      "integrity_ok": true
    },
    "meta": {
      "receive_count": 1,
      "trace_id": "tr-6fd92d8b",
      "notes": []
    }
  }
}
```

### Required top-level fields

- `message_id`: unique message identifier (`ULID` recommended).
- `correlation_id`: end-to-end flow/group identifier.
- `type`: fixed value `inbound.agent_message`.
- `version`: schema version string (start with `1.0`).
- `timestamp`: RFC3339 UTC timestamp.
- `source`: producing module metadata.
- `payload`: message body.

### Required payload fields (v1)

- `payload.channel.channel_type`
- `payload.agent.agent_id`
- `payload.agent.provider`
- `payload.message.kind`
- `payload.message.encoding`
- `payload.message.body`

### Validation rules (v1)

- Reject when `type != inbound.agent_message`.
- Reject when required fields are missing.
- Reject when `timestamp` is not parseable RFC3339.
- Reject when `message.encoding` is unknown.
- Accept unknown extra fields for forward compatibility.

### RabbitMQ routing (proposal)

- Exchange: `c2.inbound`
- Routing key: `agent.message.<channel_type>`
- Queue (core consumer): `core.inbound.agent_message.v1`
- DLQ: `core.inbound.agent_message.v1.dlq`

### Processing expectations

- Channel module publishes at-least-once.
- Core server treats `message_id` as idempotency key.
- Translator/provider resolution happens after envelope validation.
