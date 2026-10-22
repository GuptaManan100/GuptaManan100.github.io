---
title: "Atomic Distributed Transactions in Vitess"
description: "How Vitess implements two-phase commit across shards, and how we fuzz it to check commits really are all-or-nothing."
publishDate: "2025-01-30"
tags: ["talk", "vitess", "mysql", "transactions", "distributed-systems"]
talk:
  youtube: "https://youtu.be/TjyzDlQEgdU"
  event: "MySQL Belgian Days 2025"
  slides: "/slides/atomic-distributed-transactions-in-vitess.pdf"
---

**Presented at [preFOSDEM MySQL Belgian Days 2025](https://lefred.be/content/prefosdem-mysql-belgian-days-2025-agenda/) in Brussels, with Harshit Gangal.**

For years, Vitess users got full ACID guarantees only inside a single shard. Anything wider was a best-effort multi-shard commit, and applications had to write their own roll-forward or rollback logic for when it failed partway. Atomic distributed transactions close that gap: a real two-phase commit across shards, built on plain MySQL.

Harshit opens with how Vitess's transaction modes evolved and then goes deep into the implementation. I cover how we test it. We built a fuzzer that runs conflicting transactions across shards, injects failures, and then uses the resulting data as a checksum to catch any commit that wasn't atomic or was applied out of order.
