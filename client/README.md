# 🎃 Prompt Graveyard - React Frontend 🎃

A spooky, dark-themed React dashboard for visualizing prompt evaluation results and managing zombie prompts.

## 🎨 Features

### Dark Spooky Theme
- **Deep black background** with gradient effects
- **Spooky fonts**: Creepster, Nosifer, and Eater from Google Fonts
- **Eerie color palette**: Blood red, toxic purple, eerie green
- **Animated fog effects** and floating elements
- **Glowing text shadows** and pulsing animations

### Components

1. **GraveyardDashboard** 🪦
   - Main dashboard with zombie prompt grid
   - Filter by severity (shambling, rotting, skeletal)
   - Refresh functionality

2. **ZombiePromptCard** 🧟‍♂️
   - Individual zombie prompt display
   - Expandable details panel
   - Revival suggestions interface
   - Severity-based styling and icons

3. **StatsPanel** 📊
   - Total prompts, zombies, and living prompts
   - Average score, cost, and latency
   - Zombie severity breakdown
   - Animated stat cards

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Running API server on `localhost:3001`

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎭 Spooky Design Elements

### Fonts
- **Creepster**: Main titles and headings
- **Nosifer**: Horror-style text
- **Eater**: Decay-themed labels

### Color Palette
```css
--graveyard-black: #0a0a0a    /* Deep background */
--tomb-gray: #1a1a1a          /* Card backgrounds */
--blood-red: #8b0000          /* Danger/zombie */
--eerie-green: #39ff14        /* Success/alive */
--toxic-purple: #9d00ff       /* Accents */
--ghost-white: #f0f0f0        /* Text */
```

### Animations
- **Flicker**: Title text flickering effect
- **Float**: Floating background elements
- **Pulse**: Loading animations
- **Glow**: Pulsing glow effects
- **Wobble**: Severity icon animations
- **Sway**: Zombie icon swaying

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── GraveyardDashboard.tsx
│   │   ├── GraveyardDashboard.css
│   │   ├── ZombiePromptCard.tsx
│   │   ├── ZombiePromptCard.css
│   │   ├── StatsPanel.tsx
│   │   └── StatsPanel.css
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🔌 API Integration

The frontend connects to the API server at `http://localhost:3001`:

### Endpoints Used
- `GET /api/prompts/stats` - Graveyard statistics
- `GET /api/prompts/zombies` - Zombie prompts list
- `GET /api/revive/suggestions/:id` - Revival suggestions

### Proxy Configuration
Vite is configured to proxy `/api` requests to the backend server.

## 🎃 Component Usage

### App Component
```tsx
import App from './App';

// Main app with stats and zombie dashboard
<App />
```

### GraveyardDashboard
```tsx
<GraveyardDashboard 
  zombies={zombieData} 
  onRefresh={handleRefresh} 
/>
```

### ZombiePromptCard
```tsx
<ZombiePromptCard zombie={zombieData} />
```

### StatsPanel
```tsx
<StatsPanel stats={statsData} />
```

## 🎨 Customization

### Changing Colors
Edit CSS variables in `App.css`:
```css
:root {
  --blood-red: #your-color;
  --eerie-green: #your-color;
  /* ... */
}
```

### Adding New Fonts
Add to `App.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

:root {
  --font-custom: 'YourFont', cursive;
}
```

### Modifying Animations
Adjust keyframes in component CSS files:
```css
@keyframes yourAnimation {
  /* ... */
}
```

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints at:
- **Desktop**: > 768px
- **Mobile**: ≤ 768px

Mobile optimizations:
- Single column layouts
- Stacked controls
- Adjusted font sizes
- Touch-friendly buttons

## 🧟‍♂️ Zombie Severity Styling

Each severity level has unique styling:

### Shambling Zombie 🧟
- Orange border (#ffa500)
- Low priority indicator
- Mild glow effect

### Rotting Zombie 🧟‍♂️
- Blood red border (#8b0000)
- Medium priority indicator
- Moderate glow effect

### Skeletal Zombie 💀
- Black border with heavy shadow
- High priority indicator
- Intense glow effect

## 🎭 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Revival suggestion application
- [ ] Performance trend charts
- [ ] Prompt comparison view
- [ ] Dark/light theme toggle (currently dark only)
- [ ] Sound effects for interactions
- [ ] Particle effects on hover
- [ ] More spooky animations

## 🆘 Troubleshooting

### API Connection Issues
```bash
# Make sure the API server is running
cd ../server
npm run dev
```

### Port Already in Use
Edit `vite.config.ts`:
```ts
server: {
  port: 3001, // Change to available port
}
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Dependencies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Google Fonts**: Spooky typography

---

*May your components render swiftly and your zombies be ever spooky! 🌟*