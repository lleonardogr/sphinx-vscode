void main() {
    String[] values = IO.readln().trim().split(" ");
    long sum = 0;
    int valid = 0;
    for (String value : values) {
        try {
            sum += Integer.parseInt(value);
            valid++;
        } catch (NumberFormatException e) {
            IO.println("Skipped: " + value);
        }
    }
    IO.println("Valid numbers: " + valid);
    IO.println("Sum: " + sum);
}
