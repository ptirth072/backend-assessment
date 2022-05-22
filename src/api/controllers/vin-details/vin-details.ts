import axios from "axios";
import { VINDetailsEntity } from "../../models";

export class VINDetailsController {
  async create(vin_details: VINDetailsEntity, isCreate): Promise<VINDetailsEntity | Error> {
    try {
      const result = await this.getVINDecodedInfo(vin_details.vin_number);

      if (!result.Results || !result.Results[0]) {
        return new Error("Invalid VIN number provided.");
      }

      const vinResult = result.Results[0];

      if (vinResult.AdditionalErrorText && vinResult.AdditionalErrorText !== "") {
        return new Error(vinResult.AdditionalErrorText);
      }

      vin_details.make = vinResult.Make;
      vin_details.manufacturer = vinResult.Manufacturer;
      vin_details.model = vinResult.Model;
      vin_details.year = vinResult.ModelYear;

      if(isCreate) {
        return await VINDetailsEntity.create(vin_details).save();
      }

      return await VINDetailsEntity.save(vin_details);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async getVINDecodedInfo(code: string): Promise<any> {
    try {
      const vehicleDecodeURL = `${process.env.VEHICLE_DECODE_API_URL}${code}?format=json`;

      const response = await axios.get(vehicleDecodeURL);

      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
