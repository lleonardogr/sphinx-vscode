long factorial(int n) {
    return factorial(n, 1);
}

/* The product so far travels in acc, so nothing is left to do after the recursive call. */
long factorial(int n, long acc) {
    if (n <= 1) {
        return acc;
    }
    return factorial(n - 1, acc * n);
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    IO.println(n + "! = " + factorial(n));
}
