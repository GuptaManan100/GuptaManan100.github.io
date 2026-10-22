---
title: "Scaling Databases With Vitess"
description: "Vitess's architecture and features, plus a live demo of moving a running RDS database into Vitess and cutting traffic over."
publishDate: "2022-05-18"
tags: ["talk", "vitess", "mysql", "kubernetes", "scaling"]
talk:
  youtube: "https://www.youtube.com/watch?v=HgSlmzC7O-E"
  event: "KubeCon + CloudNativeCon Europe 2022"
  slides: "/slides/scaling-databases-with-vitess.pdf"
---

**Presented at KubeCon + CloudNativeCon Europe 2022 in Valencia, with Harshit Gangal.**

Vitess is a cloud-native database that scales MySQL horizontally. In this talk, Harshit and I walk through its high-level architecture and its feature set, including how much of the day-to-day database management it takes off your hands. We also show that it works with Rails and bring up a Vitess cluster with the Kubernetes operator.

Most people don't start on Vitess. They arrive with an existing database that has outgrown a single machine. So the second half is a demo: we take a database running on AWS RDS, keep it in sync with Vitess, and then cut the traffic over.

**Related reading:** [Rails that scales - Powered by Vitess](/bytes/rails-that-scales/)
