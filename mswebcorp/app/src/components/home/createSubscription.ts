import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export async function createSubscription(paymentMethodId: string, formData: any, totalMonthly: number, totalOneTime: number) {
  try {
    // Validate email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error('Invalid email address');
    }

    const capitalizedSubscriptionModel = capitalizeWords(formData.subscriptionModel);

    // Create a customer
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: formData.email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create a product for the subscription
    const subscriptionProduct = await stripe.products.create({
      name: `${capitalizedSubscriptionModel} Website Subscription Plan`,
      description: `Monthly subscription for ${capitalizedSubscriptionModel} website plan`,
    });

    // Create a price for the recurring subscription
    const recurringPrice = await stripe.prices.create({
      product: subscriptionProduct.id,
      unit_amount: Math.round(totalMonthly * 100), // Convert to cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        { price: recurringPrice.id },
      ],
      add_invoice_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${capitalizedSubscriptionModel} Website Setup Fee`,
            },
            unit_amount: Math.round(totalOneTime * 100),
          },
        },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return { subscription };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}