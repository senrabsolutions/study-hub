# Study Hub

A structured, interactive learning platform for mastering Windows-focused CLI engineering.

Built with Next.js, TypeScript, MDX, and Tailwind, Study Hub combines content, interactivity, and tooling into a single developer-focused system.

---

## Overview

Study Hub is not just a content site — it is a content-driven application designed to simulate real engineering learning workflows.

It integrates:

- Structured MDX lessons
- Interactive quizzes and assessments
- Rapid practice drills (scenario + concept)
- Persistent progress tracking
- Scripted content scaffolding

---

## Key Features

### Content System
- Filesystem-based MDX lessons
- Track-based organization with metadata
- Dynamic routing for tracks and lessons

### Interactive Learning
- Inline quizzes (Quiz component)
- Multi-question assessments (QuizSet component)
- Pass thresholds and scoring
- Rapid Practice engine with randomized questions

### Progress Tracking
- Lesson completion tracking
- Quiz pass/fail and scoring
- Resume learning flow
- Stored locally using localStorage

### Developer Experience
- Script-driven lesson and track generation
- Consistent content templates
- Reusable UI components

### UI / UX
- Dashboard with track overview
- Sidebar navigation
- Dark mode (system-aware)

---

## Tech Stack

- Next.js
- TypeScript
- MDX
- React
- Tailwind CSS
- next-themes
- localStorage

---

## Project Architecture

app/        → routing and page structure  
components/ → UI and interactive learning components  
content/    → MDX lessons and track metadata  
lib/        → content loading and progress logic  
scripts/    → content scaffolding tools  

---

## Learning System Design

### Quiz System
- Embedded directly in lessons
- Supports single and multi-question formats
- Tracks score and pass state

### Rapid Practice
- Scenario-based debugging questions
- Concept recall drills
- Randomized sessions
- Accuracy and streak tracking

---

## Content Architecture

Each track is self-contained:

content/<track>/
  meta.ts
  lesson-name.mdx

This enables:

- scalable content growth
- consistent structure
- script-based automation

---

## Scripts

### Scaffold roadmap
npm run scaffold:roadmap

### Create lesson
npm run new:lesson -- <track> <slug>

### Create track
npm run new:track -- <track>

---

## Local Development

npm install  
npm run dev  

http://localhost:3000

---

## Architecture Highlights

- Content-driven design using MDX
- Clear separation of content, metadata, and UI
- Persistent state management via React context
- Scalable content tooling via scripts
- Hybrid documentation + application model

---

## Roadmap

- confidence-based learning signals
- adaptive learning (focus on weak areas)
- track-level analytics
- search and filtering
- lesson duration and difficulty tuning
- authentication
- cross-device progress sync

---

## What This Demonstrates

This project demonstrates:

- building a full-stack content-driven application
- designing developer-focused learning systems
- creating scalable content pipelines
- implementing stateful UI with persistence
- bridging documentation and interactive tooling