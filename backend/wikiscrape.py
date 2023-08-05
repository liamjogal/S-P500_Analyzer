import requests
from bs4 import BeautifulSoup

sp500_raw = requests.get(
    "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")
soup = BeautifulSoup(sp500_raw.content, "html.parser")

table = str(soup.find("table", {"id": "constituents"}))
table_soup = BeautifulSoup(table, 'html.parser')
rows = table_soup.find_all("tr")

tickers = []
companies = []
both = {}
for row in rows[1:]:
    row_soup = BeautifulSoup(str(row), 'html.parser')
    row_arr = row_soup.find_all('a')
    tickers.append(row_arr[0].string)
    companies.append(row_arr[1].string)
    both[row_arr[0].string] = row_arr[1].string
