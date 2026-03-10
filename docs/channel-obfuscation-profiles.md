# Channel Obfuscation Profiles

This page defines the obfuscation layer used by channel modules when transporting `id` and `encrypted_data` between implant/session and core C2.

## Purpose

Obfuscation profiles are a transport-shaping layer on top of the base sync contract. They do **not** replace app-level implant↔C2 encryption.

- App-level encryption (`encrypted_data`) remains mandatory.
- Obfuscation controls how `id` and `encrypted_data` are embedded in channel transport fields.

## What a profile can control

A profile may define where and how fields are placed, for example:

- HTTP headers
- query parameters
- cookies
- body fields
- mixed placement (split across multiple locations)

A profile may also define reversible encoding/wrapping, for example:

- base64/base64url variants
- field renaming/aliasing
- optional channel-layer wrapping/encryption
- padding/noise fields

## Profile storage and ownership

- Profiles are persisted in durable storage.
- Profile format is YAML.
- Channel module owns runtime loading, validation, and execution of profiles.
- Core C2 owns management UX/API and policy decisions.

## YAML shape (example)

```yaml
profile_id: http-profile-01
channel_type: http
enabled: true
version: 1

mapping:
  id:
    source: id
    target:
      location: header
      key: X-Request-ID
    transform:
      - type: base64url

  encrypted_data:
    source: encrypted_data
    target:
      location: body
      key: data
    transform:
      - type: base64

  noise:
    - location: query
      key: v
      value: "20260310"
```

## Runtime flow

Inbound (implant/session -> channel -> core):

1. Channel receives obfuscated transport payload.
2. Channel applies active profile to extract canonical fields (`id`, `encrypted_data`).
3. Channel sends canonical request to C2 sync endpoint.

Outbound (core -> channel -> implant/session):

1. Channel receives canonical response (`outbound.agent_message`).
2. Channel applies active profile to re-embed/obfuscate transport payload.
3. Channel returns transport-shaped response to implant/session.

## Management model

Channel modules expose RabbitMQ RPC management endpoints so core can manage profiles.

### Example RPC actions

- `obf.profile.list`
- `obf.profile.get`
- `obf.profile.create`
- `obf.profile.update`
- `obf.profile.delete`
- `obf.profile.activate`
- `obf.profile.validate`

## Security boundaries

- Obfuscation is not a substitute for cryptography.
- Channel must stay plaintext-blind for implant business semantics.
- Profile logic must not require decrypting `encrypted_data`.
- Changes to active profile should be auditable (who/when/what changed).
