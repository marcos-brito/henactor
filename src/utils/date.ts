enum Months {
    Jan,
    Feb,
    Mar,
    Apr,
    May,
    Jun,
    Jul,
    Aug,
    Sep,
    Out,
    Nov,
    Dec,
}

export function formatTimeStamp(epochTime: number): string {
    const date = new Date(epochTime);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();

    return `${Months[month]} ${day}, ${year}`;
}
