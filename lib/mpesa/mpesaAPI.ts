import axios from 'axios';

// LIVE CONFIG - For real money transfers
const LIVE_CONFIG = {
  consumerKey: 'lk7Y9Lo6UNAWbr16p3UTyGV654T6vcu1U5D8lUAkrjRqTOAE',
  consumerSecret: 'R6N5IcZPxoG3MJ27rhLkOjFz8ld7kvCxAGiRy3CgAmsbKwu32SL2mFpypFlvsxYO',
  businessShortCode: '0741103341', // Your Pochi la Biashara number
  passkey: 'YOUR_LIVE_PASSKEY', // You need to get this from Daraja
  baseURL: 'https://api.safaricom.co.ke' // Live API endpoint
};

export const fundPochiViaSTK = async (amount: number, phoneNumber: string) => {
  try {
    console.log('🔐 Getting LIVE access token...');
    
    // Step 1: Get access token from LIVE environment
    const auth = Buffer.from(`${LIVE_CONFIG.consumerKey}:${LIVE_CONFIG.consumerSecret}`).toString('base64');
    
    const tokenResponse = await axios.get(
      'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log('✅ LIVE Access token received');

    // Step 2: Prepare STK Push request for LIVE environment
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -3);
    const password = Buffer.from(LIVE_CONFIG.businessShortCode + LIVE_CONFIG.passkey + timestamp).toString('base64');

    console.log('📱 Initiating LIVE STK Push...');
    console.log(`💳 From: ${phoneNumber}`);
    console.log(`🏢 To Pochi: ${LIVE_CONFIG.businessShortCode}`);
    console.log(`💰 Amount: KSH ${amount}`);
    
    const stkResponse = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: LIVE_CONFIG.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline', // Use this for Pochi/Business
        Amount: amount,
        PartyA: phoneNumber, // Sender: 0110490333
        PartyB: LIVE_CONFIG.businessShortCode, // Receiver: Your Pochi
        PhoneNumber: phoneNumber, // Sender phone
        CallBackURL: 'https://yourdomain.com/callback', // We'll handle this
        AccountReference: 'ChurchApp',
        TransactionDesc: 'Church Donation to Pochi'
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('🎉 LIVE STK Push initiated successfully!');
    console.log('📱 Check your phone for M-Pesa prompt');
    return stkResponse.data;
  } catch (error: any) {
    console.error('❌ LIVE STK Push failed:', error.response?.data || error.message);
    throw error;
  }
};