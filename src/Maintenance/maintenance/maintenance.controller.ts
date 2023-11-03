import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';


@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new trip' })
  @ApiCreatedResponse({ description: 'The trip has been successfully added.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async addTrip(@Body() MaintenanceType: MaintenanceTypeDTO) {
    try {
      const results = await this.databaseService.callAddTripProcedure(
        tripData.trip_id,
        tripData.start_date,
        tripData.end_date,
        tripData.distance,
        tripData.fuel_expense,
        tripData.vehicle_id,
        tripData.driver_id,
        tripData.trip_type_id,
      );
      return results;
    } catch (error) {
      // Handle the error appropriately
      return { error: error.message };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Gets all trip' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async getAllTrips() {
    try {
      const query = 'SELECT * FROM trip';
      const results = await this.databaseService.executeQuery(query);
      return results;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Gets trip by id ' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async getTripById(@Param('id') id: string) {
    try {
      const query = `SELECT * FROM trip t where t.trip_id=${id}`;
      const results = await this.databaseService.executeQuery(query);
      return results;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update trip by id' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiBody({ type: TripDataDto })
  async updateTripById(
    @Param('id') id: string,
    @Body() updatedTripData: Partial<TripDataDto>, // Replace 'any' with the appropriate type for your Trip object
  ) {
    try {
      const updatedTrip = await this.tripService.updateTrip(
        id,
        updatedTripData,
      );

      if (!updatedTrip) {
        return { error: 'No fields to update or trip not found' };
      }

      return updatedTrip;
    } catch (error) {
      return { error: error.message };
    }
  }
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete trip by id' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async deleteTripById(@Param('id') id: string) {
    try {
      const deletionResult = await this.tripService.deleteTrip(id);

      if (deletionResult.error) {
        console.log(deletionResult.error);
        return { error: deletionResult.error };
      }

      return { message: 'Trip deleted successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
