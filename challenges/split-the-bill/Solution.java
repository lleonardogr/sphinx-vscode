void main() {
    double total = Double.parseDouble(IO.readln().trim());
    int people = Integer.parseInt(IO.readln().trim());
    int tip = Integer.parseInt(IO.readln().trim());
    long cents = Math.round(total * 100);
    long withTip = cents * (100 + tip);          // in hundredths of a cent
    long divisor = 100L * people;
    long each = (withTip + divisor - 1) / divisor;
    IO.println("Each person pays: %d.%02d".formatted(each / 100, each % 100));
}
