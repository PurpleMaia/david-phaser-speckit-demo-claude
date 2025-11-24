# Phaser 3 SpecKit Demo

A minimal experimental project demonstrating SpecKit workflow with Phaser 3 for building a tiny top-down 2D adventure/RPG-style demo.

## Constitution

This project is governed by constitutional principles defined in `.specify/memory/constitution.md`:

1. **Simplicity First** - Prioritize simple implementations over features
2. **Minimal Dependencies** - Avoid unnecessary libraries (Phaser 3 + Vite only)
3. **Code-Generated SVG Assets** - All graphics as code-generated SVGs (no bitmaps)
4. **Local-First Execution** - Frontend-only, runs with `npm install && npm run dev`
5. **Standard Project Structure** - Follow modern JavaScript conventions

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── scenes/          # Phaser game scenes
├── assets/          # Code-generated SVG definitions
├── entities/        # Game objects
└── main.js          # Entry point
```

## Goals

- Proof of concept for SpecKit + Codex CLI workflow
- Minimal scope, maximum clarity
- Demonstrate best practices for specification-driven development