# # selenium_scrape_wichart.py
# from selenium import webdriver
# from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from selenium.common.exceptions import ElementClickInterceptedException, TimeoutException
# from bs4 import BeautifulSoup
# import time
# from dateutil import parser as dateparser
# import pandas as pd
# import json
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC

# START_URL = "https://wichart.vn/tin-tuc?tab=cophieu"
# CUT_OFF = "2024-01-01"

# def make_driver():
#     opts = Options()
#     # opts.add_argument("--headless")   # hoặc "--headless" tuỳ phiên bản
#     opts.add_argument("--no-sandbox")
#     opts.add_argument("--disable-gpu")
#     opts.add_argument("--window-size=1920,1080")
#     opts.add_argument("--disable-dev-shm-usage")
#     # opts.add_argument("--user-agent=Mozilla/5.0 ...")
#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)
#     return driver

# def scroll_and_load(driver, max_iterations=50):
#     # scroll và cố click "load more" nếu có, hoặc load infinite scroll
#     last_height = driver.execute_script("return document.body.scrollHeight")
#     it = 0
#     while it < max_iterations:
#         driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
#         time.sleep(1.2)  # đợi JS load
#         # try click "Xem thêm" hoặc "Load more" nếu xuất hiện
#         try:
#             # THAY selector cho nút load-more của trang nếu có
#             btn = driver.find_element(By.CSS_SELECTOR, "button.btn-load-more")
#             if btn.is_displayed():
#                 try:
#                     btn.click()
#                 except ElementClickInterceptedException:
#                     driver.execute_script("arguments[0].click();", btn)
#                 time.sleep(1.0)
#         except Exception:
#             pass

#         new_height = driver.execute_script("return document.body.scrollHeight")
#         if new_height == last_height:
#             # không còn load được nữa
#             break
#         last_height = new_height
#         it += 1
# def scroll_until_end(driver, pause=1.5, max_scrolls=80):
#     # Tìm container có scrollbar
#     container = driver.find_element(By.CSS_SELECTOR, ".MuiBox-root.css-177dxab")
#     last_height = driver.execute_script("return arguments[0].scrollHeight", container)
#     print(last_height)
#     for i in range(max_scrolls):
#         driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight);", container)
#         time.sleep(pause)

#         new_height = driver.execute_script("return arguments[0].scrollHeight", container)
#         print(f"[{i}] scrolled: {new_height}")
#         if new_height == last_height:
#             print("Reached end of container.")
#             break
#         last_height = new_height

# def parse_items(html):
#     soup = BeautifulSoup(html, "html.parser")
#     items = []

#     # TODO: thay selector theo cấu trúc trang thực tế
#     # Mình đoán phần tin tức có thẻ article hoặc .news-item => bạn hãy inspect và sửa
#     for node in soup.select(".news-item, .card-news, article"):  
#         # sửa lấy title/url/date thực tế
#         a = node.select_one("a")
#         title = a.get_text(strip=True) if a else None
#         url = a["href"] if a and a.has_attr("href") else None
#         date_node = node.select_one(".time, .date")  # sửa selector
#         date_str = date_node.get_text(strip=True) if date_node else None
#         items.append({"title": title, "url": url, "date_str": date_str})
#     return items

# def keep_since_2024(items):
#     out = []
#     cutoff = dateparser.parse(CUT_OFF)
#     for it in items:
#         if not it["date_str"]:
#             continue
#         try:
#             dt = dateparser.parse(it["date_str"], dayfirst=False)
#         except Exception:
#             continue
#         if dt >= cutoff:
#             out.append({"title": it["title"], "url": it["url"], "date": dt.isoformat()})
#     return out
# def load_cookies_to_driver(driver, cookie_file, domain="wichart.vn"):
#     # driver phải đã mở 1 trang trong domain (ví dụ https://wichart.vn) trước khi add_cookie
#     with open(cookie_file, "r", encoding="utf-8") as f:
#         cookies = json.load(f)

#     for c in cookies:
#         cookie = {
#             "name": c.get("name"),
#             "value": c.get("value"),
#             "path": c.get("path", "/"),
#             "domain": c.get("domain").lstrip(".") if c.get("domain") else domain,
#         }
#         # optional fields
#         if c.get("expiry"):
#             cookie["expiry"] = int(c.get("expiry"))
#         try:
#             driver.add_cookie(cookie)
#         except Exception as e:
#             print("Warning add_cookie failed:", e, cookie["name"])
# def select_date(driver,wait, date):
#     date_input = wait.until(EC.presence_of_element_located((By.XPATH, "//button[@aria-label='Choose date']")))
#     date_input.click()
#     date_select = wait.until(EC.presence_of_element_located((By.XPATH, "//button[@aria-label='calendar view is open, switch to year view']")))
#     date_select.click()
#     time.sleep(3)
    
#     year_to_select = "2024"
# # Chờ các nút năm hiển thị
#     buttons = WebDriverWait(driver, 10).until(
#         EC.presence_of_all_elements_located((By.CSS_SELECTOR, "button.PrivatePickersYear-yearButton"))
#     )

#     # Lặp và click vào nút có text đúng năm
#     for btn in buttons:
#         if btn.text.strip() == year_to_select:
#             driver.execute_script("arguments[0].scrollIntoView(true);", btn)  # đảm bảo nhìn thấy
#             btn.click()
#             print(f"✅ Clicked year {year_to_select}")
#             break
#     else:
#         print(f"⚠️ Không tìm thấy năm {year_to_select}")
#         year_select = wait.until( EC.text_to_be_present_in_element((By.TAG_NAME, "button"), "2024"))
#         year_select.click()
    
#     scroll_until_end(driver, pause=1.5, max_scrolls=50)
#     time.sleep(10)
    
    
 

# def main():
#     driver = make_driver()
#     wait = WebDriverWait(driver, 20)
    
#     driver.get("https://wichart.vn/")   # cần load domain trước khi add_cookie
#     time.sleep(1)
#     load_cookies_to_driver(driver, "cookies.json")
#     driver.get(START_URL)
#     time.sleep(2)
#     select_date(driver, wait,"2024-01-01")
#     scroll_and_load(driver, max_iterations=60)
#     html = driver.page_source
#     driver.quit()

#     raw_items = parse_items(html)
#     items = keep_since_2024(raw_items)
#     df = pd.DataFrame(items)
#     df.to_csv("wichart_cophieu_from2024.txt", index=False, encoding="utf-8-sig")
#     print(f"Saved {len(df)} items to CSV.")

# if __name__ == "__main__":
#     main()




from vnstock import Vnstock
import pandas as pd



stock = Vnstock().stock(symbol='VNINDEX', source='VCI')

df = stock.quote.history(symbol='VCB', start='2020-01-01', end='2025-10-01', interval='1D')
df.to_csv(f"VNINDEX.CSV", index=False, encoding="utf-8")
  
