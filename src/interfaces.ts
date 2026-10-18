export interface Lanzamiento {
    name:     string;
    status:   Status;
    success:  boolean | null;
    date_utc: Date;
    pad?:     string;
    links?:   Links;
    rocket?:  string;
    details?: string;
}

export interface Links {
    article:   string;
    webcast:   string;
    wikipedia: string;
}

export type Status = "Launch Successful" | "Go for Launch";
