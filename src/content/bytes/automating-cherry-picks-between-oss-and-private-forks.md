---
title: "Automating cherry-picks between OSS and private forks"
description: "Learn how PlanetScale keeps its private fork of Vitess up-to-date with OSS"
publishDate: "2025-06-08"
tags: ["planetscale", "vitess", "automation", "git", "open-source", "engineering"]
weight: 2
---

**Originally published on January 14, 2025 at [planetscale.com](https://planetscale.com/blog/automating-cherry-picks-between-oss-and-private-forks)**

---

## Introduction: the challenge of staying up-to-date

One of the major challenges faced by large companies customizing open-source projects for their specific use cases is staying aligned with upstream changes. At PlanetScale, we encountered this issue firsthand while managing our private modifications alongside the continual evolution of the open-source Vitess project.

## The early days: a manual approach

In the early days, when our private changes were relatively small, we used a straightforward approach to maintain the diff. Each week, a GitHub Action running on a cron would cherry-pick all private changes onto the latest updates from the `main` branch. While this method worked initially, it quickly became unsustainable as PlanetScale’s private diff grew with our increasing sophistication.

The situation became even more complicated when we decided to align with stable release versions of Vitess rather than the latest code from the `main` branch. This introduced an additional challenge: maintaining the private diff not just on the `main` branch but also across multiple release branches.

## The first attempt: git-replay

One of our early observations was that when cherry-picking private commits onto multiple release branches, we frequently encountered the same conflicts repeatedly. To address this, we developed a tool that could sequentially process all relevant commits and replay them on top of the open-source (OSS) branch. This tool, aptly named `git-replay`, could store how specific conflicts were resolved during cherry-picks and reuse that information to resolve similar conflicts in the future.

While `git-replay` was a significant improvement over our previous manual process, it wasn’t without its limitations. Someone still had to run the tool, manually resolve any unrecognized conflicts, and verify that all changes were correctly cherry-picked. To ensure no commits were missed, we generated a code diff between the OSS branch and the rebased private branch, followed by a painstaking manual review by code owners across different parts of the repository.

We used this tool for several releases, but as our private diffset grew larger than ever before, the limitations of `git-replay` became increasingly apparent. It was clear that a more comprehensive solution was needed. This realization led to the creation of the Vitess cherry-pick bot, marking a major overhaul in how we managed our private diffset.

## The start of something new: the requirements

As our private diffset continued to grow, we realized the need for a more continuous and efficient process. Instead of performing a massive cherry-pick run every time we needed a new release, we envisioned a system where open-source (OSS) changes would flow seamlessly into our private fork. This led us to define a model for continuously tracking changes in the `main` branch of OSS Vitess, synchronizing them with corresponding `upstream` branch in our private fork. We also set up private equivalent of release branches of Vitess. These private branches would also include our private diff.

| OSS Branch     | Private Equivalent |
|----------------|--------------------|
| `main`         | `upstream`         |
| `release-22.0` | `latest-22.0`      |
| `release-x.0`  | `latest-x.0`       |

### Key requirements

To achieve this, we established the following requirements for the new process:
- Any PR merged into OSS `main` should be cherry-picked into private `upstream`. 
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="/files/automating-cherry-picks-between-oss-and-private-forks/automating-cherry-picks-between-oss-and-private-forks.js"></script>
<div id="main-cherry-pick-upstream"></div>
- Any PR backported from OSS `main` into a OSS release branch `release-x.0` should trigger the backport of the corresponding cherry-pick PR to the private branch (`latest-x.0`).
<div id="release-backport-latest"></div>
- Private changes will continue to go into private `upstream`, and will be cherry-picked as needed into the private `latest` branches. 
- Whenever a new OSS `release` branch is cut from OSS `main`, a corresponding private `latest` branch should be created from private `upstream`.
<div id="cut-new-release"></div>
- Automate as much of this process as possible to minimize manual effort.

### The promise of automation

This new process offered several clear benefits:
- We no longer needed to explicitly maintain the private diffset. 
- PRs from OSS would flow continuously into the private fork, ensuring it remained up-to-date.

With these goals in mind, we began developing a bot to automate and streamline as much of this workflow as possible. This marked the beginning of the Vitess cherry-pick bot.

## Grand stage entry: the Vitess cherry-pick bot

With the requirements in place, we began exploring how to bring the bot to life. Several critical design questions arose:

- Should the bot be hosted on a dedicated server or leverage GitHub Actions and applications?
- Should it be stateless, storing all information in PRs, or stateful with a dedicated data store?

After extensive deliberation, we opted for a solution that runs periodically on a cron schedule using GitHub Actions, with its state stored in a PlanetScale database instance. The bot operates on an hourly cron schedule in GitHub Actions and performs two core tasks: **Cherry-Picking** and **Backporting**.

### Cherry-picking

#### **Identifying PRs for Cherry-Picking**
- The bot uses the [`go-github` library](https://github.com/google/go-github) to interact with the GitHub API and fetch recently closed PRs from the Vitess repository.
- It filters out PRs that are closed without being merged and inserts the remaining PRs into the database for cherry-picking.
- To determine how far back in history it needs to fetch, the bot stops once it encounters a PR that predates any PR already present in the database.

#### **Executing Cherry-Picks**
- Cherry-picking and PR creation happen entirely within the workflow.
- The bot uses a GitHub token for authentication to check out the vitess-private repository and create PRs against it.

#### **Handling Conflicts**
- The workflow creates a PR even if conflicts arise during cherry-picking, ensuring no PRs are missed.
- PRs inherit the title and description from the original PR. The original author or the person who merged the PR is assigned as the assignee, unless they are a non-PlanetScale contributor, in which case no one is assigned.
- In there are conflicts, the bot creates a draft PR with the labels like `do not merge` and `Conflict`.
- It comments on the PR with the Git status output, highlighting the files with conflicts, and tags the original PR author for resolution.

#### **Finalizing Cherry-Picks**
- Once the process is complete, the bot marks the PR as cherry-picked in the database.

### Backporting

The process for backporting PRs from `upstream` to `latest` branches is similar to cherry-picking, with a few key differences:
- Backports are not automatically triggered. Instead, they rely on labels applied to PRs in the vitess-private repository.
- Labels like `Backport to: latest-x.0` signal the bot to initiate the backport.
- Once the label is applied, the bot executes the backporting steps, following a workflow akin to cherry-picking.

This approach allowed us to automate and streamline much of the manual effort involved in keeping our private fork aligned with OSS changes. The bot's stateful design and use of GitHub Actions ensured a robust, scalable solution to manage the growing complexity of our workflow.

## Building confidence

As with any major refactor or overhaul of a critical process, it was essential to implement safeguards to ensure reliability. To this end, we built integrity checks directly into the bot, which it runs weekly. These checks provide a summary of any discrepancies, allowing for manual intervention when necessary.

### Weekly integrity checks
The bot performs two key reconciliation tests every week:
1. #### **`Upstream` Reconciliation Test**
   This test ensures that the `upstream` branch remains in sync with OSS changes. It flags the following issues:
   - Open cherry-pick PRs against `upstream`.
   - PRs from `main` that were not cherry-picked into `upstream`.
   - PRs merged directly into `latest` branches instead of being backported from `upstream`.
2. #### **`Latest` Branches Reconciliation Test**
   This test ensures that `latest` branches (e.g., `latest-21.0`) are consistent. It identifies:
   - Open backport PRs against `latest` branches.
   - PRs merged into `latest` that are not backports.
   - PRs backported to `latest-x.0` but not other higher numbered `latest` branches (if any).
   
#### **Alerts and Manual Inspections**
The bot posts a summary of these checks to a dedicated GitHub issue every week, providing visibility into any issues that may require manual inspection or action.

## The outcome

With these safety measures in place, we cautiously rolled out the new process and began using the Vitess cherry-pick bot. Over a year and six months later, the results have been remarkable. The bot has saved countless hours of engineering time, allowing our team to focus on building innovative features for our users rather than manually cherry-picking PRs!

