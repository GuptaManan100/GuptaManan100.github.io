---
title: "Connection Pooling Beyond PgBouncer"
description: "Building a custom connection pooler for Multigres: extended query protocol, per-user pools for RLS, and prepared statement consolidation."
publishDate: "2026-05-20"
tags: ["talk", "postgres", "multigres", "connection-pooling", "pgbouncer"]
talk:
  youtube: "https://youtu.be/dkAeCM4XvG8"
  event: "PGConf.dev 2026"
  slides: "/slides/connection-pooling-beyond-pgbouncer.pdf"
---

**Presented at [PGConf.dev 2026](https://2026.pgconf.dev/session/692) in Vancouver.** The full title is *Connection Pooling Beyond PgBouncer: A Custom Approach for Distributed PostgreSQL*.

Existing poolers like PgBouncer work at the protocol level, with no deep integration into a distributed database. This talk is about the pooler we built from scratch for Multigres instead. It natively supports the extended query protocol (Parse/Bind/Execute), keeps per-user connection pools so Row-Level Security keeps working, and consolidates prepared statements across clients.

I go through the problems we hit along the way. Connections are routed by their session settings into hash buckets, with an LRU cache so comparing settings is a pointer-equality check. Pinning connections for transactions has to be balanced against keeping the pool busy. The extended query protocol has to survive a distributed query path. I also explain the three-tier pool layout (admin, regular and reserved) and where we traded connection reuse for protocol correctness.

**Related reading:** the Multigres connection pooling series, starting with [Two jobs, two processes](/bytes/two-jobs-two-processes/), then [Per-user pools that share fairly](/bytes/per-user-pools-that-share-fairly/), [Pooling without choosing a mode](/bytes/pooling-without-choosing-a-mode/) and [One parse per query](/bytes/one-parse-per-query-no-matter-how-many-gateways/)
