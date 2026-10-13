void main() {
    String[] amount = IO.readln().trim().split("\\.");
    long cents = Long.parseLong(amount[0]) * 100 + Long.parseLong(amount[1]);
    int people = Integer.parseInt(IO.readln().trim());
    int tip = Integer.parseInt(IO.readln().trim());
    long withTip = cents * (100 + tip);          // in hundredths of a cent
    long divisor = 100L * people;
    long each = (withTip + divisor - 1) / divisor;
    IO.println("Each person pays: " + each / 100 + "." + (each % 100 < 10 ? "0" : "") + each % 100);
}
