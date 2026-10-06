void main() {
    int n = Integer.parseInt(IO.readln().trim());
    long values = 1;
    for (int i = 0; i < n; i++) {
        values *= 2;
    }
    IO.println("Values: " + values);
    IO.println("Largest: " + (values - 1));
}
