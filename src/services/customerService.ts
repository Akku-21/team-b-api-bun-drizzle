import { Customer } from '../db/models';
import { DatabaseError, NotFoundError } from '../errors/errors';

interface CustomerFormData {
  vehicleData: {
    make: string;
    model: string;
    year: number;
    vin: string;
    hsnTsn: string;
    licensePlate: string;
    firstRegistration: string;
    firstRegistrationOwner: string;
    currentMileage: string;
  };
  driverInfo: {
    dob: string;
    licenseNumber: string;
    maritalStatus: string;
  };
  insuranceInfo: {
    startDate: string;
    previousInsurance: string;
    previousInsuranceNumber: string;
  };
  personalData: {
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  paymentInfo: {
    iban: string;
  };
  guid: string;
}

interface CreateCustomerData {
  formData: CustomerFormData;
}

interface CustomerData {
  customerId: string;
  formData: CustomerFormData;
}

export class CustomerService {
  private transformMongooseDoc(doc: any): CustomerData {
    const obj = doc.toObject();
    return {
      customerId: obj.customerId,
      formData: {
        vehicleData: {
          make: obj.formData.vehicleData.make,
          model: obj.formData.vehicleData.model,
          year: obj.formData.vehicleData.year,
          vin: obj.formData.vehicleData.vin,
          hsnTsn: obj.formData.vehicleData.hsnTsn,
          licensePlate: obj.formData.vehicleData.licensePlate,
          firstRegistration: obj.formData.vehicleData.firstRegistration,
          firstRegistrationOwner: obj.formData.vehicleData.firstRegistrationOwner,
          currentMileage: obj.formData.vehicleData.currentMileage
        },
        driverInfo: {
          dob: obj.formData.driverInfo.dob,
          licenseNumber: obj.formData.driverInfo.licenseNumber,
          maritalStatus: obj.formData.driverInfo.maritalStatus
        },
        insuranceInfo: {
          startDate: obj.formData.insuranceInfo.startDate,
          previousInsurance: obj.formData.insuranceInfo.previousInsurance,
          previousInsuranceNumber: obj.formData.insuranceInfo.previousInsuranceNumber
        },
        personalData: {
          email: obj.formData.personalData.email,
          firstName: obj.formData.personalData.firstName,
          lastName: obj.formData.personalData.lastName,
          street: obj.formData.personalData.street,
          houseNumber: obj.formData.personalData.houseNumber,
          postalCode: obj.formData.personalData.postalCode,
          city: obj.formData.personalData.city
        },
        paymentInfo: {
          iban: obj.formData.paymentInfo.iban
        },
        guid: obj.formData.guid
      }
    };
  }

  async createCustomer(customerData: CreateCustomerData) {
    try {
      const customer = new Customer(customerData);
      await customer.save();
      return { success: true as const, message: "Data saved successfully" };
    } catch (error) {
      throw new DatabaseError(error instanceof Error ? error.message : 'Error saving customer data');
    }
  }

  async getCustomer(customerId: string): Promise<{ success: true, data: CustomerData }> {
    try {
      const customer = await Customer.findOne({ customerId });
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }
      return {
        success: true,
        data: this.transformMongooseDoc(customer),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(error instanceof Error ? error.message : 'Error retrieving customer data');
    }
  }

  async getAllCustomers(): Promise<{ success: true, data: CustomerData[] }> {
    try {
      const customers = await Customer.find();
      return {
        success: true,
        data: customers.map(customer => this.transformMongooseDoc(customer))
      };
    } catch (error) {
      throw new DatabaseError(error instanceof Error ? error.message : 'Error retrieving all customers');
    }
  }

  async deleteCustomer(customerId: string) {
    try {
      const result = await Customer.findOneAndDelete({ customerId });
      if (!result) {
        throw new NotFoundError('Customer not found');
      }
      return { success: true as const, message: "Customer deleted successfully" };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(error instanceof Error ? error.message : 'Error deleting customer');
    }
  }
}
