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

exchanges=[
     'HOSE', # Ho Chi Minh Stock Exchange
    'HNX',  # Hanoi Stock Exchange
    'UPCOM', # Unlisted Public Company Market
]

indexes=[
 
    'VN30',
    'VN100',
    'VNMidCap',
    'VNSmallCap',
    'VNAllShare',
    'ETF',
    'HNX30',
    'HNXCon',
    'HNXFin',
    'HNXMan',
    'HNXLCap',
    'FU_INDEX',
]

technical_signals = [
  "TL Supp.",
  "TL Resist.",
  "Horizontal S/R",
  "Wedge Up",
  "Wedge Down",
  "Wedge",
  "Triangle Asc.",
  "Triangle Desc.",
  "Channel Up",
  "Channel",
  "Channel Down",
  "Double Top",
  "Double Bottom",
  "Multiple Top",
  "Multiple Bottom",
  "Head&Shoulders"
];  

hose=['AAA', 'AAM', 'AAT', 'ABR', 'ABS', 'ABT', 'ACB', 'ACC', 'ACG', 'ACL', 'ADG', 'ADP', 'ADS', 'AGG', 'AGM', 'AGR', 'ANV', 'APG', 'APH', 'ASG', 'ASM', 'ASP', 'AST', 'BAF', 'BBC', 'BCE', 'BCG', 'BCM', 'BFC', 'BHN', 'BIC', 'BID', 'BKG', 'BMC', 'BMI', 'BMP', 'BRC', 'BSI', 'BSR', 'BTP', 'BTT', 'BVH', 'BWE', 'C32', 'C47', 'CCI', 'CCL', 'CDC', 'CHP', 'CIG', 'CII', 'CKG', 'CLC', 'CLL', 'CLW', 'CMG', 'CMV', 'CMX', 'CNG', 'COM', 'CRC', 'CRE', 'CSM', 'CSV', 'CTD', 'CTF', 'CTG', 'CTI', 'CTR', 'CTS', 'CVT', 'D2D', 'DAH', 'DAT', 'DBC', 'DBD', 'DBT', 'DC4', 'DCL', 'DCM', 'DGC', 'DGW', 'DHA', 'DHC', 'DHG', 'DHM', 'DIG', 'DLG', 'DMC', 'DPG', 'DPM', 'DPR', 'DQC', 'DRC', 'DRH', 'DRL', 'DSC', 'DSE', 'DSN', 'DTA', 'DTL', 'DTT', 'DVP', 'DXG', 'DXS', 'DXV', 'E1VFVN30', 'EIB', 'ELC', 'EVE', 'EVF', 'EVG', 'FCM', 'FCN', 'FDC', 'FIR', 'FIT', 'FMC', 'FPT', 'FRT', 'FTS', 'FUCTVGF3', 'FUCTVGF4', 'FUCTVGF5', 'FUCVREIT', 'FUEABVND', 'FUEBFVND', 'FUEDCMID', 'FUEFCV50', 'FUEIP100', 'FUEKIV30', 'FUEKIVFS', 'FUEKIVND', 'FUEMAV30', 'FUEMAVND', 'FUESSV30', 'FUESSV50', 'FUESSVFL', 'FUETCC50', 'FUEVFVND', 'FUEVN100', 'GAS', 'GDT', 'GEE', 'GEG', 'GEX', 'GIL', 'GMD', 'GMH', 'GSP', 'GTA', 'GVR', 'HAG', 'HAH', 'HAP', 'HAR', 'HAS', 'HAX', 'HCD', 'HCM', 'HDB', 'HDC', 'HDG', 'HHP', 'HHS', 'HHV', 'HID', 'HII', 'HMC', 'HNA', 'HPG', 'HPX', 'HQC', 'HRC', 'HSG', 'JVC', 'KBC', 'KDC', 'KDH', 'KHG', 'KHP', 'KMR', 'KOS', 'KPF', 'KSB', 'L10', 'LAF', 'LBM', 'LCG', 'LDG', 'LEC', 'LGC', 'LGL', 'LHG', 'LIX', 'LM8', 'LPB', 'LSS', 'MBB', 'MCM', 'MCP', 'MDG', 'MHC', 'MIG', 'MSB', 'MSH', 'MSN', 'MWG', 'NAB', 'NAF', 'NAV', 'NBB', 'NCT', 'NHA', 'NHH', 'NHT', 'NKG', 'NLG', 'NNC', 'NO1', 'NSC', 'NT2', 'NTL', 'NVL', 'NVT', 'OCB', 'OGC', 'OPC', 'ORS', 'PAC', 'PAN', 'PC1', 'PDN', 'PDR', 'PET', 'PGC', 'PGD', 'PGI', 'PGV', 'PHC', 'PHR', 'PIT', 'PJT', 'PLP', 'PLX', 'PMG', 'PNC', 'PNJ', 'POW', 'PPC', 'PSH', 'PTB', 'PTC', 'PTL', 'PVD', 'PVP', 'PVT', 'QCG', 'QNP', 'RAL', 'RDP', 'REE', 'RYG', 'S4A', 'SAB', 'SAM', 'SAV', 'SBA', 'SBG', 'SBT', 'SBV', 'SC5', 'SCR', 'SCS', 'SFC', 'SFG', 'SFI', 'SGN', 'SGR', 'SGT', 'SHA', 'SHB', 'SHI', 'SHP', 'SIP', 'SJD', 'SJS', 'SKG', 'SMA', 'SMB', 'SMC', 'SPM', 'SRC', 'SRF', 'SSB', 'SSC', 'SSI', 'ST8', 'STB', 'STG', 'STK', 'SVC', 'SVD', 'SVI', 'SVT', 'SZC', 'SZL', 'TBC', 'TCB', 'TCD', 'TCH', 'TCI', 'TCL', 'TCM', 'TCO', 'TCR', 'TCT', 'TDC', 'TDG', 'TDH', 'TDM', 'TDP', 'TDW', 'TEG', 'THG', 'TIP', 'TIX', 'TLD', 'TLG', 'TLH', 'TMP', 'TMS', 'TMT', 'TN1', 'TNC', 'TNH', 'TNI', 'TNT', 'TPB', 'TPC', 'TRA', 'TRC', 'TSC', 'TTA', 'TTE', 'TTF', 'TV2', 'TVB', 'TVS', 'TVT', 'TYA', 'UIC', 'VAF', 'VCA', 'VCB', 'VCF', 'VCG', 'VCI', 'VDP', 'VDS', 'VFG', 'VGC', 'VHC', 'VHM', 'VIB', 'VIC', 'VID', 'VIP', 'VIX', 'VJC', 'VMD', 'VND', 'VNE', 'VNG', 'VNL', 'VNM', 'VNS', 'VOS', 'VPB', 'VPD', 'VPG', 'VPH', 'VPI', 'VPS', 'VRC', 'VRE', 'VSC', 'VSH', 'VSI', 'VTB', 'VTO', 'VTP', 'YBM', 'YEG']

