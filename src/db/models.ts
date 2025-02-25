import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const vehicleDataSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  vin: String,
  hsnTsn: String,
  licensePlate: String,
  firstRegistration: String,
  firstRegistrationOwner: String,
  currentMileage: String
});

const driverInfoSchema = new mongoose.Schema({
  dob: String,
  licenseNumber: String,
  maritalStatus: String
});

const insuranceInfoSchema = new mongoose.Schema({
  startDate: String,
  previousInsurance: String,
  previousInsuranceNumber: String
});

const personalDataSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: { 
    type: String, 
    required: [true, 'lastName is required'],
    validate: [{
      validator: function(v: string) {
        return v && v.trim().length > 0;
      },
      message: 'lastName cannot be empty'
    }]
  },
  street: String,
  houseNumber: String,
  postalCode: String,
  city: String
});

const paymentInfoSchema = new mongoose.Schema({
  iban: String
});

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true, default: () => randomUUID() },
  formData: {
    vehicleData: vehicleDataSchema,
    driverInfo: driverInfoSchema,
    insuranceInfo: insuranceInfoSchema,
    personalData: personalDataSchema,
    paymentInfo: paymentInfoSchema,
    guid: String,
    editedByCustomer: { type: Boolean, default: false }
  }
});

export const Customer = mongoose.model('Customer', customerSchema);
