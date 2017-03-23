# -*- coding: utf-8 -*-
import pandas as pd

# Read In Data
df = pd.read_excel("./data.xlsx", header=0)

# Create JSON String
json_string = df.to_json(orient="records", force_ascii=False)
json_string = "var data = " + json_string + ";"

# Write to file
text_file = open("data.js", "w")
text_file.write(json_string)
text_file.close()
