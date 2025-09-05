const LIKE_NAME_INDEX_LIMIT = 50;

// Group neighborhoods with the same name if close together in ranking
// Group separately between "top ten" and remaining list
const groupRankingListsByLikeNeigborhoodName = (
    list: string[],
    neighborhoodNameByZipcode: { [zip: string]: string }
): (string | string[])[] => {
    const groupedList: (string | string[])[] = [];
    const alreadyGroupedIndexes: Set<number> = new Set();

    list.forEach((zip, i) => {
        if (alreadyGroupedIndexes.has(i)) {
            return;
        }

        const name =
            neighborhoodNameByZipcode && neighborhoodNameByZipcode[zip];
        const group = [zip];
        alreadyGroupedIndexes.add(i);

        const likeNameIndexMax = Math.min(
            i + LIKE_NAME_INDEX_LIMIT + 1,
            list.length
        );

        for (let j = i + 1; j < likeNameIndexMax; j++) {
            if (i === j || alreadyGroupedIndexes.has(j)) return;

            const compareZip = list[j];
            const compareName =
                neighborhoodNameByZipcode &&
                neighborhoodNameByZipcode[compareZip];

            if (compareName === name) {
                group.push(compareZip);
                alreadyGroupedIndexes.add(j);
            }
        }

        groupedList.push(group.length > 1 ? group : group[0]);
    });

    return groupedList;
};

export default groupRankingListsByLikeNeigborhoodName;
