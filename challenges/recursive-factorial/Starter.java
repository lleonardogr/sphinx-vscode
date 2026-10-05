// TODO: return n! recursively: 0! is 1, and n! is n * (n - 1)!
long factorial(int n) {
    return 1;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    IO.println(n + "! = " + factorial(n));
}
