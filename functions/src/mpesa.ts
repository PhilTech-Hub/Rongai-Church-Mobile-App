import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const initiateMpesaPayment = functions.https.onCall(async (data, context) => {
  // For now, skip authentication for testing
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  // }

  const { amount, phoneNumber, description, destination } = data;

  // Validate input
  if (!amount || !phoneNumber || !description) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    const userId = context.auth?.uid || 'test_user';

    // Format phone numbers
    const formatPhone = (phone: string): string => {
      let cleaned = phone.replace(/\D/g, '');
      if (cleaned.startsWith('0')) {
        cleaned = '254' + cleaned.substring(1);
      } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
        cleaned = '254' + cleaned;
      }
      return cleaned;
    };

    const senderPhone = formatPhone(phoneNumber);
    const recipientPhone = formatPhone("0110490333"); // Church number

    // Create transaction record in Firestore
    const transactionRef = await admin.firestore().collection('transactions').add({
      userId,
      destination: destination || 'General Donation',
      amount: amount,
      description,
      senderPhone: senderPhone,
      recipientPhone: recipientPhone,
      status: 'pending',
      type: 'sent',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      // Simulate M-Pesa response for testing
      testMode: true,
      note: `This would send STK push to ${senderPhone} to pay ${recipientPhone}`
    });

    // Log the payment attempt
    functions.logger.info(`Payment initiated: ${senderPhone} -> ${recipientPhone}, KES ${amount}`);
    functions.logger.info(`Description: ${description}, Destination: ${destination}`);

    // For testing - simulate successful payment after 3 seconds
    setTimeout(async () => {
      try {
        await transactionRef.update({
          status: 'completed',
          mpesaReceiptNumber: 'TEST' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          confirmationMessage: `MPESA Confirmed: TEST123. You sent Ksh ${amount} to Rongai Church.`,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        functions.logger.info(`Test payment completed for transaction: ${transactionRef.id}`);
      } catch (error) {
        functions.logger.error('Error updating transaction:', error);
      }
    }, 3000);

    return {
      success: true,
      message: 'STK push initiated successfully',
      transactionId: transactionRef.id,
      details: {
        from: senderPhone,
        to: recipientPhone,
        amount: amount,
        description: description
      },
      note: 'In test mode - payment will auto-complete in 3 seconds'
    };

  } catch (error) {
    functions.logger.error('Payment error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to initiate payment');
  }
});

// Get user transactions
export const getUserTransactions = functions.https.onCall(async (data, context) => {
  // For testing, allow without auth
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  // }

  const userId = context.auth?.uid || 'test_user';
  const { limit = 50 } = data;

  try {
    const snapshot = await admin.firestore()
      .collection('transactions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      transactions
    };
  } catch (error) {
    functions.logger.error('Error fetching transactions:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch transactions');
  }
});