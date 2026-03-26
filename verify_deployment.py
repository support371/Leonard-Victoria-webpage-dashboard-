import asyncio
from playwright.async_api import async_playwright
import os
import subprocess
import time

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        server = subprocess.Popen(["python3", "-m", "http.server", "5173", "--directory", "react-app/dist"])
        time.sleep(2)

        try:
            print("Navigating to http://localhost:5173")
            await page.goto("http://localhost:5173", wait_until="networkidle")

            # Print page title and h1s for debugging
            title = await page.title()
            print(f"Page Title: {title}")

            h1s = await page.eval_on_selector_all("h1", "elements => elements.map(el => el.textContent)")
            print(f"H1 elements found: {h1s}")

            # Check for the primary heading - using a more flexible selector
            # The previous failure might be because of line breaks or styling
            heading_found = False
            for h1 in h1s:
                if "Stewardship" in h1 and "Purpose" in h1:
                    print(f"SUCCESS: Found heading matching 'Stewardship...Purpose': {h1}")
                    heading_found = True
                    break

            if not heading_found:
                print("FAILURE: No H1 matching 'Stewardship...Purpose' found")

            # Check for the body text mention of the organization name
            body_text = await page.inner_text("body")
            if "Leonard & Victoria" in body_text:
                print("SUCCESS: Found 'Leonard & Victoria' in body text")
            else:
                print("FAILURE: 'Leonard & Victoria' not found in body text")

            await page.screenshot(path="verify_final.png")
            print("Screenshot saved to verify_final.png")

        except Exception as e:
            print(f"ERROR: {e}")
        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
