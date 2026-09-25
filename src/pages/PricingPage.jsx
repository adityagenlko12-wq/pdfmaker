import React, { useState, useEffect } from 'react';
import {
  Check, CreditCard, Shield, Zap, Sparkles, ArrowRight,
  AlertCircle, Lock, RefreshCw, CheckCircle2, ChevronRight,
  Smartphone, QrCode, Building, Download, FileText, Copy,
  Upload, Clock, Image, ExternalLink, X
} from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export default function PricingPage({ onNavigateHome, onNavigateAccount, onOpenAuth }) {
  const {
    user,
    settings,
    formatPrice,
    convertPrice,
    selectedCurrency,
    availableCurrencies,
    changeCurrency,
    refreshUser
  } = useSite();

  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [selectedGateway, setSelectedGateway] = useState('stripe');
  const [loading, setLoading] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // Checkout flow state
  const [activeOrder, setActiveOrder] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState('plans'); // 'plans' | 'payment' | 'success'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [completedPayment, setCompletedPayment] = useState(null);

  // Card form simulation state for Stripe
  const [cardDetails, setCardDetails] = useState({
    number: '4242 4242 4242 4242',
    exp: '12/28',
    cvc: '123',
    name: user?.name || 'John Doe'
  });

  // Manual Transfer Reference / UTR & Proof state
  const [manualTxnRef, setManualTxnRef] = useState('');
  const [payerUpiOrAccount, setPayerUpiOrAccount] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPaymentError('Payment receipt file size must be less than 5MB.');
      return;
    }
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptDataUrl(event.target?.result || '');
      setPaymentError(null);
    };
    reader.readAsDataURL(file);
  };

  // Fetch plans from server
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponError(null);
      }
    } catch (err) {
      setCouponError(err.message);
    }
  };

  const handleInitiateCheckout = async (planId) => {
    if (!user) {
      onOpenAuth && onOpenAuth();
      return;
    }

    setSelectedPlanId(planId);
    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          couponCode: appliedCoupon?.code,
          gateway: selectedGateway,
          currency: selectedCurrency
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error || 'Failed to initialize checkout session');
      } else {
        setActiveOrder(data.order);
        setCheckoutStep('payment');
      }
    } catch (err) {
      setPaymentError(err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleFinalizePayment = async () => {
    if (!activeOrder) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      let transactionId = `txn_${selectedGateway}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      let paymentData = {};

      if (selectedGateway === 'manual') {
        if (!manualTxnRef.trim()) {
          setPaymentError('Please enter your Bank UTR or Transaction Reference number.');
          setIsProcessingPayment(false);
          return;
        }
        transactionId = manualTxnRef.trim();
        paymentData = {
          manualReference: manualTxnRef.trim(),
          bankReference: manualTxnRef.trim(),
          payerUpiOrAccount: payerUpiOrAccount.trim(),
          receiptUrl: receiptDataUrl || ''
        };
      } else if (selectedGateway === 'stripe') {
        paymentData = { cardNumber: cardDetails.number, cardExp: cardDetails.exp };
      }

      const res = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: activeOrder.orderId,
          gateway: selectedGateway,
          transactionId,
          paymentData
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPaymentError(data.error || 'Payment verification failed. Please retry.');
      } else {
        setCompletedPayment(data.payment);
        setCheckoutStep('success');
        refreshUser();
      }
    } catch (err) {
      setPaymentError('Verification failed: ' + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1] || {};
  const activeGatewayObj = (settings?.gateways || []).find((g) => g.id === selectedGateway) || {
    name: 'Stripe Credit Card',
    mode: 'test'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Transparent SaaS Subscriptions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Simple Plans for <br className="hidden sm:inline" />
            <span className="text-blue-600">Individuals & Teams.</span>
          </h1>

          <p className="text-base text-gray-600">
            Choose the tier that suits your volume. All plans include 256-bit encryption, instant downloads, and server-side PDF processing.
          </p>

          {/* Billing Cycle Toggle (Monthly vs Annual 20% Off) */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly Billing
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* STEP 1: Plan Cards Grid */}
        {checkoutStep === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
            {plans.map((plan) => {
              const isPopular = plan.isPopular || plan.id === 'pro';
              const rawPrice = billingCycle === 'annual' ? plan.priceYearly : plan.priceMonthly;
              const isCurrent = user?.planId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`card-3d relative rounded-3xl p-8 bg-white border flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-gray-200 shadow-lg'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                      Most Popular Tier
                    </div>
                  )}

                  <div>
                    {/* Tier Name & Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {plan.id}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 min-h-[32px]">{plan.description}</p>

                    {/* Price Header */}
                    <div className="mt-6 mb-6 pb-6 border-b border-gray-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {rawPrice === 0 ? 'Free' : formatPrice(rawPrice)}
                        </span>
                        {rawPrice > 0 && (
                          <span className="text-xs font-semibold text-gray-400">
                            /{billingCycle === 'annual' ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'annual' && rawPrice > 0 && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                          Billed annually (Includes 20% discount)
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 text-xs text-gray-600 mb-8">
                      {(plan.features || []).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Primary CTA Button */}
                  <div>
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-500 font-bold text-xs cursor-default"
                      >
                        Current Active Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInitiateCheckout(plan.id)}
                        className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isPopular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                            : 'bg-gray-900 hover:bg-black text-white'
                        }`}
                      >
                        <span>{plan.id === 'free' ? 'Get Started' : 'Subscribe Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 2: Checkout & Payment Modal / Section */}
        {checkoutStep === 'payment' && activeOrder && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 sm:p-12 mb-16 animate-in fade-in">
            
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
              <button
                onClick={() => setCheckoutStep('plans')}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
              >
                <span>← Change Selected Plan</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <Shield className="w-4 h-4" />
                <span>Encrypted 256-bit Checkout</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Order Summary & Coupon */}
              <div className="lg:col-span-5 space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-200/80">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-bold text-gray-900">{activeOrder.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Billing Cycle</span>
                    <span className="font-bold text-gray-900 capitalize">{activeOrder.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Price</span>
                    <span className="font-bold text-gray-900">{formatPrice(activeOrder.baseAmount)}</span>
                  </div>

                  {activeOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promotional Discount</span>
                      <span>-{formatPrice(activeOrder.discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-extrabold text-gray-900">
                    <span>Total Due Today</span>
                    <span className="text-blue-600">{formatPrice(activeOrder.amount)}</span>
                  </div>
                </div>

                {/* Coupon Input Box */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-700">Promo / Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SAVE20"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercent}% OFF)</span>
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}
                </div>

              </div>

              {/* Right Column: Payment Gateway Selection & Form */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Gateway Tab Selectors */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Choose Payment Gateway
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['stripe', 'paypal', 'razorpay', 'manual'].map((gwId) => (
                      <button
                        key={gwId}
                        type="button"
                        onClick={() => setSelectedGateway(gwId)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          selectedGateway === gwId
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block text-xs capitalize">{gwId === 'manual' ? 'Bank / UPI' : gwId}</span>
                        <span className="text-[9px] text-gray-400 font-normal">
                          {gwId === 'manual' ? 'Wire' : 'Instant'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gateway Form Containers */}
                {selectedGateway === 'stripe' && (
                  <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                      <span>Card Details (Stripe Gateway)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {activeGatewayObj.mode === 'live' ? 'LIVE GATEWAY' : 'TEST MODE GATEWAY'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardDetails.exp}
                          onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedGateway === 'paypal' && (
                  <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/40 text-center space-y-3">
                    <p className="text-xs text-blue-900 font-semibold">
                      You will be authenticated through PayPal Secure Checkout.
                    </p>
                    <div className="py-3 px-6 rounded-xl bg-amber-400 text-gray-950 font-extrabold text-xs inline-block">
                      PayPal One-Touch
                    </div>
                  </div>
                )}

                {selectedGateway === 'razorpay' && (
                  <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/40 text-center space-y-3">
                    <p className="text-xs text-blue-900 font-semibold">
                      Razorpay supports UPI, Google Pay, PhonePe, Paytm, and Netbanking for India.
                    </p>
                    <div className="py-3 px-6 rounded-xl bg-blue-600 text-white font-extrabold text-xs inline-block">
                      Pay with UPI / Cards
                    </div>
                  </div>
                )}

                {selectedGateway === 'manual' && (
                  <div className="p-6 rounded-2xl border border-amber-200 bg-white shadow-xs space-y-5 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h5 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-amber-600" />
                          <span>Direct Bank Wire &amp; UPI Transfer</span>
                        </h5>
                        <p className="text-[11px] text-gray-500">
                          Transfer directly to our corporate bank account or scan the instant UPI QR code.
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Manual Review
                      </span>
                    </div>

                    {/* Dynamic UPI QR Code & Beneficiary Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-4 bg-amber-50/50 rounded-2xl border border-amber-100 items-center">
                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-amber-200 shadow-xs text-center">
                        {(() => {
                          const upiId = activeGatewayObj.upiId || 'vanshpdf@icici';
                          const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Vansh%20PDF&am=${activeOrder.amount}&cu=${activeOrder.currency || 'USD'}&tn=${encodeURIComponent('Order ' + activeOrder.orderId)}`;
                          const qrUrl = activeGatewayObj.upiQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;
                          return (
                            <>
                              <img
                                src={qrUrl}
                                alt="UPI Payment QR Code"
                                className="w-36 h-36 object-contain rounded-lg border border-gray-100"
                              />
                              <p className="text-[10px] font-bold text-gray-600 mt-2 flex items-center gap-1">
                                <QrCode className="w-3 h-3 text-amber-600" />
                                <span>Scan via GPay / PhonePe / Paytm</span>
                              </p>
                            </>
                          );
                        })()}
                      </div>

                      <div className="sm:col-span-8 space-y-2 text-[11px] text-gray-700">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Bank Name</span>
                            <span className="font-bold text-gray-900">{activeGatewayObj.bankName || 'HDFC Bank International'}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">{activeGatewayObj.branchName || 'Main Branch'}</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Beneficiary Account Name</span>
                            <span className="font-bold text-gray-900">{activeGatewayObj.accountName || 'Vansh PDF Technologies Inc'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Account Number</span>
                            <span className="font-mono font-bold text-gray-900">{activeGatewayObj.accountNumber || '99201948102934'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(activeGatewayObj.accountNumber || '99201948102934', 'acc')}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'acc' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                            <div>
                              <span className="text-[10px] text-gray-400 block">IFSC / SWIFT</span>
                              <span className="font-mono font-bold text-gray-900">{activeGatewayObj.ifscSwift || 'HDFC0001892'}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(activeGatewayObj.ifscSwift || 'HDFC0001892', 'ifsc')}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              {copiedKey === 'ifsc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'ifsc' ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                            <div>
                              <span className="text-[10px] text-gray-400 block">UPI ID</span>
                              <span className="font-mono font-bold text-gray-900">{activeGatewayObj.upiId || 'vanshpdf@icici'}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(activeGatewayObj.upiId || 'vanshpdf@icici', 'upi')}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              {copiedKey === 'upi' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'upi' ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-amber-100/50 text-amber-900 text-[10px] font-medium leading-relaxed">
                          <strong>Note:</strong> {activeGatewayObj.instructions || 'Transfer the exact amount, then enter the 12-digit UTR/Reference ID below and attach your payment receipt screenshot for verification.'}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Submission Form */}
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Bank Transaction Reference / UTR Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={manualTxnRef}
                            onChange={(e) => setManualTxnRef(e.target.value)}
                            placeholder="e.g. UTR102938475829"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Your Payer UPI ID or Account Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={payerUpiOrAccount}
                            onChange={(e) => setPayerUpiOrAccount(e.target.value)}
                            placeholder="e.g. sender@okicici or John Doe"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Payment Screenshot / Receipt Upload */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Attach Payment Screenshot / Receipt Proof
                        </label>
                        {!receiptDataUrl ? (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-amber-50/30 transition-all text-center">
                            <Upload className="w-5 h-5 text-gray-400 mb-1" />
                            <span className="text-xs font-semibold text-gray-700">Click to upload transfer screenshot</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, or PDF up to 5MB</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleReceiptUpload}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-3">
                              {receiptDataUrl.startsWith('data:image') ? (
                                <img
                                  src={receiptDataUrl}
                                  alt="Receipt thumbnail"
                                  className="w-10 h-10 object-cover rounded-lg border border-amber-300"
                                />
                              ) : (
                                <FileText className="w-8 h-8 text-amber-700" />
                              )}
                              <div>
                                <p className="text-xs font-bold text-gray-900 truncate max-w-xs">{receiptFileName || 'payment_receipt.png'}</p>
                                <p className="text-[10px] text-emerald-600 font-semibold">✓ Attached &amp; Ready for Submission</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setReceiptDataUrl('');
                                setReceiptFileName('');
                              }}
                              className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-white cursor-pointer"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {paymentError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Authoritative Confirm Payment Button */}
                <button
                  onClick={handleFinalizePayment}
                  disabled={isProcessingPayment}
                  className={`w-full py-4 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isProcessingPayment
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 hover:shadow-blue-600/35'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Gateway Response Server-Side...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {selectedGateway === 'manual'
                          ? `Submit Transfer Proof for ${formatPrice(activeOrder.amount)}`
                          : `Confirm & Pay ${formatPrice(activeOrder.amount)}`}
                      </span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* STEP 3: Payment Success / Receipt Confirmation */}
        {checkoutStep === 'success' && completedPayment && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 sm:p-12 text-center space-y-6 animate-in fade-in mb-16">
            {completedPayment.status === 'pending' || completedPayment.gateway === 'manual' ? (
              <>
                <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                    <span>Manual Review Required</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Wire Transfer Order Received!</h2>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Your UTR transaction reference and payment receipt have been recorded. Our administrative reconciliation team will verify funds and activate your <strong>{completedPayment.planName}</strong> plan shortly.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Subscription Confirmed!</h2>
                  <p className="text-xs text-gray-500">
                    Your payment has been successfully processed and verified server-side.
                  </p>
                </div>
              </>
            )}

            {/* Receipt Table */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Invoice ID</span>
                <span className="font-mono font-bold text-gray-900">{completedPayment.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID / UTR</span>
                <span className="font-mono text-gray-900">{completedPayment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Due / Paid</span>
                <span className="font-bold text-gray-900">{formatPrice(completedPayment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gateway Method</span>
                <span className="capitalize font-semibold text-gray-900">{completedPayment.gateway === 'manual' ? 'Bank Wire / UPI' : completedPayment.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-bold ${completedPayment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {completedPayment.verificationStatus || completedPayment.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`/api/user/invoices/${completedPayment.orderId}/download`}
                download
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Tax Invoice PDF</span>
              </a>

              <button
                onClick={onNavigateAccount}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to User Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
