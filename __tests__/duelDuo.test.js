const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("See all bots displays bots", async () => {
    await driver.get('http://localhost:8000');
    await driver.findElement(By.id('see-all')).click()

    await driver.sleep(2000)

    let allBots = await driver.findElements(By.className('bot-card'))

    await driver.sleep(1000)

    expect(allBots.length > 0).toBeTruthy()
  })
  
  test("Draw button displays bots", async () => {
    await driver.get('http://localhost:8000');
    await driver.findElement(By.id('draw')).click()

    await driver.sleep(2000)

    await driver.findElement(By.className('bot-btn')).click()

    await driver.sleep(2000)

    let playerChoices = await driver.findElements(By.xpath('//div[@id="player-duo"]/div'))

    expect(playerChoices.length > 0)
  })
});