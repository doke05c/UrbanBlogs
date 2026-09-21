from lxml import html
import requests
import json
from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import pandas as pd

# pip install openpyxl

#get PANYNJ page url
BASE_URL = "https://www.panynj.gov"

###### PATH ######

MODEL_URL = f"{BASE_URL}/content/path/en.model.json"

output_dir = Path("path_ridership")
output_dir.mkdir(parents=True, exist_ok=True)

#get AEM page model
response = requests.get(MODEL_URL)
response.raise_for_status()
data = response.json()

#navigate to Stats page
stats = data[":children"]["/path/en/about/stats"]
root = stats[":items"]["root"]
responsivegrid = root[":items"]["responsivegrid"]

#get HTML inside the text component
text_html = responsivegrid[":items"]["text"]["text"]
tree = html.fromstring(text_html)

#find monthly reports
for link in tree.xpath("//a"):
    name = link.text_content().strip()
    href = link.get("href")

    if "Monthly-Ridership" not in href and "PATH-Ridership-Report.pdf" not in href:
        continue
    
    url = urljoin(BASE_URL, href)
    filename = url.split("/")[-1]
    filepath = output_dir / filename

    print(f"Downloading {filename}...")

    response = requests.get(url)
    response.raise_for_status()

    filepath.write_bytes(response.content)


output_dir = Path("path_ridership")

for file in output_dir.glob("*-PATH-Ridership-Report.pdf"):
    year = file.name.split("-")[0]
    new_file = output_dir / f"{year}-PATH-Monthly-Ridership-Report.pdf"

    file.rename(new_file)
    print(f"Renamed: {file.name} -> {new_file.name}")


###### PANYNJ CROSSINGS ######

MODEL_URL = f"{BASE_URL}/content/bridges-tunnels/en.model.json"

output_dir = Path("panynj_crossings")
output_dir.mkdir(parents=True, exist_ok=True)

#get AEM page model
response = requests.get(MODEL_URL)
response.raise_for_status()
data = response.json()

#navigate to Stats page
stats = data[":children"]["/bridges-tunnels/en/traffic---volume-information---b-t"]
root = stats[":items"]["root"]
responsivegrid = root[":items"]["responsivegrid"]

#get HTML inside the text component
text_html = responsivegrid[":items"]["textblock"]["text"]
tree = html.fromstring(text_html)

#find monthly reports
for link in tree.xpath("//a"):
    name = link.text_content().strip()
    href = link.get("href")

    if "traffic-e-zpass-usage" not in href:
        continue
    
    url = urljoin(BASE_URL, href)
    filename = url.split("/")[-1]

    filepath = output_dir / filename

    print(f"Downloading {filename}...")

    response = requests.get(url)
    response.raise_for_status()

    filepath.write_bytes(response.content)


output_dir = Path("panynj_crossings")

for file in output_dir.glob("traffic-e-zpass-usage-*.pdf"):
    year = file.stem.split("-")[-1]
    new_file = output_dir / f"traffic-e-zpass-usage-{year}.pdf"

    file.rename(new_file)
    print(f"Renamed: {file.name} -> {new_file.name}")


###### NJT FTA DATA ######

BASE_URL = "https://www.transit.dot.gov"
MODEL_URL = f"{BASE_URL}/ntd/data-product/monthly-module-adjusted-data-release"

output_dir = Path("njt_data")
output_dir.mkdir(parents=True, exist_ok=True)

headers = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64; rv:155.0) "
        "Gecko/20100101 Firefox/155.0"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


session = requests.Session()

response = session.get(MODEL_URL, headers=headers)
response.raise_for_status()

soup = BeautifulSoup(response.text, "html.parser")

xlsx_link = next(
    a["href"]
    for a in soup.find_all("a", href=True)
    if a["href"].lower().endswith(".xlsx")
)

xlsx_url = urljoin(MODEL_URL, xlsx_link)

print(xlsx_url)


filename = "Complete_Monthly_Ridership.xlsx"

output_file = output_dir / filename

print(f"Downloading {filename}...")

xlsx_response = session.get(xlsx_url, headers=headers)
xlsx_response.raise_for_status()

with open(output_file, "wb") as f:
    f.write(xlsx_response.content)

print(f"Wrote {output_file}")

filepath.write_bytes(xlsx_response.content)

fta_xlsx = pd.ExcelFile(output_file)

print(fta_xlsx.sheet_names)

print(fta_xlsx.parse("UPT"))

df_fta_xlsx_upt = fta_xlsx.parse("UPT")
df_fta_xlsx_upt_njt = df_fta_xlsx_upt[df_fta_xlsx_upt["Agency"] == "New Jersey Transit Corporation"] 

((fta_xlsx.parse("UPT"))).to_csv("njt_data/FTA_UPT_Ridership.csv")
df_fta_xlsx_upt_njt.to_csv("njt_data/FTA_UPT_NJT_Ridership.csv")

# fta_xlsx.parse(sheet_name)
