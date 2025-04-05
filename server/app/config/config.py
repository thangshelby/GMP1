# This is a configuration file for a Gemini-based chatbot application.
system_instruction="Chatbot này sẽ hoạt động như một broker chứng khoán chuyên nghiệp, hỗ trợ người dùng trong việc mua bán cổ phiếu và cung cấp tư vấn đầu tư. Nó sẽ phân tích dữ liệu thị trường để đưa ra các khuyến nghị mua hoặc bán cổ phiếu, dựa trên xu hướng hiện tại và lịch sử giao dịch. Ngoài ra, chatbot còn cung cấp thông tin thị trường được cập nhật liên tục, bao gồm các chỉ số chứng khoán, tin tức về thị trường, và báo cáo phân tích tài chính của các công ty, giúp người dùng có được cái nhìn sâu sắc và đầy đủ về tình hình tài chính và kinh tế mà họ quan tâm.",
 
generation_config = {
  "temperature": 0,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_NONE",
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
  },
]




#### INSTRUCTION FOR AI ####
summary_sample='business or financial summary for VIB (Vietnam International Bank), presented in a formal and comprehensive manner: Vietnam International Bank (VIB) operates as a commercial bank, providing a comprehensive suite of financial products and services to a diverse clientele, including individual customers, small and medium-sized enterprises (SMEs), and corporate clients. The banks core business activities encompass deposit accounts, lending solutions (such as personal loans, mortgages, and busine   s loans), credit cards, and wealth management services. VIB has established a robust digital banking platform, enhancing customer experience and operational efficiency. The bank has demonstrated a consistent growth trajectory, with a steady increase in total assets and equity over the past few years. VIBs financial performance is characterized by a healthy net interest margin, supported by effective asset-liability management. The banks non-performing loan (NPL) ratio remains within acceptable limits, reflecting prudent credit risk management practices. VIB has also made significant strides in enhancing its capital adequacy ratios, aligning with regulatory requirements and ensuring financial stability. Analysts maintain a positive outlook on VIB, citing its strong market position, innovative product offerings, and commitment to digital transformation as key drivers of future growth. However, potential investors should remain vigilant regarding macroeconomic factors and regulatory changes that may impact the banking sector in Vietnam.'


# sample of final analysis
final_sample='based on the financial and business data you provided for Hoa Phat Group (HPG), heres a concise analysis to inform your investment decision: Hoa Phat Group demonstrates characteristics of a growing company, as evidenced by the increasing trend in total assets and equity on its balance sheet. The companys core steel manufacturing operations, spanning from iron ore mining to finished products, position it as a key player in the Vietnamese steel industry. Revenue has fluctuated over the period, impacting operating and net income, which suggests sensitivity to market conditions. Profitability metrics like ROE and ROA show variability, indicating inconsistent efficiency in utilizing equity and assets. However, the relatively stable and low Long Term Debt/Equity ratio suggests a conservative approach to long-term financing. Analyst outlook leans towards "Sell," which should be considered carefully. The compans strategic focus on technological innovation and capacity expansion aims to maintain its leading position. However, the financial performance is significantly influenced by steel price fluctuations and demand in the construction and manufacturing sectors. Given the,... '


