# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Shared Styles

This project uses a focused approach to shared styles in `src/lib/styles.ts`. Only genuinely reusable patterns that appear across multiple components are centralized:

- **Form inputs** - Standard input styling for consistent form appearance
- **Badges** - Color-coded badges used in notes, match cards, and team cards
- **Section headers** - Interactive headers for collapsible sections
- **Empty states** - Consistent styling for "no data" states
- **Error states** - Error messaging and retry button styling

**Philosophy**: Keep component-specific and one-off styles local to the component. Only centralize styles that are truly shared to maintain a consistent visual theme while avoiding over-abstraction.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
