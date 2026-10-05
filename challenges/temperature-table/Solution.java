double toFahrenheit(double celsius) {
    return celsius * 9 / 5 + 32;
}

void main() {
    String[] p = IO.readln().trim().split(" ");
    int start = Integer.parseInt(p[0]);
    int end = Integer.parseInt(p[1]);
    int step = Integer.parseInt(p[2]);
    for (int c = start; c <= end; c += step) {
        IO.println("%d C = %.1f F".formatted(c, toFahrenheit(c)));
    }
}
