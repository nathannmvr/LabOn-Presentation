import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { reports } from '../src/data/reports.js'

const require = createRequire(path.resolve(process.env.LAB_SOLOS_ROOT ?? '../lab-solos', 'frontend/package.json'))
const { chromium, expect } = require('@playwright/test')
const browser = await chromium.launch({ headless: true })
const baseURL = process.env.PRESENTATION_URL ?? 'http://127.0.0.1:5174'
const output = path.resolve('.impeccable/review')
await mkdir(output, { recursive: true })
const failures = []
const latest = reports.at(-1)
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(baseURL)
    await expect(page.getByRole('combobox')).toHaveValue(latest.id)
    for (const report of reports) {
      await page.getByRole('combobox').selectOption(report.id)
      for (let slide = 0; slide < report.slides.length + 2; slide++) {
        if (slide) await page.getByRole('button', { name: 'Próximo slide', exact: true }).click()
        const active = page.locator('.slide-page[aria-hidden="false"]')
        await expect(active).toHaveCount(1)
        await expect(active.locator('h1, h2').first()).toBeVisible()
        await expect(page).toHaveURL(new RegExp(`week=${report.id}&slide=${slide}$`))
        for (const img of await active.locator('img').all()) {
          await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true)
        }
        assert.equal(await active.locator('.screenshot-placeholder').count(), 0)
        if (report.id === latest.id) {
          const bounds = await page.evaluate(() => {
            const activeSlide = document.querySelector('.slide-page[aria-hidden="false"]')
            const controls = document.querySelector('.controls').getBoundingClientRect()
            return { viewport: innerHeight, controlsBottom: controls.bottom, documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, contentHeight: activeSlide.scrollHeight, frameHeight: activeSlide.clientHeight }
          })
          if (bounds.documentWidth > viewport.width + 1 || bounds.controlsBottom > viewport.height + 1) failures.push({ slide, width: viewport.width, ...bounds })
          await page.screenshot({ path: path.join(output, `${viewport.width === 1440 ? 'desktop' : 'mobile'}-${slide}.png`), fullPage: true, animations: 'disabled' })
        }
      }
    }
    assert.deepEqual(errors, [])
    await page.goto(`${baseURL}/?week=${latest.id}&slide=1`)
    await expect(page.locator('.slide-page[aria-hidden="false"] h2')).toHaveText(latest.slides[0].title)
    const popupPromise = page.waitForEvent('popup')
    await page.locator('.slide-page[aria-hidden="false"] .screenshot-link').click()
    const popup = await popupPromise
    await popup.waitForLoadState('domcontentloaded')
    assert.ok(popup.url().endsWith(latest.slides[0].image.src))
    await popup.close()
    await page.keyboard.press('Home')
    await expect(page).toHaveURL(/slide=0$/)
    await page.keyboard.press('ArrowRight')
    await expect(page).toHaveURL(/slide=1$/)
    await page.keyboard.press('End')
    await expect(page).toHaveURL(new RegExp(`slide=${latest.slides.length + 1}$`))
    for (const asset of ['README.md', 'capturas.json']) {
      assert.equal((await page.request.get(`${baseURL}/screenshots/${latest.id}/${asset}`)).status(), 200)
    }
    await page.close()
  }
  console.log(JSON.stringify({ reports: reports.length, slidesPerViewport: reports.reduce((count, report) => count + report.slides.length + 2, 0), viewports: 2, layoutFindings: failures }, null, 2))
  assert.deepEqual(failures, [], 'The presentation must fit its viewport')
} finally {
  await browser.close()
}
