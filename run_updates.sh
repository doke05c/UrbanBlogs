#!/usr/bin/env bash

echo "Update call started: $(date)" >> /home/doke30/urban_blogs/UrbanBlogs/run_updates.log

echo "Running data and graphics updates.."

cd /mnt/16E592CD114CDCBB/Users/david/Documents/SSTRP_DATA/report_card
sleep 0.5

echo "Running API pulls.."
python3 api_pull_test.py

sleep 0.5

cd "/home/doke30/urban_blogs/UrbanBlogs/"

echo "Pulling data from Port Authority, NJ..."
python3 test_scrape_path.py
python3 test_monthly_parse_path_myver.py

echo "Running data view updates, creating .jsons"
node scripts/build_views.js

sleep 0.5

echo "Running build version of site"

npm run build

git add "src/*"
git commit -m "routine update"
git push