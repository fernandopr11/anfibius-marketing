export interface Canton {
    canton: string;
    parroquias?: Record<string, string>;
}

export interface Provincia {
    provincia: string;
    cantones: Record<string, Canton>;
}

export interface EcuadorGeoData {
    [key: string]: Provincia;
}