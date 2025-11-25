const order = response.objects.find(
    (o: Order) => o.metadata?.stripe_session_id === stripeSessionId
  ) ?? null;