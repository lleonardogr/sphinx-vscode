// TODO: devolva o máximo divisor comum de a e b (algoritmo de Euclides)
int gcd(int a, int b) {
    return 1;
}

// TODO: devolva o mínimo múltiplo comum de a e b, usando gcd
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
