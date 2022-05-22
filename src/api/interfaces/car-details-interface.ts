export interface CarDetails {
  licenseplate_number: string;
  registration_number: string;
  registration_state: string;
  registration_expiration_date: string;
  registration_name: string;
  vin_number: string;
  car_value: number;
  current_mileage: number;
  description?: string;
  color: string;
}

export interface CarDetailsDeleteResponse {
  id: string;
}
