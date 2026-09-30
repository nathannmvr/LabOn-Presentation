import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(path.resolve('../lab-solos/frontend/package.json'))
const { chromium } = require('@playwright/test')
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
await page.goto('http://127.0.0.1:5174/?week=2026-09-30&slide=0')
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: '.impeccable/review/hero-repro.png', animations: 'disabled' })
await browser.close()
