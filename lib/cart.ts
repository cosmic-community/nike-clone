const item = state.items[index];
    if (!item) return state;
    state.items[index] = { ...item, quantity: item.quantity + 1 };