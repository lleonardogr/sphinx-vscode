int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

long lcm(int a, int b) {
    return (long) a / gcd(a, b) * b;
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        String[] p = IO.readln().trim().split(" ");
        int a = Integer.parseInt(p[0]);
        int b = Integer.parseInt(p[1]);
        IO.println("GCD = " + gcd(a, b) + ", LCM = " + lcm(a, b));
    }
}
