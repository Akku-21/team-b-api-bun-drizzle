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
    name: string;
    dob: string;
    licenseNumber: string;
    maritalStatus: string;
  };
  insuranceWishes: {
    coverageType: string;
    deductible: number;
    insuranceStart: string;
  };
  personalData: {
    email: string;
    phone: string;
    address: string;
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
            name: obj.formData.driverInfo.name,
            dob: obj.formData.driverInfo.dob,
            licenseNumber: obj.formData.driverInfo.licenseNumber,
            maritalStatus: obj.formData.driverInfo.maritalStatus
          },
          insuranceWishes: {
            coverageType: obj.formData.insuranceWishes.coverageType,
            deductible: obj.formData.insuranceWishes.deductible,
            insuranceStart: obj.formData.insuranceWishes.insuranceStart
          },
          personalData: {
            email: obj.formData.personalData.email,
            phone: obj.formData.personalData.phone,
            address: obj.formData.personalData.address,
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
