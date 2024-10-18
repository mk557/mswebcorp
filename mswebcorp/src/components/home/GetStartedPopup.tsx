const handleSubmit = async (event) => {
  event.preventDefault();
  setProcessing(true);
  setError(null);

  if (!stripe || !elements) {
    return;
  }

  try {
    // ... existing code ...

    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        formData,
        totalMonthly,
        totalOneTime,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'An error occurred while processing your payment.');
    }

    console.log('Subscription created:', result.subscription);
    // Handle successful subscription (e.g., show success message, redirect)

  } catch (err) {
    console.error('Payment error:', err);
    setError(err.message || 'An unexpected error occurred.');
  } finally {
    setProcessing(false);
  }
};
