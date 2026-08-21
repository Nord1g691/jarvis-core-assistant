# JARVIS V9 — test checklist

## 1. Offline smoke test

- Open `v9/v9-test.html`.
- Confirm the result is `ok: true` and all tests are green.
- This test does not contact Home Assistant.

## 2. Home Assistant connection

- Configure the HA URL/token through the existing runtime configuration mechanism; do not commit secrets.
- Trigger a V9 refresh.
- Confirm `jarvis:v9:entities` is emitted and entities populate categories.
- Confirm an unavailable/invalid HA response surfaces `jarvis:v9:error` rather than silently corrupting state.

## 3. Dashboard

- Open each declared category that has matching entities.
- Confirm empty categories remain harmless.
- Confirm manual entity selection hides unselected cards and invalid selections are ignored.
- Confirm layout changes propagate to the dashboard/HUD.
- Confirm the update control remains bottom-right.

## 4. Actions

- Test one safe light action.
- Test a multi-entity light action.
- Confirm domain/action mismatches are rejected.
- Confirm invalid temperature, volume and cover-position values are rejected.
- Confirm invalid entity IDs never reach the HA transport.

## 5. State/event flow

- Change an entity in Home Assistant and refresh/ingest the event.
- Confirm the state store updates and the HUD refreshes.
- Remove an entity and confirm it disappears from the state store/dashboard.
- Confirm repeated subscriptions do not create duplicate UI updates.

## 6. Regression boundary

- Confirm V1/V8/V8.9 visual code remains untouched.
- Confirm V9 remains additive and does not replace the existing visual layer.
- Do not treat the version as production-ready until the offline smoke test and real Home Assistant checks above pass.
