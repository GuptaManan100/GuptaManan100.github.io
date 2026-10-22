---
title: "One VTOrc to Rule Them All"
description: "High availability in Vitess with VTOrc: failure detection, automatic failovers, and durability policies built on semi-sync replication."
publishDate: "2022-10-26"
tags: ["talk", "vitess", "mysql", "high-availability", "vtorc"]
talk:
  youtube: "https://www.youtube.com/watch?v=upmByX8uD6E"
  event: "KubeCon + CloudNativeCon NA 2022"
  slides: "/slides/one-vtorc-to-rule-them-all.pdf"
---

**Presented at KubeCon + CloudNativeCon North America 2022 in Detroit, with Deepthi Sigireddi.**

Vitess gets its scalability from sharding and its durability from replication. High availability is the job of cluster management, and the next generation of that in Vitess is VTOrc. You describe your durability rules as configuration, and VTOrc respects them during planned failovers. It also detects failures and runs automatic failovers that honor the same rules.

Deepthi and I introduce VTOrc and the theory behind it: the design principles, unplanned leader election, and durability policies built on semi-sync replication, including cross-cell and custom policies. Then we demo a series of failure scenarios. VTOrc went GA in Vitess 15, shortly before this talk.

**Related reading:** [VTOrc: Vitess-native Orchestrator](/bytes/vtorc-vitess-native-orchestrator/)
