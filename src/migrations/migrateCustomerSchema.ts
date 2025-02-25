import { connectDB } from '../db/connection';
import { Customer } from '../db/models';

async function migrateCustomerSchema() {
  try {
    await connectDB();
    
    const customers = await Customer.find({});
    
    for (const customer of customers) {
      // Get the old data structure
      const oldData = customer.toObject();
      
      // Transform insurance wishes to insurance info
      const insuranceInfo = {
        startDate: oldData.formData.insuranceWishes?.insuranceStart || '',
        previousInsurance: '',  // New field
        previousInsuranceNumber: ''  // New field
      };
      
      // Transform personal data
      const personalData = {
        email: oldData.formData.personalData?.email || '',
        firstName: oldData.formData.personalData?.firstName || '',
        lastName: oldData.formData.personalData?.lastName || 
                 (oldData.formData.driverInfo?.name || '').split(' ').slice(1).join(' ') || 'Unknown', // Default to 'Unknown' instead of empty string
        street: oldData.formData.personalData?.street || '',
        houseNumber: oldData.formData.personalData?.houseNumber || '',
        postalCode: oldData.formData.personalData?.postalCode || '',
        city: oldData.formData.personalData?.city || ''
      };

      // Update the document
      await Customer.updateOne(
        { _id: customer._id },
        {
          $set: {
            'formData.insuranceInfo': insuranceInfo,
            'formData.personalData': personalData
          },
          $unset: {
            'formData.insuranceWishes': 1,
            'formData.personalData.phone': 1,
            'formData.personalData.address': 1,
            'formData.driverInfo.name': 1
          }
        }
      );
      
      console.log(`Migrated customer: ${customer.customerId}`);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateCustomerSchema(); 