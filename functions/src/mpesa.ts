import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const initiateMpesaPayment = functions.https.onCall(async (data, context) => {
  // For now, allow without auth for testing
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  // }

  const { amount, phoneNumber, description, destination } = data;

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
    const recipientPhone = formatPhone("0110490333");

    // Create transaction in Firestore
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
    });

    functions.logger.info(`Payment initiated: ${senderPhone} -> ${recipientPhone}, KES ${amount}`);

    // Simulate payment completion for testing
    setTimeout(async () => {
      try {
        await transactionRef.update({
          status: 'completed',
          mpesaReceiptNumber: 'MPESA' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          confirmationMessage: `MPESA Confirmed. You sent Ksh ${amount} to Rongai Church.`,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        functions.logger.info(`Payment completed: ${transactionRef.id}`);
      } catch (error) {
        functions.logger.error('Error updating transaction:', error);
      }
    }, 3000);

    return {
      success: true,
      message: 'STK push initiated successfully!',
      transactionId: transactionRef.id,
      details: {
        from: senderPhone,
        to: recipientPhone,
        amount: amount,
        description: description
      }
    };

  } catch (error) {
    functions.logger.error('Payment error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to initiate payment');
  }
});

export const getUserTransactions = functions.https.onCall(async (data, context) => {
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