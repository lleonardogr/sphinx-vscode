// TODO: devolva n! de forma recursiva: 0! é 1, e n! é n * (n - 1)!
long factorial(int n) {
    return 1;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    IO.println(n + "! = " + factorial(n));
}
