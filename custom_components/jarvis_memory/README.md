# JARVIS Memory

Independent persistent memory for the Home Assistant voice assistant. It does not modify or depend on `custom_components/jarvis` (JARVIS Core V3).

## Entities

- `sensor.jarvis_memory` — number of stored memories; its `memories` attribute contains the saved entries.
- `text.jarvis_memory_input` — writable memory input. Writing text stores it persistently and clears the input again.

## Services

- `jarvis_memory.remember` with `text` and optional `category`
- `jarvis_memory.forget` with `text` (removes entries containing that text)
- `jarvis_memory.clear`

## Voice assistant integration

Expose `sensor.jarvis_memory` and `text.jarvis_memory_input` to the Home Assistant conversation agent. Add instructions to the agent prompt such as:

> When the user explicitly says to remember or retain something, save the information by setting `text.jarvis_memory_input`. When answering a question that depends on a remembered fact, consult `sensor.jarvis_memory` and use its `memories` attribute. Never claim to have remembered something unless it has been written to the memory input. When the user asks to forget something, use the `jarvis_memory.forget` service if available.

The memory is stored using Home Assistant's local storage and survives Home Assistant restarts.
