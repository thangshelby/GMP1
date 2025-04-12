import requests
import xml.etree.ElementTree as ET

# Bước 1: Lấy dữ liệu từ URL
url = "https://vietstock.vn/1328/dong-duong/thi-truong-chung-khoan.rss"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
response = requests.get(url,headers=headers)
response.encoding = 'utf-8' 
root = ET.fromstring(response.text)

for node in root[0]:
    # title= node[0].text
    # link= node[1].text
    # description= node[2].text
    # lastBuildDate=node[3].text
    # general= node[4].text
    if node.tag=='item':
        
            guild= node[0].text
            link= node[1].text
            title= node[2].text
            description=node[3].text
            pubDate= node[4].text
            print(guild,link,title,description,pubDate)

# from bs4 import BeautifulSoup
# import requests
# url = "https://vietstock.vn/rss"

# headers = {
#     "User-Agent": "Mozilla/5.0"
# }
# response = requests.get(url,headers=headers)

# if response.status_code == 200:
#     soup = BeautifulSoup(response.text, "html.parser")  # or "lxml"
#     links = soup.find_all("li")
#     for link in links:
#         atag= link.find("a")
#         if atag and atag.get("href"):
#             href = atag['href']
#             a_title= atag.text.strip()
            
            
#             print(f'{a_title}: {href}')
# else:
#     print("❌ Failed to fetch page:", response.status_code)

