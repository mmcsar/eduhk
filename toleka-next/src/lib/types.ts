export type Province =
  | "Haut-Katanga"
  | "Lualaba"
  | "Kinshasa"
  | "Kongo-Central"
  | "Kasaï"
  | "Kasaï-Central"
  | "Nord-Kivu"
  | "Sud-Kivu"
  | "Tshopo"
  | "Ituri"
  | "Tanganyika"
  | "Zambie"
  | "Angola";

export type Equipment =
  | "Flatbed"
  | "Dry Van"
  | "Reefer"
  | "Tanker"
  | "Lowboy"
  | "Container";

export type Load = {
  id: string;
  originProvince: Province;
  originCity: string;
  destinationProvince: Province;
  destinationCity: string;
  equipment: Equipment;
  lengthFt: number;
  weightKg: number;
  rateUsd?: number;
  postedHoursAgo: number;
  pickupWindow: string;
  commodity: string;
  company: string;
};

export type LoadSearchCriteria = {
  equipment?: Equipment | "Any";
  originProvince?: Province | "Any";
  originCity?: string;
  destinationProvince?: Province | "Any";
  destinationCity?: string;
  minLengthFt?: number;
  maxLengthFt?: number;
};

