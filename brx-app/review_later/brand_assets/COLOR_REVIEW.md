# Brand Colors Review

## Color Discrepancies Found

### 1. Colors from scraped BRX site
- Primary Orange: `#fe3f00`
- Darker Orange: `#db3204`
- Source: Actual online.brxperformance.com website

### 2. Colors from brand-guidelines
- Primary Red: `#FF6363`
- Background Dark 1: `#151515`
- Background Dark 2: `#202123`
- Source: `/brx-platform/brand-guidelines/assets/colors.json`

### 3. Current Implementation
- Using `#fe3f00` (from scraped site)
- Applied across all pages in brx-app-replica

## Questions for Review

1. **Which color scheme is correct?**
   - [ ] Use scraped colors (#fe3f00) - matches live site
   - [ ] Use brand-guidelines colors (#FF6363)
   - [ ] Need to verify with official brand team
   - [ ] Other: _______________

2. **Design System Preference**
   - [ ] Keep current bright/white design (like live site)
   - [ ] Switch to dark theme (#151515, #202123)
   - [ ] Support both light/dark modes

3. **Logo Source**
   - Currently using: `https://cdn.exercise.com/images/1154147/...`
   - [ ] This is correct
   - [ ] Need different logo source

## Action Items
- [ ] Confirm official brand colors
- [ ] Update color constants file
- [ ] Create theme configuration 