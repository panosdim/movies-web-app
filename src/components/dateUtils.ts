export const now: string = new Date().toISOString().slice(0, 10);

const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getMonthName = (monthNum: number): string => {
    return months[monthNum - 1] || '';
};

export const formatReleaseDate = (date: string): string => {
    const [yyyy, mm, dd] = date.split('-');
    const monthName = getMonthName(Number(mm));
    return `${dd} ${monthName} ${yyyy}`;
};
