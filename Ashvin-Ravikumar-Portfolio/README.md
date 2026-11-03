# Asvin Ravikumar — Software Developer Portfolio

A responsive, cinematic personal portfolio built with semantic HTML, custom CSS and vanilla JavaScript. Motion is created locally with CSS and canvas; project visuals are conceptual illustrations, not screenshots of the applications.

## Run locally

Open `index.html` directly, or serve the project directory with VS Code Live Server or another static HTTP server. No build step or frontend framework is required.

## Project structure

- `index.html` — accessible portfolio content and metadata
- `css/style.css` — visual design, project illustrations, responsive layouts, and reduced-motion rules
- `js/main.js` — reveal animations, canvas network, navigation, and project detail dialogs
- `assets/` — local visual assets
- `resume/Asvin_Ravikumar_Resume.pdf` — original resume supplied with the project

## Notes

- The portfolio content is based on the supplied resume. SafeNation is identified as an academic project/system design. Its AI elements are described as concepts, not a trained model or prediction service. The NWSDB payment workflow is labeled simulated.
- The resume did not provide project repository URLs, so the portfolio does not invent them. GitHub and LinkedIn profile links point to the supplied profile URLs.
- The resume is included unchanged. Public contact details use Ragala, Sri Lanka and the phone number provided in the project brief; the residential street address is not published.
- Fonts load from Google Fonts when online; system fallbacks are provided.
- Canvas motion pauses when the relevant section leaves the viewport. The site honors `prefers-reduced-motion`.
