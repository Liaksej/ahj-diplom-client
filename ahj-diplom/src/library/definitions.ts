export interface Item {
  id: string;
  name: string;
  fileUrl: string;
  fileName: string;
  mime: string;
  date: string;
}

export interface Message {
  id: string;
  text: string;
  fileUrl: string;
  fileName: string;
  mime: string;
  geoData?: {
    lat: number;
    lng: number;
    place: string;
  };
  date: string;
  user: {
    id: string;
    name: string;
  };
}
