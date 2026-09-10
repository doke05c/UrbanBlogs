from lxml import html
import requests
import json
from pathlib import Path
from urllib.parse import urljoin

#get PANYNJ page url
BASE_URL = "https://www.panynj.gov"
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