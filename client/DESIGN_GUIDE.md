# 🎃 Prompt Graveyard - Design Guide 🎃

## Visual Design Overview

This document describes the spooky, dark-themed design of the Prompt Graveyard React frontend.

## 🎨 Color Palette

### Primary Colors
```
🖤 Graveyard Black: #0a0a0a
   Deep, dark background - the foundation of our graveyard

⚫ Tomb Gray: #1a1a1a
   Card backgrounds and secondary surfaces

👻 Ghost White: #f0f0f0
   Primary text color for readability

🩸 Blood Red: #8b0000
   Danger, zombies, and critical alerts

💚 Eerie Green: #39ff14
   Success, alive prompts, and positive actions

💜 Toxic Purple: #9d00ff
   Accents, highlights, and special elements

🌫️ Fog Gray: #2a2a2a
   Borders and subtle separators

⚫ Shadow Black: #000000
   Deep shadows and overlays
```

## 🔤 Typography

### Spooky Fonts (Google Fonts)

1. **Creepster** - Main titles and headings
   ```css
   font-family: 'Creepster', cursive;
   ```
   - Large, dripping horror font
   - Used for: Main title, section headers
   - Effect: Immediate Halloween atmosphere

2. **Nosifer** - Horror-style emphasis
   ```css
   font-family: 'Nosifer', cursive;
   ```
   - Distressed, decaying appearance
   - Used for: Stat values, important numbers
   - Effect: Adds decay and horror feel

3. **Eater** - Decay-themed labels
   ```css
   font-family: 'Eater', cursive;
   ```
   - Eroded, eaten-away style
   - Used for: Labels, subtitles, badges
   - Effect: Reinforces graveyard theme

4. **Courier New** - Code and data
   ```css
   font-family: 'Courier New', monospace;
   ```
   - Monospace for technical content
   - Used for: Prompts, timestamps, IDs
   - Effect: Technical, terminal-like feel

## ✨ Visual Effects

### Animations

1. **Flicker** (3s infinite)
   ```css
   @keyframes flicker {
     0%, 100% { opacity: 1; }
     50% { opacity: 0.8; }
     75% { opacity: 0.9; }
   }
   ```
   - Applied to: Main title
   - Effect: Flickering neon sign

2. **Float** (6-8s infinite)
   ```css
   @keyframes float {
     0%, 100% { transform: translateY(0) rotate(0deg); }
     50% { transform: translateY(-20px) rotate(5deg); }
   }
   ```
   - Applied to: Background decorative elements
   - Effect: Floating ghosts and spirits

3. **Pulse** (1.5s infinite)
   ```css
   @keyframes pulse {
     0%, 100% { transform: scale(1); opacity: 1; }
     50% { transform: scale(1.2); opacity: 0.7; }
   }
   ```
   - Applied to: Loading skull
   - Effect: Beating heart rhythm

4. **Glow** (2s infinite)
   ```css
   @keyframes glow {
     0%, 100% { text-shadow: 0 0 10px color; }
     50% { text-shadow: 0 0 30px color; }
   }
   ```
   - Applied to: Section titles
   - Effect: Pulsing glow

5. **Bounce** (2s infinite)
   ```css
   @keyframes bounce {
     0%, 100% { transform: translateY(0); }
     50% { transform: translateY(-10px); }
   }
   ```
   - Applied to: Stat icons
   - Effect: Playful bouncing

6. **Wobble** (3s infinite)
   ```css
   @keyframes wobble {
     0%, 100% { transform: rotate(-3deg); }
     50% { transform: rotate(3deg); }
   }
   ```
   - Applied to: Severity icons
   - Effect: Unstable, zombie-like movement

7. **Sway** (3s infinite)
   ```css
   @keyframes sway {
     0%, 100% { transform: rotate(-5deg); }
     50% { transform: rotate(5deg); }
   }
   ```
   - Applied to: Zombie card icons
   - Effect: Swaying zombie motion

### Shadows & Glows

1. **Text Shadows**
   ```css
   /* Eerie Green Glow */
   text-shadow: 
     0 0 10px #39ff14,
     0 0 20px #39ff14,
     0 0 30px #8b0000;
   
   /* Blood Red Glow */
   text-shadow: 
     0 0 10px #8b0000,
     0 0 20px #8b0000,
     2px 2px 0 #000000;
   ```

2. **Box Shadows**
   ```css
   /* Card Shadow */
   box-shadow: 
     0 10px 30px rgba(0, 0, 0, 0.7),
     0 0 20px rgba(139, 0, 0, 0.3);
   
   /* Hover Shadow */
   box-shadow: 
     0 15px 40px rgba(0, 0, 0, 0.9),
     0 0 40px rgba(139, 0, 0, 0.6);
   ```

### Background Effects

