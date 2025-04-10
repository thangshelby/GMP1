years=['2020','2021','2022','2023','2024',2020,2021,2022,2023,2024]

bankCompany=['ABB', 'ACB', 'BAB', 'BID', 'BVB', 'CTG', 'EIB', 'HDB', 'KLB', 'LPB', 'MBB', 'MSB', 'NAB', 'NVB', 'OCB', 'PGB', 'SGB', 'SHB', 'SSB', 'STB', 'TCB', 'TPB', 'VAB', 'VBB', 'VCB', 'VIB', 'VPB']
techCompany = [
    # 🔹 Technology companies
    'ADG',  # Clever Group - Digital marketing
    'CMG',  # CMC Corporation - IT & services
    'CTR',  # Viettel Construction - tech infra
    'DGW',  # Digiworld - tech distributor
    'ELC',  # Elcom - telecom & electronics
    'FPT',  # FPT Corporation - full-stack tech
    'SAM',  # SAM Holdings - has tech/telecom biz
    'SGT',  # Saigon Tel - telecom & software
    'ST8',  # Sieu Thanh - electronics
    'VGI',  # Viettel Global - telecom & tech
    'DSE',  # DNSE Securities - 100% digital brokerage
    'SSI',  # SSI Securities - strong tech investment
    'VND',  # VNDirect - SmartOne, AI fintech
    'HCM',  # HSC - digital trading platform
    'MSB',  # Maritime Bank - digital banking
    'TPB',  # TPBank - leading in fintech apps
    'TCB',  # Techcombank - fintech-oriented strategy
    'VPB'   # VPBank - VPBank NEO
]
hose=['AAA', 'AAM', 'AAT', 'ABR', 'ABS', 'ABT', 'ACB', 'ACC', 'ACG', 'ACL', 'ADG', 'ADP', 'ADS', 'AGG', 'AGM', 'AGR', 'ANV', 'APG', 'APH', 'ASG', 'ASM', 'ASP', 'AST', 'BAF', 'BBC', 'BCE', 'BCG', 'BCM', 'BFC', 'BHN', 'BIC', 'BID', 'BKG', 'BMC', 'BMI', 'BMP', 'BRC', 'BSI', 'BSR', 'BTP', 'BTT', 'BVH', 'BWE', 'C32', 'C47', 'CCI', 'CCL', 'CDC', 'CHP', 'CIG', 'CII', 'CKG', 'CLC', 'CLL', 'CLW', 'CMG', 'CMV', 'CMX', 'CNG', 'COM', 'CRC', 'CRE', 'CSM', 'CSV', 'CTD', 'CTF', 'CTG', 'CTI', 'CTR', 'CTS', 'CVT', 'D2D', 'DAH', 'DAT', 'DBC', 'DBD', 'DBT', 'DC4', 'DCL', 'DCM', 'DGC', 'DGW', 'DHA', 'DHC', 'DHG', 'DHM', 'DIG', 'DLG', 'DMC', 'DPG', 'DPM', 'DPR', 'DQC', 'DRC', 'DRH', 'DRL', 'DSC', 'DSE', 'DSN', 'DTA', 'DTL', 'DTT', 'DVP', 'DXG', 'DXS', 'DXV', 'E1VFVN30', 'EIB', 'ELC', 'EVE', 'EVF', 'EVG', 'FCM', 'FCN', 'FDC', 'FIR', 'FIT', 'FMC', 'FPT', 'FRT', 'FTS', 'FUCTVGF3', 'FUCTVGF4', 'FUCTVGF5', 'FUCVREIT', 'FUEABVND', 'FUEBFVND', 'FUEDCMID', 'FUEFCV50', 'FUEIP100', 'FUEKIV30', 'FUEKIVFS', 'FUEKIVND', 'FUEMAV30', 'FUEMAVND', 'FUESSV30', 'FUESSV50', 'FUESSVFL', 'FUETCC50', 'FUEVFVND', 'FUEVN100', 'GAS', 'GDT', 'GEE', 'GEG', 'GEX', 'GIL', 'GMD', 'GMH', 'GSP', 'GTA', 'GVR', 'HAG', 'HAH', 'HAP', 'HAR', 'HAS', 'HAX', 'HCD', 'HCM', 'HDB', 'HDC', 'HDG', 'HHP', 'HHS', 'HHV', 'HID', 'HII', 'HMC', 'HNA', 'HPG', 'HPX', 'HQC', 'HRC', 'HSG', 'JVC', 'KBC', 'KDC', 'KDH', 'KHG', 'KHP', 'KMR', 'KOS', 'KPF', 'KSB', 'L10', 'LAF', 'LBM', 'LCG', 'LDG', 'LEC', 'LGC', 'LGL', 'LHG', 'LIX', 'LM8', 'LPB', 'LSS', 'MBB', 'MCM', 'MCP', 'MDG', 'MHC', 'MIG', 'MSB', 'MSH', 'MSN', 'MWG', 'NAB', 'NAF', 'NAV', 'NBB', 'NCT', 'NHA', 'NHH', 'NHT', 'NKG', 'NLG', 'NNC', 'NO1', 'NSC', 'NT2', 'NTL', 'NVL', 'NVT', 'OCB', 'OGC', 'OPC', 'ORS', 'PAC', 'PAN', 'PC1', 'PDN', 'PDR', 'PET', 'PGC', 'PGD', 'PGI', 'PGV', 'PHC', 'PHR', 'PIT', 'PJT', 'PLP', 'PLX', 'PMG', 'PNC', 'PNJ', 'POW', 'PPC', 'PSH', 'PTB', 'PTC', 'PTL', 'PVD', 'PVP', 'PVT', 'QCG', 'QNP', 'RAL', 'RDP', 'REE', 'RYG', 'S4A', 'SAB', 'SAM', 'SAV', 'SBA', 'SBG', 'SBT', 'SBV', 'SC5', 'SCR', 'SCS', 'SFC', 'SFG', 'SFI', 'SGN', 'SGR', 'SGT', 'SHA', 'SHB', 'SHI', 'SHP', 'SIP', 'SJD', 'SJS', 'SKG', 'SMA', 'SMB', 'SMC', 'SPM', 'SRC', 'SRF', 'SSB', 'SSC', 'SSI', 'ST8', 'STB', 'STG', 'STK', 'SVC', 'SVD', 'SVI', 'SVT', 'SZC', 'SZL', 'TBC', 'TCB', 'TCD', 'TCH', 'TCI', 'TCL', 'TCM', 'TCO', 'TCR', 'TCT', 'TDC', 'TDG', 'TDH', 'TDM', 'TDP', 'TDW', 'TEG', 'THG', 'TIP', 'TIX', 'TLD', 'TLG', 'TLH', 'TMP', 'TMS', 'TMT', 'TN1', 'TNC', 'TNH', 'TNI', 'TNT', 'TPB', 'TPC', 'TRA', 'TRC', 'TSC', 'TTA', 'TTE', 'TTF', 'TV2', 'TVB', 'TVS', 'TVT', 'TYA', 'UIC', 'VAF', 'VCA', 'VCB', 'VCF', 'VCG', 'VCI', 'VDP', 'VDS', 'VFG', 'VGC', 'VHC', 'VHM', 'VIB', 'VIC', 'VID', 'VIP', 'VIX', 'VJC', 'VMD', 'VND', 'VNE', 'VNG', 'VNL', 'VNM', 'VNS', 'VOS', 'VPB', 'VPD', 'VPG', 'VPH', 'VPI', 'VPS', 'VRC', 'VRE', 'VSC', 'VSH', 'VSI', 'VTB', 'VTO', 'VTP', 'YBM', 'YEG']