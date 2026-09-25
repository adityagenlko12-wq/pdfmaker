import {
  createCheckoutOrder,
  verifyAndFinalizePayment,
  adminConfirmManualPayment,
  adminRefundPayment,
  handleGatewayWebhook,
  loadData,
  saveData
} from './payments.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('--- STARTING PAYMENT SECURITY & ARCHITECTURE TEST SUITE ---');

// Backup initial data
const initialData = JSON.parse(JSON.stringify(loadData()));

try {
  // TEST 1: Server-authoritative Order Creation
  console.log('\n[1] Order Creation: Server calculates amount; frontend cannot inject price');
  const order1 = createCheckoutOrder({
    userId: 'usr_demo_02',
    planId: 'pro',
    billingCycle: 'monthly',
    gateway: 'stripe'
  });
  assert(order1.orderId.startsWith('ord_'), 'Generated valid unique orderId');
  assert(order1.amount === 9.99, 'Amount is strictly server-calculated as 9.99, not client-provided');
  assert(order1.isTestMode === true, 'Correctly flags gateway as Test Mode');

  // TEST 2: Successful Payment Upgrades User Plan
  console.log('\n[2] Successful Payment Verification');
  const initialUser = loadData().users.find(u => u.id === 'usr_demo_02');
  const successRes = verifyAndFinalizePayment({
    orderId: order1.orderId,
    gateway: 'stripe',
    transactionId: 'txn_valid_stripe_999124',
    paymentData: { cardNumber: '4242 4242 4242 4242' }
  });
  assert(successRes.success === true, 'Verification succeeds with valid transaction');
  assert(successRes.payment.status === 'paid', 'Payment status is marked as paid');
  assert(successRes.payment.verificationStatus === 'Verified (Server-side)', 'Has server-side verification status');
  const updatedUser = loadData().users.find(u => u.id === 'usr_demo_02');
  assert(updatedUser.planId === 'pro', 'User plan was upgraded to pro');
  assert(updatedUser.planExpiresAt !== null, 'User plan expiry date was extended');

  // TEST 3: Idempotency & Duplicate Prevention
  console.log('\n[3] Idempotency: Duplicate payment submission / refresh button');
  const dupRes = verifyAndFinalizePayment({
    orderId: order1.orderId,
    gateway: 'stripe',
    transactionId: 'txn_valid_stripe_999124'
  });
  assert(dupRes.alreadyProcessed === true, 'Detects duplicate order submission and skips re-processing');

  // TEST 4: Fake Frontend Request MUST NOT upgrade user
  console.log('\n[4] Fake Frontend Request Rejection');
  let fakeBlocked = false;
  try {
    verifyAndFinalizePayment({
      orderId: 'ord_fake_invalid_id',
      clientStatus: 'paid'
    });
  } catch (err) {
    fakeBlocked = true;
  }
  assert(fakeBlocked, 'Direct client-side status: "paid" is completely rejected');

  // TEST 5: Failed Payment (e.g. Card Declined) MUST NOT upgrade user
  console.log('\n[5] Failed Payment: Gateway declines transaction');
  const order2 = createCheckoutOrder({
    userId: 'usr_guest_03',
    planId: 'enterprise',
    billingCycle: 'monthly',
    gateway: 'stripe'
  });
  const failRes = verifyAndFinalizePayment({
    orderId: order2.orderId,
    gateway: 'stripe',
    transactionId: 'txn_declined_123',
    paymentData: { cardNumber: '4000 0000 0000 0002' } // ending in 0002 simulates decline
  });
  assert(failRes.success === false, 'Payment failure properly captured');
  assert(failRes.payment.status === 'failed', 'Payment recorded with status failed');
  const guestUser = loadData().users.find(u => u.id === 'usr_guest_03');
  assert(guestUser.planId === 'free', 'User plan remained free starter (NOT upgraded)');

  // TEST 6: Cancelled Payment MUST NOT upgrade user
  console.log('\n[6] Cancelled Payment: User cancels checkout');
  const order3 = createCheckoutOrder({
    userId: 'usr_guest_03',
    planId: 'pro',
    gateway: 'stripe'
  });
  const cancelRes = verifyAndFinalizePayment({
    orderId: order3.orderId,
    gateway: 'stripe',
    paymentData: { simulateCancel: true }
  });
  assert(cancelRes.status === 'cancelled', 'Checkout recorded as cancelled');
  const guestUserAfterCancel = loadData().users.find(u => u.id === 'usr_guest_03');
  assert(guestUserAfterCancel.planId === 'free', 'User plan remains free (NOT upgraded)');

  // TEST 7: Missing or Fake Transaction ID Rejected
  console.log('\n[7] Missing Transaction ID Rejected');
  let txIdBlocked = false;
  try {
    verifyAndFinalizePayment({
      orderId: order3.orderId,
      gateway: 'stripe',
      transactionId: ''
    });
  } catch (err) {
    txIdBlocked = true;
  }
  assert(txIdBlocked, 'Empty transaction ID is rejected');

  // TEST 8: Gateway Mismatch Rejected
  console.log('\n[8] Gateway Mismatch Rejected');
  const order4 = createCheckoutOrder({
    userId: 'usr_guest_03',
    planId: 'pro',
    gateway: 'paypal'
  });
  let gwMismatchBlocked = false;
  try {
    verifyAndFinalizePayment({
      orderId: order4.orderId,
      gateway: 'stripe', // wrong gateway
      transactionId: 'txn_some_id_99'
    });
  } catch (err) {
    gwMismatchBlocked = true;
  }
  assert(gwMismatchBlocked, 'Gateway mismatch is rejected');

  // TEST 9: Manual Bank Transfer requires Admin Review & cannot be auto-confirmed
  console.log('\n[9] Manual Bank Transfer Workflow');
  const manualOrder = createCheckoutOrder({
    userId: 'usr_guest_03',
    planId: 'pro',
    gateway: 'manual'
  });
  const manualRes = verifyAndFinalizePayment({
    orderId: manualOrder.orderId,
    gateway: 'manual',
    transactionId: 'wire_ref_test_01'
  });
  assert(manualRes.manualReviewRequired === true, 'Manual payment flags manualReviewRequired');
  assert(manualRes.planUpgraded === false, 'User plan is NOT upgraded yet upon submission');

  // TEST 10: Admin Confirm ONLY allowed for manual methods
  console.log('\n[10] Admin Confirmation Restrictions');
  let automatedConfirmBlocked = false;
  try {
    // Attempting to admin-confirm the Stripe payment from Test 2
    adminConfirmManualPayment(successRes.payment.id, 'usr_admin_01');
  } catch (err) {
    automatedConfirmBlocked = true;
  }
  assert(automatedConfirmBlocked, 'Admin confirm is forbidden for automated gateways (Stripe/PayPal/Razorpay)');

  // Admin confirm manual payment DOES work
  const adminConfirmRes = adminConfirmManualPayment(manualRes.payment.id, 'usr_admin_01');
  assert(adminConfirmRes.success === true, 'Admin can confirm genuine manual bank transfer');
  const userAfterManualConfirm = loadData().users.find(u => u.id === 'usr_guest_03');
  assert(userAfterManualConfirm.planId === 'pro', 'User plan upgraded after genuine Admin manual confirmation');

  // TEST 11: Webhook duplicate idempotency
  console.log('\n[11] Webhook Idempotency');
  const webhookOrder = createCheckoutOrder({
    userId: 'usr_guest_03',
    planId: 'enterprise',
    gateway: 'stripe'
  });
  const wh1 = handleGatewayWebhook('stripe', {
    eventType: 'payment_intent.succeeded',
    orderId: webhookOrder.orderId,
    transactionId: 'wh_txn_unique_991'
  });
  assert(wh1.success === true, 'First webhook triggers successful payment');

  const wh2 = handleGatewayWebhook('stripe', {
    eventType: 'payment_intent.succeeded',
    orderId: webhookOrder.orderId,
    transactionId: 'wh_txn_unique_991'
  });
  assert(wh2.status === 200 && wh2.message.includes('Idempotent skip'), 'Duplicate webhook safely skipped without double crediting');

} catch (err) {
  console.error('Unexpected test error:', err);
  failed++;
} finally {
  // Restore initial data
  saveData(initialData);
}

console.log(`\n--- TEST RESULTS: ${passed} passed, ${failed} failed ---`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL PAYMENT SECURITY TESTS PASSED PERFECTLY!\n');
}
