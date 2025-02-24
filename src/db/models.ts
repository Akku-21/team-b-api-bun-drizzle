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
  name: String,
  dob: String,
  licenseNumber: String,
  maritalStatus: String
});

const insuranceWishesSchema = new mongoose.Schema({
  coverageType: String,
  deductible: Number,
  insuranceStart: String
});

const personalDataSchema = new mongoose.Schema({
  email: String,
  phone: String,
  address: String,
  street: String,
  houseNumber: String,
  postalCode: String,
  city: String
});

const paymentInfoSchema = new mongoose.Schema({
  iban: String
});

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true , default:() => randomUUID() },
  formData: {
    vehicleData: vehicleDataSchema,
    driverInfo: driverInfoSchema,
    insuranceWishes: insuranceWishesSchema,
    personalData: personalDataSchema,
    paymentInfo: paymentInfoSchema,
    guid: String
  }
});

export const Customer = mongoose.model('Customer', customerSchema);
