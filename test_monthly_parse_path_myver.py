"""Parse a year's PATH monthly ridership PDF into `<year>.parquet` +
`<year>-day-types.parquet`. Ported from `monthly.ipynb`."""

# RUN pip install pypdf tabula-py utz jpype1 fastparquet

from datetime import date
import json

import pandas as pd
from pypdf import PdfReader
from click import option
from tabula import read_pdf
from utz import err, now, relpath, sxs
from pathlib import Path
from datetime import datetime

COLS_AVG = ['station', 'total', 'avg weekday', 'avg sat', 'avg sun', 'avg holiday']
COLS_SUM = ['station', 'avg daily', 'total weekday', 'total sat', 'total sun', 'total holiday']


def _read_tables(pdf: str, last_month: int, template_path: str) -> dict[int, list[pd.DataFrame]]:
    with open(template_path) as f:
        rects = json.load(f)
    area = [[r[k] for k in ['y1', 'x1', 'y2', 'x2']] for r in rects]
    tables: dict[int, list[pd.DataFrame]] = {}
    for month in range(1, last_month + 1):
        dfs = read_pdf(
            pdf,
            pages=month,
            area=area,
            pandas_options={'header': None},
            stream=True,
        )
        n = len(dfs)
        msg = f'Pg {month}: {n} tables'
        if n == 5:
            print(msg)
        else:
            err(msg)
        tables[month] = dfs
    return tables


def _parse_avgs_sums(tables: dict[int, list[pd.DataFrame]], year: int) -> tuple[pd.DataFrame, pd.DataFrame]:
    avgs = pd.concat([
        df.assign(date=pd.Timestamp(year, month, 1))
        for month, dfs in tables.items()
        for df in dfs[:2]
    ])
    avgs.columns = COLS_AVG + ['month']
    avgs = avgs.assign(**{
        k: avgs[k].astype(str).str.replace(',', '').astype(int)
        for k in COLS_AVG[1:]
    })

    sums = pd.concat([
        df.assign(date=pd.Timestamp(year, month, 1))
        for month, dfs in tables.items()
        for df in dfs[2:4]
    ])
    sums.columns = COLS_SUM + ['month']
    sums = sums.assign(**{
        k: sums[k].astype(str).str.replace(',', '').astype(int)
        for k in COLS_SUM[1:]
    })
    return avgs, sums


def _parse_day_type_counts(tables: dict[int, list[pd.DataFrame]]) -> pd.DataFrame:
    def parse_nums(month: int, tbl: pd.DataFrame) -> pd.DataFrame:
        assert len(tbl) == 3
        assert all(tbl.iloc[0] == 'Average')
        tbl.columns = tbl.iloc[1].str.lower()
        tbl.columns.name = None
        tbl = tbl.iloc[2:]
        tbl.index = [month]
        tbl.index.name = 'month'
        return tbl.astype(int)

    nums = pd.concat([
        parse_nums(month=month, tbl=dfs[-1])
        for month, dfs in tables.items()
    ])
    nums.columns = [f'{c}s' for c in nums.columns]
    return nums


TEMPLATE_2023 = 'path_ridership/format/2023-PATH-Monthly-Ridership-Report.tabula-template.json'
TEMPLATE_2022 = 'path_ridership/format/2022-PATH-Monthly-Ridership-Report.tabula-template.json'

def template(year):
    return TEMPLATE_2023 if year >= 2023 else TEMPLATE_2022

def run_monthly(year: int, last_month: int | None = None, template_path: str | None = None) -> None:
    pdf = f'path_ridership/{year}-PATH-Monthly-Ridership-Report.pdf'

    if last_month is None:
        n_pages = len(PdfReader(pdf).pages)
        last_month = max(1, n_pages - 1)
        err(f"Inferred last_month={last_month}")
        template_path = template(year)

    tables = _read_tables(pdf, last_month, template_path)
    avgs, sums = _parse_avgs_sums(tables, year)
    nums = _parse_day_type_counts(tables)

    df = sxs(
        avgs.set_index(['month', 'station']),
        sums.set_index(['month', 'station']),
    )
    df = df[[COLS_SUM[1]] + COLS_AVG[2:] + [COLS_AVG[1]] + COLS_SUM[2:]]

    year_day_types_parquet = f'path_ridership/database/{year}-day-types.parquet'

    parquet_path = Path("path_ridership/database") / f"data_{year}.parquet"

    parquet_path.parent.mkdir(parents=True, exist_ok=True)

    df.to_parquet(parquet_path, engine="fastparquet")

    err(f"Wrote {relpath(parquet_path)}")

    day_types_path = Path("path_ridership/database") / f"data_{year}-day-types.parquet"
    # Store `month` as a regular column so it roundtrips deterministically
    # across pandas versions (pandas 3.0's default parquet index handling
    # doesn't always preserve named indexes like `month`).

    day_types_path.parent.mkdir(parents=True, exist_ok=True)

    nums.reset_index().to_parquet(day_types_path, engine='fastparquet', index=False)
    err(f"Wrote {relpath(day_types_path)}")


if __name__ == '__main__':

    for year in range(2013, (datetime.now().year + 1)): #current year + 1, exclusive
        run_monthly(year)


#CLEAN PARQUETS: REMOVE SUBTOTALS, CLEAN NUMBERED STATION NAMES, COMBINE TOGETHER

database_dir = Path("path_ridership/database")

remove_rows = [
    "UPTOWN SUBTOTAL",
    "NEW YORK SUBTOTAL",
    "NEW JERSEY SUBTOTAL"
]

for parquet_file in database_dir.glob("data_*.parquet"):

    if "-day-types" in parquet_file.name:
        continue

    df = pd.read_parquet(parquet_file)

    # print(parquet_file.name)
    # print(df.columns.tolist())

    #clear out rows to remove
    df = df[
        ~df.index.get_level_values("station").isin(remove_rows)
    ]

    #turn month/station index levels back into regular columns
    df = df.reset_index()

    #rename "[num]Street" to "[num] Street"

    station_rename_dict = {
        "9thStreet": "9th Street",
        "14thStreet": "14th Street",
        "23rdStreet": "23rd Street",
        "33rdStreet": "33rd Street",
        "MONTHLY TOTAL": "Total"
    }

    df["station"] = df["station"].replace(station_rename_dict)

    df.to_parquet(
        parquet_file,
        engine="fastparquet",
        index=False
    )

    print(f"Cleaned {parquet_file}")


files = [
    f for f in database_dir.glob("data_*.parquet")
    if "-day-types" not in f.name
]

df = pd.concat(
    [pd.read_parquet(f) for f in files],
    ignore_index=True
)

df.to_parquet(
    database_dir / "path-ridership-cleaned-monthly.parquet",
    engine="fastparquet",
    index=False
)

print(f"Merged parquet files")

for file in database_dir.glob("data_*.parquet"):
    # if "-day-types" not in file.name:
        file.unlink()
        print(f"Deleted {file}")

print(f"Removed individual year parquet files")