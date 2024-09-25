import { HeartRateAggregatedOutput, HeartRateDataInput } from "../../types";

const getMinOfTwoDate = (date1: string, date2: string) => {
    return new Date(Math.min((new Date(date1)).getTime(), (new Date(date2)).getTime())).toISOString();
}

const getMaxOfTwoDate = (date1: string, date2: string) => {
    return new Date(Math.max((new Date(date1)).getTime(), (new Date(date2)).getTime())).toISOString();
}

export const processData = (data: HeartRateDataInput[], intervalDuration: number) => {
    const groupedData: Record<string, HeartRateAggregatedOutput> = {};
    for(const item of data){
        const date = new Date(item.on_date);
        const roundedMinutes = Math.floor(date.getMinutes() / intervalDuration) * intervalDuration;
        date.setMinutes(roundedMinutes, 0, 0);
        const key = date.toISOString();

        if (!groupedData[key]) {
            groupedData[key] = {
                from_date: item.on_date,
                to_date: item.on_date,
                min: item.measurement,
                max: item.measurement
            };
        } else {
            groupedData[key] = {
                from_date: getMinOfTwoDate(groupedData[key].from_date, item.on_date),
                to_date: getMaxOfTwoDate(groupedData[key].from_date, item.on_date),
                min: Math.min(Number(groupedData[key].min), Number(item.measurement)).toString(),
                max: Math.max(Number(groupedData[key].max), Number(item.measurement)).toString()
            }
        }
    }
    return Object.values(groupedData);
}