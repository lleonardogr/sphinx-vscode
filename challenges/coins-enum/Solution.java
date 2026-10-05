enum Coin {
    PENNY(1), NICKEL(5), DIME(10), QUARTER(25);

    private final int cents;

    Coin(int cents) {
        this.cents = cents;
    }

    int cents() {
        return cents;
    }
}

void main() {
    String[] names = IO.readln().trim().split(" +");
    Map<Coin, Integer> counts = new EnumMap<>(Coin.class);
    for (String name : names) {
        Coin found = null;
        for (Coin coin : Coin.values()) {
            if (coin.name().equalsIgnoreCase(name)) found = coin;
        }
        if (found == null) {
            IO.println("Unknown coin: " + name);
        } else {
            counts.merge(found, 1, Integer::sum);
        }
    }
    int total = 0;
    for (var entry : counts.entrySet()) {
        IO.println(entry.getKey() + " x" + entry.getValue());
        total += entry.getKey().cents() * entry.getValue();
    }
    IO.println("Total: " + total + " cents");
}