hnx=['AAV', 'ADC', 'ALT', 'AMC', 'AME', 'AMV', 'API', 'APS', 'ARM', 'ATS', 'BAB', 'BAX', 'BBS', 'BCC', 'BCF', 'BDB', 'BED', 'BKC', 'BNA', 'BPC', 'BSC', 'BST', 'BTS', 'BTW', 'BVS', 'BXH', 'C69', 'CAG', 'CAN', 'CAP', 'CAR', 'CCR', 'CDN', 'CEO', 'CET', 'CIA', 'CJC', 'CKV', 'CLH', 'CLM', 'CMC', 'CMS', 'CPC', 'CSC', 'CST', 'CTB', 'CTP', 'CTT', 'CVN', 'CX8', 'D11', 'DAD', 'DAE', 'DC2', 'DDG', 'DHP', 'DHT', 'DIH', 'DL1', 'DNC', 'DNP', 'DP3', 'DS3', 'DST', 'DTD', 'DTG', 'DTK', 'DVM', 'DXP', 'EBS', 'ECI', 'EID', 'EVS', 'FID', 'GDW', 'GIC', 'GKM', 'GLT', 'GMA', 'GMX', 'HAD', 'HAT', 'HBS', 'HCC', 'HCT', 'HDA', 'HEV', 'HGM', 'HHC', 'HJS', 'HKT', 'HLC', 'HLD', 'HMH', 'HMR', 'HOM', 'HTC', 'HUT', 'HVT', 'ICG', 'IDC', 'IDJ', 'IDV', 'INC', 'INN', 'IPA', 'ITQ', 'IVS', 'KDM', 'KHS', 'KKC', 'KMT', 'KSD', 'KSF', 'KSQ', 'KST', 'KSV', 'KTS', 'L14', 'L18', 'L40', 'LAS', 'LBE', 'LCD', 'LDP', 'LHC', 'LIG', 'MAC', 'MAS', 'MBG', 'MBS', 'MCC', 'MCF', 'MCO', 'MDC', 'MED', 'MEL', 'MIC', 'MKV', 'MST', 'MVB', 'NAG', 'NAP', 'NBC', 'NBP', 'NBW', 'NDN', 'NDX', 'NET', 'NFC', 'NHC', 'NRC', 'NSH', 'NST', 'NTH', 'NTP', 'NVB', 'OCH', 'ONE', 'PBP', 'PCE', 'PCG', 'PCH', 'PCT', 'PDB', 'PEN', 'PGN', 'PGS', 'PGT', 'PHN', 'PIA', 'PIC', 'PJC', 'PLC', 'PMB', 'PMC', 'PMP', 'PMS', 'POT', 'PPE', 'PPP', 'PPS', 'PPT', 'PPY', 'PRC', 'PRE', 'PSC', 'PSD', 'PSE', 'PSI', 'PSW', 'PTD', 'PTI', 'PTS', 'PTX', 'PV2', 'PVB', 'PVC', 'PVG', 'PVI', 'PVS', 'QHD', 'QST', 'QTC', 'RCL', 'S55', 'S99', 'SAF', 'SCG', 'SCI', 'SD5', 'SD9', 'SDA', 'SDC', 'SDG', 'SDN', 'SDU', 'SEB', 'SED', 'SFN', 'SGC', 'SGD', 'SGH', 'SHE', 'SHN', 'SHS', 'SJ1', 'SJE', 'SLS', 'SMN', 'SMT', 'SPC', 'SPI', 'SRA', 'SSM', 'STC', 'STP', 'SVN', 'SZB', 'TA9', 'TBX', 'TDT', 'TET', 'TFC', 'THB', 'THD', 'THS', 'THT', 'TIG', 'TJC', 'TKU', 'TMB', 'TMC', 'TMX', 'TNG', 'TOT', 'TPH', 'TPP', 'TSB', 'TTC', 'TTH', 'TTL', 'TTT', 'TV3', 'TV4', 'TVC', 'TVD', 'TXM', 'UNI', 'V12', 'V21', 'VBC', 'VC1', 'VC2', 'VC3', 'VC6', 'VC7', 'VC9', 'VCC', 'VCM', 'VCS', 'VDL', 'VE1', 'VE3', 'VE4', 'VE8', 'VFS', 'VGP', 'VGS', 'VHE', 'VHL', 'VIF', 'VIG', 'VIT', 'VLA', 'VMC', 'VMS', 'VNC', 'VNF', 'VNR', 'VNT', 'VSA', 'VSM', 'VTC', 'VTH', 'VTJ', 'VTV', 'VTZ', 'WCS', 'WSS', 'X20']

