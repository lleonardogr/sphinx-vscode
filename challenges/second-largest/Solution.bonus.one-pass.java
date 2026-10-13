void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int largest = Integer.parseInt(parts[0]);
    int second = 0;
    boolean found = false;
    for (int i = 1; i < n; i++) {
        int x = Integer.parseInt(parts[i]);
        if (x > largest) {
            second = largest;
            largest = x;
            found = true;
        } else if (x < largest && (!found || x > second)) {
            second = x;
            found = true;
        }
    }
    IO.println(found ? "Second largest: " + second : "No second largest");
}
