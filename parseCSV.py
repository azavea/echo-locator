import csv


if __name__ == '__main__':
	with open('neighborhoods.csv', newline='') as csvfile:
		neighborhoods = []
		reader = csv.DictReader(csvfile)
		for row in reader:
			if len(row['zipcode']) != 5:
				neighborhoods.append(str('0' +  row['zipcode']))
			else:
				neighborhoods.append(row['zipcode'])

		print(neighborhoods)