1. **Fog Drift**
   ```css
   background: 
     radial-gradient(ellipse at 20% 50%, rgba(157, 0, 255, 0.1) 0%, transparent 50%),
     radial-gradient(ellipse at 80% 50%, rgba(139, 0, 0, 0.1) 0%, transparent 50%);
   animation: fogDrift 20s ease-in-out infinite;
   ```
   - Effect: Drifting fog across the screen

2. **Rotating Aura**
   ```css
   background: radial-gradient(circle, rgba(139, 0, 0, 0.1) 0%, transparent 70%);
   animation: rotate 20s linear infinite;
   ```
   - Effect: Rotating energy field around cards

## 🧟‍♂️ Component Styling

### Header
```
┌─────────────────────────────────────────┐
│  💀    🎃 Prompt Graveyard 🎃    🧟‍♂️  │
│  Where prompts come to be judged...     │
└─────────────────────────────────────────┘
```
- Background: Dark gradient with red border
- Title: Creepster font with green glow
- Subtitle: Eater font with purple glow
- Decorative: Floating skull and zombie emojis

### Stats Panel
```
┌──────────┬──────────┬──────────┐
│ 📊       │ 🧟‍♂️      │ ✨       │
│   42     │   21     │   21     │
│ PROMPTS  │ ZOMBIES  │  ALIVE   │
└──────────┴──────────┴──────────┘
```
- Grid layout with animated cards
- Icons bounce on hover
- Values use Nosifer font with glow
- Hover: Scale up with enhanced shadow

### Zombie Card
```
┌─────────────────────────────────┐
│ 🧟‍♂️ ZOMBIE PROMPT              │
│ [ROTTING ZOMBIE]                │
├─────────────────────────────────┤
│ "write code for..."             │
│                                 │
│ 🎯 35%  💰 $0.02  ⚡ 2500ms    │
│                                 │
│ [👁️ Details] [🧙‍♀️ Revival]    │
└─────────────────────────────────┘
```
- Severity-based border colors
- Swaying zombie icon
- Expandable panels
- Hover: Lift and glow effect

### Empty State
```
┌─────────────────────────────────┐
│                                 │
│           👻                    │
│                                 │
│  No zombies found...            │
│  All prompts are alive! ✨      │
│                                 │
└─────────────────────────────────┘
```
- Floating ghost icon
- Encouraging message
- Dashed border

## 🎭 Interactive States

### Buttons

**Default State**
```css
background: linear-gradient(135deg, #8b0000 0%, #000000 100%);
border: 2px solid #39ff14;
```

**Hover State**
```css
background: linear-gradient(135deg, #39ff14 0%, #9d00ff 100%);
transform: translateY(-2px);
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7), 0 0 20px #39ff14;
```

**Active State**
```css
transform: translateY(0);
```

### Cards

**Default State**
```css
transform: translateY(0);
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
```

**Hover State**
```css
transform: translateY(-10px) scale(1.02);
box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9);
border-color: #39ff14;
```

## 📱 Responsive Breakpoints

### Desktop (> 768px)
- Multi-column grid layouts
- Full-size fonts
- Side-by-side controls
- Hover effects enabled

### Mobile (≤ 768px)
- Single column layouts
- Reduced font sizes
- Stacked controls
- Touch-optimized buttons
- Simplified animations

## 🎨 Severity Color Coding

### Shambling Zombie 🧟
```css
border-color: #ffa500; /* Orange */
box-shadow: 0 0 20px rgba(255, 165, 0, 0.3);
```
- Mild issues
- Low priority
- Warm warning color

### Rotting Zombie 🧟‍♂️
```css
border-color: #8b0000; /* Blood Red */
box-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
```
- Moderate issues
- Medium priority
- Danger color

### Skeletal Zombie 💀
```css
border-color: #000000; /* Black */
box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
```
- Severe issues
- High priority
- Critical color

## 🌟 Special Effects

### Loading Screen
- Pulsing skull (💀)
- Fading text
- Full-screen overlay
- Dark background

### Scrollbar
- Dark track with red border
- Gradient thumb (red to purple)
- Hover: Changes to green gradient

### Selection
```css
::selection {
  background: #39ff14;
  color: #000000;
}
```

## 🎃 Design Principles

1. **Dark First**: Everything starts with darkness
2. **Glow Effects**: Text and elements glow in the dark
3. **Smooth Animations**: All transitions are smooth (0.3s ease)
4. **Hover Feedback**: Every interactive element responds to hover
5. **Semantic Colors**: Colors convey meaning (red = danger, green = success)
6. **Spooky Typography**: Fonts reinforce the Halloween theme
7. **Layered Shadows**: Multiple shadow layers create depth
8. **Floating Elements**: Background elements float and drift
9. **Responsive**: Works on all screen sizes
10. **Accessible**: Maintains readability despite dark theme

---

*May your designs be ever spooky! 🌟*