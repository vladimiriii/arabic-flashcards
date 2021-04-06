# -*- coding: utf-8 -*-
#import pandas as pd
import json

# Read In Data from Excel.
# Removed right now since we have readymade csv
#df = pd.read_excel("./data.xlsx", header=0)

file = open("N5.csv", "r")
json_string = ''
for line in file.readlines():
    try:
        t = { 'japanese': line.split(',')[1],
              'kanji': line.split(',')[2],
              'id': line.split(',')[0],
              'english': line.split(',')[4],
              'category': line.split(',')[3]}
    except Exception:
        print line + " is wrongly formatted" 
    json_string += json.dumps(t, ensure_ascii=False)+","
file.close()
json_string = "var data = [" + json_string + "];"

# Write to file
text_file = open("jdata.js", "w")
text_file.write(json_string)
text_file.close()
