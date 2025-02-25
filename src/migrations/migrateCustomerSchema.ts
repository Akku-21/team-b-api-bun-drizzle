import { connectDB } from '../db/connection';
import { Customer } from '../db/models';

async function migrateCustomerSchema() {
  try {
    await connectDB();
    
    const customers = await Customer.find({});
    
    for (const customer of customers) {
      const oldData = customer.toObject();
      const formData = oldData.formData || {};
      
      // Transform insurance wishes to insurance info
      const insuranceInfo = {
        startDate: formData.insuranceWishes?.insuranceStart || '',
        previousInsurance: '',
        previousInsuranceNumber: ''
      };
      
      // Transform personal data with proper lastName handling
      let lastName = formData.personalData?.lastName || '';
      
      // If lastName is empty, try to get it from driverInfo name
      if (!lastName.trim() && formData.driverInfo?.name) {
        const nameParts = formData.driverInfo.name.split(' ');
        if (nameParts.length > 1) {
          lastName = nameParts.slice(1).join(' ');
        }
      }
      
      // If still empty, use 'Unknown'
      if (!lastName.trim()) {
        lastName = 'Unknown';
      }

      const personalData = {
        email: formData.personalData?.email || '',
        firstName: formData.personalData?.firstName || '',
        lastName,
        street: formData.personalData?.street || '',
        houseNumber: formData.personalData?.houseNumber || '',
        postalCode: formData.personalData?.postalCode || '',
        city: formData.personalData?.city || ''
      };

      // Update the document
      await Customer.updateOne(
        { _id: customer._id },
        {
          $set: {
            'formData.insuranceInfo': insuranceInfo,
            'formData.personalData': personalData,
            'formData.editedByCustomer': false
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