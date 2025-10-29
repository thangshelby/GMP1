import pandas as pd

vn_100=['AAA', 'ACB', 'ANV', 'BCM', 'BID', 'BMP', 'BSI', 'BVH', 'BWE', 'CII', 'CMG', 'CTD', 'CTG', 'CTR', 'CTS', 'DBC', 'DCM', 'DGC', 'DGW', 'DIG', 'DPM', 'DSE', 'DXG', 'DXS', 'EIB', 'EVF', 'FPT', 'FRT', 'FTS', 'GAS', 'GEX', 'GMD', 'GVR', 'HAG', 'HCM', 'HDB', 'HDC', 'HDG', 'HHV', 'HPG', 'HSG', 'HT1', 'IMP', 'KBC', 'KDC', 'KDH', 'KOS', 'LPB', 'MBB', 'MSB', 'MSN', 'MWG', 'NAB', 'NKG', 'NLG', 'NT2', 'OCB', 'PAN', 'PC1', 'PDR', 'PHR', 'PLX', 'PNJ', 'POW', 'PPC', 'PTB', 'PVD', 'PVT', 'REE', 'SAB', 'SBT', 'SCS', 'SHB', 'SIP', 'SJS', 'SSB', 'SSI', 'STB', 'SZC', 'TCB', 'TCH', 'TLG', 'TPB', 'VCB', 'VCG', 'VCI', 'VGC', 'VHC', 'VHM', 'VIB', 'VIC', 'VIX', 'VJC', 'VND', 'VNM', 'VPB', 'VPI', 'VRE', 'VSC', 'VTP']

def extract_data_content(soup):
    container= soup.find('div', class_='table-responsive')
    news_list = []
    
    rows = container.find_all('tr')
    for item in rows[1:]:
        title_tag = item.find('a',class_='d-flex')
        time_tag = item.find_all('td')

        # Bỏ qua nếu không tìm thấy title hoặc ngày
        if not title_tag or not time_tag:
            continue

        title = title_tag.text.strip()
        link = title_tag['href']
        start_date = time_tag[1].text.strip()
        symbol= title_tag.text.split(': ')[0]
        if symbol not in vn_100:
            continue
        news = {
            'symbol':symbol,
            'title': title,
            'created_at': time_tag[2].text.strip(),
            'start_date': start_date
        }

        news_list.append(news)
    return pd.DataFrame(news_list)