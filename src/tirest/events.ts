import type { EventLookup, EventName, Events, Tirest } from 'tirest/types'

const eventLookup: EventLookup = {}

export function triggerEvent(tirest: Tirest, eventName: EventName): void {
  if (!eventLookup[tirest.id] || !eventLookup[tirest.id]![eventName]) return

  for (const callback of eventLookup[tirest.id]![eventName]!) {
    callback()
  }
}

export function clearEvents(tirest: Tirest): Events {
  const events = eventLookup[tirest.id]

  if (!events) return {}

  delete eventLookup[tirest.id]

  return events
}

export function addEvents(tirest: Tirest, events: Events): void {
  if (!eventLookup[tirest.id]) eventLookup[tirest.id] = {}

  for (const eventName in events) {
    if (!events[eventName as EventName]) continue

    if (!eventLookup[tirest.id]![eventName as EventName]) {
      eventLookup[tirest.id]![eventName as EventName] = []
    }

    for (const callback of events[eventName as EventName]!) {
      eventLookup[tirest.id]![eventName as EventName]?.push(callback)
    }
  }
}

export function removeEvents(tirest: Tirest, events: Events): Events {
  if (!eventLookup[tirest.id]) return {}

  const res: Events = {}

  for (const eventName in events) {
    if (
      !eventLookup[tirest.id]![eventName as EventName] ||
      !events[eventName as EventName]
    )
      continue

    for (const callback of events[eventName as EventName]!) {
      for (
        let index: number = 0;
        index < eventLookup[tirest.id]![eventName as EventName]!.length;
        index++
      ) {
        if (
          eventLookup[tirest.id]![eventName as EventName]![index] === callback
        ) {
          if (!res[eventName as EventName]) res[eventName as EventName] = []

          res[eventName as EventName]!.push(
            ...eventLookup[tirest.id]![eventName as EventName]!.splice(
              index,
              1,
            ),
          )

          index--
        }
      }
    }
  }

  return res
}
