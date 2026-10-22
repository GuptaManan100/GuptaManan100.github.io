---
title: "Pooling the Unpoolable"
description: "How the Multigres pooler supports transactions, temp tables and LISTEN/NOTIFY without falling back to session pooling."
publishDate: "2026-08-20"
tags: ["talk", "postgres", "multigres", "connection-pooling", "pgbouncer"]
talk:
  youtube: "https://youtu.be/4alPfzT0R3Q"
  event: "PGDay Hyderabad 2026"
  slides: "/slides/pooling-the-unpoolable.pdf"
---

**Presented at Hyderabad PGDays 2026 at JNTU Hyderabad.**

PgBouncer makes you pick a mode. Statement mode pools well but breaks transactions. Transaction mode breaks `LISTEN`, advisory locks and temp tables. Session mode supports everything but barely pools at all. Multigres doesn't make you choose. It parses every query at the gateway, tracks why a session needs a dedicated connection (an open transaction, a temp table, a `COPY`, a suspended portal), and goes back to the shared pool as soon as the last of those reasons is cleared.

`LISTEN`/`NOTIFY` doesn't fit that model, because a listener stays subscribed for hours, and pinning a connection for each one would starve the pool. So we turn the problem around and pool the channels instead of the connections: the pooler listens on every requested channel over a single connection and fans each notification out to the clients subscribed to it. I close with the costs: an extra hop, more CPU and memory than PgBouncer, and needing to find *every* reason a connection has to stay reserved.

**Related reading:** [Pooling without choosing a mode](/bytes/pooling-without-choosing-a-mode/) · [Testing connection pooling in Multigres](/bytes/testing-connection-pooling-multigres/)
