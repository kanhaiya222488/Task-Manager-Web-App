# Task Manager

A responsive task manager web app built with plain HTML, CSS and JavaScript (no frameworks or libraries). Tasks are saved in the browser, so they stay after you refresh the page.

**Live demo:** _add your GitHub Pages link here after publishing_

## Features

- Add tasks with a title, priority (Low / Medium / High) and an optional due date
- Mark tasks as completed, edit them, or delete them
- Overdue tasks are highlighted
- Filter by All / Active / Completed
- Search tasks by title
- Live count of remaining tasks and a "Clear completed" button
- Data is saved with `localStorage`
- Works on desktop and mobile screens

## Concepts used

- **HTML:** forms, semantic structure
- **CSS:** Flexbox, CSS variables, responsive layout with a media query
- **JavaScript:** DOM manipulation, event handling, arrays (`filter`, `find`, `forEach`), `localStorage`, JSON, basic input safety (`textContent`)

## Run locally

1. Download or clone this repository
2. Open `index.html` in any browser

No installation or build step is needed.

## Project structure

```
index.html   page structure
style.css    styling
script.js    app logic
```

## Possible improvements

- Drag and drop to reorder tasks
- Task categories
- Dark mode
