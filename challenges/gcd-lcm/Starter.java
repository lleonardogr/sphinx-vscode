// TODO: return the greatest common divisor of a and b (Euclid's algorithm)
int gcd(int a, int b) {
    return 1;
}

// TODO: return the least common multiple of a and b, using gcd
long lcm(int a, int b) {
    return 1;
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
