NEIGHBORHOOD DATA SUBMISSION INSTRUCTIONS
============================

File name: neighborhoods.csv
Encoding: UTF-8
Delimiter: Comma (,)
Header row: Required (do not modify column names)
Do not add or remove columns.
Can add new neighborhood rows.
Do not remove rows, if no longer have data for neighborhood please inform us to remove Neighborhood across our datasets.

COLUMN SPECIFICATION
====================

Column                         | Type                          | Required | Allowed Values / Notes
------------------------------|-------------------------------|----------|-----------------------------------------------
town                           | Text                          | Yes      |
zipcode                        | Text                          | Yes      |
ecc                            | Number                        | Yes      | Booleans expressed as integers (0 = False, non-zero = True)
violentcrime_quintile          | Number                        | Yes      | 1–5 (5 = Worst, 1 = Best)
education_percentile_quintile  | Number                        | Yes      | 1–5 (5 = Worst, 1 = Best)
education_percentile           | Number or "School Choice"     | Yes      | 0–100 (0 = Worst, 100 = Best); "School Choice" accepted
school_choice                  | Number                        | Yes      | Booleans expressed as integers (0 = False, non-zero = True)
total_mapc                     | Number                        | Yes      |
house_number_symbol            | Number                        | Yes      |
lat_lon_category               | Number                        | Yes      |
lat                            | Number                        | Yes      |
lon                            | Number                        | Yes      |
town_website_description       | Text                          | No       |
town_link                      | Text                          | No       | Valid town URL
wikipedia                      | Text                          | No       |
wikipedia_link                 | Text                          | No       | Valid town Wikipedia URL
street                         | Text                          | No       | Valid image link
school                         | Text                          | No       | Valid image link
town_square                    | Text                          | No       | Valid image link
open_space_or_landmark         | Text                          | No       | Valid image link
crime_percentile               | Number                        | Yes      | 0–100 (0 = Worst, 100 = Best)
max_rent_0br                   | Number                        | Yes      |
max_rent_1br                   | Number                        | Yes      |
max_rent_2br                   | Number                        | Yes      |
max_rent_3br                   | Number                        | Yes      |
max_rent_4br                   | Number                        | Yes      |
max_rent_5br                   | Number                        | Yes      |
max_rent_6br                   | Number                        | Yes      |
town_area                      | Text                          | No       | "Boston" or "Cambridge"
family_move_count              | Number                        | Yes      |
region                         | Text                          | Yes      | "North Shore", "Metro West", "Boston and Greater Boston", "South Shore"
