import { Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { CarDetailsEntity, VINDetailsEntity } from "../../models";
import { CarDetails, CarDetailsDeleteResponse } from "../../interfaces/car-details-interface";
import { VINDetailsController } from "../vin-details/vin-details";

@JsonController("/car-details")
export class CarDetailsController {
  @Get("/:id")
  async get(@Param("id") id: string): Promise<CarDetailsEntity> {

    const carDetail = await CarDetailsEntity.findOne({ where: {id: id}, relations: ["vin_details"] });
    if(!carDetail) {
      throw new Error(`Car details with ${id} not found. Please try again!`)
    }

    return carDetail;
  }

  @Delete("/:id")
  async delete(@Param("id") id: string): Promise<CarDetailsDeleteResponse> {
    const carDetail = await CarDetailsEntity.findOne({ where: {id: id}, relations: ["vin_details"] });
    if(!carDetail) {
      throw new Error(`Car details with ${id} not found. Please try again!`)
    }

    try {
      // Since cascade is defined deleting the reference in VINDetailsEntity will also delete the record in CarDetailsEntity
      await VINDetailsEntity.remove(carDetail.vin_details);
    }
    catch(err) {
      throw new Error("Failed to delete. Please try again!", err);
    }

    return { id: carDetail.id };
  }

  @Post("/")
  async create(@Body() body: CarDetails): Promise<CarDetailsEntity> {
    this.carDetailsValidationCheck(body);

    const vinDetails = new VINDetailsEntity();
    vinDetails.vin_number = body.vin_number;

    const vinDetailsController = new VINDetailsController();
    const vinDetailsResult = await vinDetailsController.create(vinDetails, true);

    if (vinDetailsResult instanceof Error) {
      throw vinDetailsResult as Error;
    }

    const carDetails = new CarDetailsEntity();
    carDetails.licenseplate_number = body.licenseplate_number;
    carDetails.registration_number = body.registration_number;
    carDetails.registration_state = body.registration_state;
    carDetails.registration_expiration = new Date(body.registration_expiration_date);
    carDetails.registration_name = body.registration_name;
    carDetails.vin_details = vinDetailsResult as VINDetailsEntity;
    carDetails.car_value = body.car_value;
    carDetails.current_mileage = body.current_mileage;
    carDetails.description = body.description;
    carDetails.color = body.color;

    return await CarDetailsEntity.create(carDetails).save();
  }

  @Put("/:id")
  async update(@Param("id") id: string, @Body() body: CarDetails): Promise<CarDetailsEntity> {
    const carDetail = await CarDetailsEntity.findOne({ where: {id: id}, relations: ["vin_details"] });
    if(!carDetail) {
      throw new Error(`Car details with ${id} not found. Please try again!`)
    }

    if (!body) {
      return carDetail;
    }

    if (body.licenseplate_number) {
      if (body.licenseplate_number.trim().length <= 0) {
        throw new Error("Invalid license plate number.");
      }

      carDetail.licenseplate_number = body.licenseplate_number;
    }

    if (body.registration_number) {
      if (body.registration_number.trim().length <= 0) {
        throw new Error("Invalid registration number.");
      }

      carDetail.registration_number = body.registration_number;
    }

    if (body.current_mileage) {
      if (body.current_mileage < 0) {
        throw new Error("Invalid current mileage. Must be greater than zero.");
      }

      carDetail.current_mileage = body.current_mileage;
    }

    if (body.car_value) {
      if (body.car_value < 0) {
        throw new Error("Invalid car value. Must be greater than zero.");
      }

      carDetail.car_value = body.car_value;
    }


    if (body.registration_expiration_date) {
      const expirationDate = new Date(body.registration_expiration_date);

      if (expirationDate === undefined || expirationDate.toString() === "Invalid Date") {
        throw new Error("Incorrect date or date format provided.")
      }
      carDetail.registration_expiration = expirationDate;
    }

    if (body.description) {
      carDetail.description = body.description;
    }
    if (body.color) {
      carDetail.color = body.color;
    }
    if (body.registration_state) {
      carDetail.registration_state = body.registration_state;
    }
    if (body.registration_name) {
      carDetail.registration_name = body.registration_name.trim();
    }

    if (body.vin_number) {
      if (body.vin_number.trim().length <= 0) {
        throw new Error("Invalid VIN.");
      }
      if (body.vin_number.trim() !== carDetail.vin_details.vin_number) {
        const vinDetails = carDetail.vin_details;
        vinDetails.vin_number = body.vin_number;
        const vinDetailsController = new VINDetailsController();
        const vinDetailsResult = await vinDetailsController.create(vinDetails, false);
        if (vinDetailsResult instanceof Error) {
          throw vinDetailsResult as Error;
        }
        carDetail.vin_details = vinDetailsResult as VINDetailsEntity;
      }
    }

    return CarDetailsEntity.save(carDetail);
  }

  private carDetailsValidationCheck(carDetails: CarDetails) {
    if (carDetails.licenseplate_number.trim().length <= 0) {
      throw new Error("Invalid license plate number.");
    }
    if (carDetails.registration_number.trim().length <= 0) {
      throw new Error("Invalid registration number.");
    }
    if (carDetails.vin_number.trim().length <= 0) {
      throw new Error("Invalid VIN.");
    }
    if (carDetails.current_mileage < 0) {
      throw new Error("Invalid current mileage. Must be greater than zero.");
    }
    if (carDetails.car_value < 0) {
      throw new Error("Invalid car value. Must be greater than zero.");
    }

    const expirationDate = new Date(carDetails.registration_expiration_date);
    if (expirationDate === undefined || expirationDate.toString() === "Invalid Date") {
      throw new Error("Incorrect date/date format provided.")
    }
  }
}
