---
title: "Horizontal scaling and sharding with Multigres"
description: "Why Multigres bundles pooling, HA, backups and sharding into one system for Postgres, and how its query-serving layer works."
publishDate: "2026-02-07"
tags: ["talk", "postgres", "multigres", "sharding", "connection-pooling"]
talk:
  youtube: "https://www.youtube.com/live/UHtbhTi9XTQ?t=18812"
  event: "PGDay Mumbai 2026"
  slides: "/slides/horizontal-scaling-and-sharding-with-multigres.pdf"
---

**Presented at PGDay Mumbai 2026 at IIT Bombay.** The full title is *Horizontal scalability and intelligent sharding with Multigres on Postgres*. The video is the full day's livestream; the player starts at my talk.

Running Postgres at scale usually means stitching tools together: one for connection pooling, another for high availability, another for backups, and eventually something for sharding. Multigres aims to be one system that does all of it, the way Vitess does for MySQL, while your application still sees a single Postgres.

I go over the design principles behind Multigres (including "no humans": anything an operator would do from outside, Multigres should do itself), its architecture, and then the query-serving side I work on. That includes consolidating identical prepared statements across thousands of client connections, and keeping pooled connections that carry session settings like `TimeZone` reusable.

**Related reading:** [Two jobs, two processes: why Multigres has its own pooler](/bytes/two-jobs-two-processes/) · [One parse per query, no matter how many gateways](/bytes/one-parse-per-query-no-matter-how-many-gateways/)