upcom=['A32', 'AAH', 'AAS', 'ABB', 'ABC', 'ABI', 'ABW', 'ACE', 'ACM', 'ACS', 'ACV', 'AFX', 'AG1', 'AGF', 'AGP', 'AGX', 'AIC', 'AIG', 'ALV', 'AMD', 'AMP', 'AMS', 'ANT', 'APC', 'APF', 'APL', 'APP', 'APT', 'ART', 'ASA', 'ATA', 'ATB', 'ATG', 'AVC', 'AVF', 'AVG', 'BAL', 'BBH', 'BBM', 'BBT', 'BCA', 'BCB', 'BCP', 'BCR', 'BCV', 'BDG', 'BDT', 'BDW', 'BEL', 'BGE', 'BGW', 'BHA', 'BHC', 'BHG', 'BHI', 'BHK', 'BHP', 'BIG', 'BII', 'BIO', 'BLF', 'BLI', 'BLN', 'BLT', 'BMD', 'BMF', 'BMG', 'BMJ', 'BMK', 'BMN', 'BMS', 'BMV', 'BNW', 'BOT', 'BQB', 'BRR', 'BRS', 'BSA', 'BSD', 'BSG', 'BSH', 'BSL', 'BSP', 'BSQ', 'BT1', 'BT6', 'BTB', 'BTD', 'BTG', 'BTH', 'BTN', 'BTU', 'BTV', 'BVB', 'BVG', 'BVL', 'BVN', 'BWA', 'BWS', 'C12', 'C21', 'C22', 'C4G', 'C92', 'CAD', 'CAT', 'CBI', 'CBS', 'CC1', 'CC4', 'CCA', 'CCM', 'CCP', 'CCT', 'CCV', 'CDG', 'CDH', 'CDO', 'CDP', 'CDR', 'CEN', 'CFM', 'CFV', 'CGV', 'CH5', 'CHC', 'CHS', 'CI5', 'CID', 'CIP', 'CK8', 'CKA', 'CKD', 'CLG', 'CLX', 'CMD', 'CMF', 'CMI', 'CMK', 'CMM', 'CMN', 'CMP', 'CMT', 'CMW', 'CNA', 'CNC', 'CNN', 'CNT', 'CPA', 'CPH', 'CPI', 'CQN', 'CQT', 'CSI', 'CT3', 'CT6', 'CTA', 'CTN', 'CTW', 'CTX', 'CYC', 'DAC', 'DAG', 'DAN', 'DAS', 'DBM', 'DC1', 'DCF', 'DCG', 'DCH', 'DCR', 'DCS', 'DCT', 'DDB', 'DDH', 'DDM', 'DDN', 'DDV', 'DFC', 'DFF', 'DGT', 'DHB', 'DHD', 'DHN', 'DIC', 'DID', 'DKC', 'DKW', 'DLD', 'DLR', 'DLT', 'DM7', 'DMN', 'DMS', 'DNA', 'DND', 'DNE', 'DNH', 'DNL', 'DNM', 'DNN', 'DNT', 'DNW', 'DOC', 'DOP', 'DP1', 'DP2', 'DPC', 'DPH', 'DPP', 'DPS', 'DRG', 'DRI', 'DSD', 'DSG', 'DSP', 'DTB', 'DTC', 'DTE', 'DTH', 'DTI', 'DTP', 'DUS', 'DVC', 'DVG', 'DVN', 'DVW', 'DWC', 'DWS', 'DXL', 'DZM', 'E12', 'E29', 'ECO', 'EFI', 'EIC', 'EIN', 'EME', 'EMG', 'EMS', 'EPC', 'EPH', 'FBA', 'FBC', 'FCC', 'FCS', 'FGL', 'FHN', 'FHS', 'FIC', 'FLC', 'FOC', 'FOX', 'FRC', 'FRM', 'FSO', 'FT1', 'FTI', 'FTM', 'G20', 'G36', 'GAB', 'GCB', 'GCF', 'GDA', 'GER', 'GGG', 'GH3', 'GHC', 'GLC', 'GLW', 'GMC', 'GND', 'GPC', 'GSM', 'GTD', 'GTS', 'GTT', 'GVT', 'H11', 'HAC', 'HAF', 'HAI', 'HAM', 'HAN', 'HAV', 'HBC', 'HBD', 'HBH', 'HC1', 'HC3', 'HCB', 'HCI', 'HD2', 'HD6', 'HD8', 'HDM', 'HDO', 'HDP', 'HDS', 'HDW', 'HEC', 'HEJ', 'HEP', 'HES', 'HFB', 'HFC', 'HFX', 'HGT', 'HHG', 'HHN', 'HIG', 'HIO', 'HJC', 'HKB', 'HLA', 'HLB', 'HLO', 'HLS', 'HLT', 'HLY', 'HMD', 'HMG', 'HMS', 'HNB', 'HND', 'HNF', 'HNG', 'HNI', 'HNM', 'HNP', 'HNR', 'HOT', 'HPB', 'HPD', 'HPH', 'HPI', 'HPM', 'HPP', 'HPT', 'HPW', 'HRB', 'HSA', 'HSI', 'HSM', 'HSP', 'HSV', 'HTE', 'HTM', 'HTP', 'HTT', 'HU3', 'HU4', 'HU6', 'HUG', 'HVA', 'HVG', 'HWS', 'IBC', 'IBD', 'ICC', 'ICF', 'ICI', 'ICN', 'IDP', 'IFS', 'IHK', 'ILA', 'ILC', 'ILS', 'IME', 'IN4', 'ING', 'IRC', 'ISG', 'ISH', 'IST', 'ITA', 'ITS', 'JOS', 'KAC', 'KCB', 'KCE', 'KGM', 'KHD', 'KHL', 'KHW', 'KIP', 'KLB', 'KLF', 'KSH', 'KTC', 'KTL', 'KTT', 'KVC', 'KWA', 'L12', 'L35', 'L43', 'L44', 'L45', 'L61', 'L62', 'L63', 'LAI', 'LAW', 'LCC', 'LCM', 'LCS', 'LDW', 'LG9', 'LGM', 'LIC', 'LKW', 'LLM', 'LM3', 'LM7', 'LMC', 'LMH', 'LMI', 'LNC', 'LO5', 'LPT', 'LQN', 'LSG', 'LTC', 'LTG', 'LUT', 'M10', 'MA1', 'MBN', 'MBT', 'MCG', 'MCH', 'MDA', 'MDF', 'MEC', 'MEF', 'MES', 'MFS', 'MGC', 'MGG', 'MGR', 'MH3', 'MHL', 'MIE', 'MIM', 'MKP', 'MLC', 'MLS', 'MML', 'MNB', 'MND', 'MPC', 'MPT', 'MPY', 'MQB', 'MQN', 'MRF', 'MSR', 'MTA', 'MTB', 'MTC', 'MTG', 'MTH', 'MTL', 'MTP', 'MTS', 'MTV', 'MTX', 'MVC', 'MVN', 'MZG', 'NAC', 'NAS', 'NAU', 'NAW', 'NBE', 'NBT', 'NCG', 'NCS', 'ND2', 'NDC', 'NDF', 'NDP', 'NDT', 'NDW', 'NED', 'NEM', 'NGC', 'NHP', 'NHV', 'NJC', 'NLS', 'NNT', 'NOS', 'NQB', 'NQN', 'NQT', 'NS2', 'NSG', 'NSL', 'NSS', 'NTB', 'NTC', 'NTF', 'NTT', 'NTW', 'NUE', 'NVP', 'NWT', 'NXT', 'ODE', 'OIL', 'ONW', 'PAI', 'PAP', 'PAS', 'PAT', 'PBC', 'PBT', 'PCC', 'PCF', 'PCM', 'PDC', 'PDV', 'PEC', 'PEG', 'PEQ', 'PFL', 'PGB', 'PHH', 'PHP', 'PHS', 'PID', 'PIS', 'PIV', 'PJS', 'PLA', 'PLE', 'PLO', 'PMJ', 'PMT', 'PMW', 'PND', 'PNG', 'PNP', 'PNT', 'POB', 'POM', 'POS', 'POV', 'PPH', 'PPI', 'PQN', 'PRO', 'PRT', 'PSB', 'PSG', 'PSL', 'PSN', 'PSP', 'PTE', 'PTG', 'PTH', 'PTO', 'PTP', 'PTT', 'PTV', 'PVA', 'PVE', 'PVH', 'PVL', 'PVM', 'PVO', 'PVR', 'PVV', 'PVX', 'PVY', 'PWA', 'PWS', 'PX1', 'PXA', 'PXC', 'PXI', 'PXL', 'PXM', 'PXS', 'PXT', 'QBS', 'QCC', 'QHW', 'QNC', 'QNS', 'QNT', 'QNU', 'QNW', 'QPH', 'QSP', 'QTP', 'RAT', 'RBC', 'RCC', 'RCD', 'RIC', 'RTB', 'S12', 'S27', 'S72', 'S74', 'S96', 'SAC', 'SAL', 'SAP', 'SAS', 'SB1', 'SBB', 'SBD', 'SBH', 'SBL', 'SBM', 'SBR', 'SBS', 'SCC', 'SCD', 'SCJ', 'SCL', 'SCO', 'SCY', 'SD1', 'SD2', 'SD3', 'SD4', 'SD6', 'SD7', 'SD8', 'SDB', 'SDD', 'SDJ', 'SDK', 'SDP', 'SDT', 'SDV', 'SDX', 'SDY', 'SEA', 'SEP', 'SGB', 'SGI', 'SGP', 'SGS', 'SHC', 'SHG', 'SID', 'SIG', 'SII', 'SIV', 'SJC', 'SJF', 'SJG', 'SJM', 'SKH', 'SKN', 'SKV', 'SNC', 'SNZ', 'SP2', 'SPB', 'SPD', 'SPH', 'SPV', 'SQC', 'SRB', 'SSF', 'SSG', 'SSH', 'SSN', 'STH', 'STL', 'STS', 'STT', 'STW', 'SVG', 'SVH', 'SWC', 'SZE', 'SZG', 'TA6', 'TAB', 'TAL', 'TAN', 'TAR', 'TAW', 'TB8', 'TBD', 'TBH', 'TBR', 'TBT', 'TBW', 'TCJ', 'TCK', 'TCW', 'TDB', 'TDF', 'TDS', 'TED', 'TEL', 'TGG', 'TGP', 'TH1', 'THM', 'THN', 'THP', 'THU', 'THW', 'TID', 'TIE', 'TIN', 'TIS', 'TKA', 'TKC', 'TKG', 'TL4', 'TLI', 'TLP', 'TLT', 'TMG', 'TMW', 'TNA', 'TNB', 'TNM', 'TNP', 'TNS', 'TNV', 'TNW', 'TOP', 'TOS', 'TOW', 'TPS', 'TQN', 'TQW', 'TR1', 'TRS', 'TRT', 'TS3', 'TS4', 'TSA', 'TSD', 'TSG', 'TSJ', 'TST', 'TT6', 'TTB', 'TTD', 'TTG', 'TTN', 'TTS', 'TTZ', 'TUG', 'TV1', 'TV6', 'TVA', 'TVG', 'TVH', 'TVM', 'TVN', 'TW3', 'UCT', 'UDC', 'UDJ', 'UDL', 'UEM', 'UMC', 'UPC', 'UPH', 'USC', 'USD', 'UXC', 'V11', 'V15', 'VAB', 'VAV', 'VBB', 'VBG', 'VBH', 'VC5', 'VCE', 'VCP', 'VCR', 'VCT', 'VCW', 'VCX', 'VDB', 'VDG', 'VDN', 'VDT', 'VE2', 'VE9', 'VEA', 'VEC', 'VEF', 'VES', 'VET', 'VFC', 'VFR', 'VGG', 'VGI', 'VGL', 'VGR', 'VGT', 'VGV', 'VHD', 'VHF', 'VHG', 'VHH', 'VIE', 'VIH', 'VIM', 'VIN', 'VIR', 'VIW', 'VKC', 'VKP', 'VLB', 'VLC', 'VLF', 'VLG', 'VLP', 'VLW', 'VMA', 'VMG', 'VMK', 'VMT', 'VNA', 'VNB', 'VNH', 'VNI', 'VNP', 'VNX', 'VNY', 'VNZ', 'VOC', 'VPA', 'VPC', 'VPR', 'VPW', 'VQC', 'VRG', 'VSE', 'VSF', 'VSG', 'VSN', 'VST', 'VTA', 'VTD', 'VTE', 'VTG', 'VTI', 'VTK', 'VTL', 'VTM', 'VTQ', 'VTR', 'VTS', 'VTX', 'VUA', 'VVN', 'VVS', 'VW3', 'VWS', 'VXB', 'VXP', 'VXT', 'WSB', 'WTC', 'X26', 'X77', 'XDH', 'XHC', 'XLV', 'XMC', 'XMD', 'XMP', 'XPH', 'YBC', 'YTC']