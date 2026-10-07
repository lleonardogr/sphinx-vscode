void main() {
    int n = Integer.parseInt(IO.readln().trim());
    long single = 0;
    for (int i = 0; i < n; i++) {
        single++;
    }
    long nested = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            nested++;
        }
    }
    int halving = 0;
    int m = n;
    while (m > 1) {
        m = m / 2;
        halving++;
    }
    IO.println("Single loop: " + single);
    IO.println("Nested loops: " + nested);
    IO.println("Halving loop: " + halving);
}
