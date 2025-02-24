import { t } from "elysia";

// Request schemas
export const vehicleDataSchema = t.Object({
  make: t.String(),
  model: t.String(),
  year: t.Number(),
  vin: t.String(),
  hsnTsn: t.String(),
  licensePlate: t.String(),
  firstRegistration: t.String(),
  firstRegistrationOwner: t.String(),
  currentMileage: t.String()
})

export const driverInfoSchema = t.Object({
  name: t.String(),
  dob: t.String(),
  licenseNumber: t.String(),
  maritalStatus: t.String()
})

export const insuranceWishesSchema = t.Object({
  coverageType: t.String(),
  deductible: t.Number(),
  insuranceStart: t.String()
})

export const personalDataSchema = t.Object({
  email: t.String(),
  phone: t.String(),
  address: t.String(),
  street: t.String(),
  houseNumber: t.String(),
  postalCode: t.String(),
  city: t.String()
})

export const paymentInfoSchema = t.Object({
  iban: t.String()
})

export const formDataSchema = t.Object({
  vehicleData: vehicleDataSchema,
  driverInfo: driverInfoSchema,
  insuranceWishes: insuranceWishesSchema,
  personalData: personalDataSchema,
  paymentInfo: paymentInfoSchema,
  guid: t.String()
})

export const createCustomerDataSchema = t.Object({
  formData: formDataSchema
})

export const customerDataSchema = t.Object({
  customerId: t.String(),
  formData: formDataSchema
})

// Response schemas
export const successResponse = t.Object({
  success: t.Literal(true),
  message: t.String()
})

export const errorResponse = t.Object({
  success: t.Literal(false),
  message: t.String()
})

export const customerDataResponse = t.Object({
  success: t.Literal(true),
  data: customerDataSchema
})

export const customersDataResponse = t.Object({
  success: t.Literal(true),
  data: t.Array(customerDataSchema)
})
