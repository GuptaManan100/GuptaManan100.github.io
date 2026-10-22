---
title: "Invisible by Design: the Multigres pooler"
description: "What it takes to make a Postgres connection pooler invisible to your app: session settings, shared prepared statements, LISTEN/NOTIFY and failed commits."
publishDate: "2026-10-02"
tags: ["talk", "postgres", "multigres", "connection-pooling", "supabase"]
talk:
  youtube: "https://youtu.be/YsgkxiprN-8"
  event: "Supabase Select 2026"
  slides: "/slides/invisible-by-design.pdf"
---

**Presented at [Supabase Select 2026](https://select.supabase.com) in San Francisco.** The full title is *Invisible by Design: How Multigres keeps Postgres behaving like Postgres*.

A connection pooler does its job when your app can't tell it's there. This talk goes inside the Multigres pooler to show what that takes: tracking session settings (including Postgres's unusual `DateStyle`), sharing prepared statements across clients and recovering when a schema change makes them stale, scaling `LISTEN`/`NOTIFY` through one shared connection, and matching Postgres exactly when you commit a failed transaction.

**Related reading:** [Pooling without choosing a mode](/bytes/pooling-without-choosing-a-mode/) · [One parse per query, no matter how many gateways](/bytes/one-parse-per-query-no-matter-how-many-gateways/) · [Running a real Postgres app on Multigres, at scale](/bytes/drop-in-postgres-proven-with-a-real-app/)
