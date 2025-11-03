import { format, formatDistanceToNow } from "date-fns";

export function fmtDate(d: Date | string | number) {
    const dt = new Date(d);
    const nice = format(dt, "dd MMM yyyy, HH:mm");
    const rel = formatDistanceToNow(dt, { addSuffix: true });
    return `${nice} - ${rel}`;
}

export function toStrTags(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String);
    return []; // tags stored as JSON array in DB
}