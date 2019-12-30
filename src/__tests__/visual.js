const { toMatchImageSnapshot } = require('jest-image-snapshot');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { render } = require('../../index');

expect.extend({ toMatchImageSnapshot });

const rootDir = path.resolve(__dirname, '../../');

describe('jest-image-snapshot usage with an image received from puppeteer', () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    const resumeJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'resume.json')));
    const resumeHtml = render(resumeJson);
    fs.writeFileSync(path.join(rootDir, 'resume.html'), resumeHtml);
  });

  it('works', async () => {
    const page = await browser.newPage();
    await page.goto(path.join('file://', __dirname, '/../../resume.html'));
    const image = await page.screenshot({
      fullPage: true,
      omitBackground: true,
    });

    expect(image).toMatchImageSnapshot();
  });

  afterAll(async () => {
    await browser.close();
    fs.unlink(path.join(rootDir, 'resume.html'), x => x);
  });
});
