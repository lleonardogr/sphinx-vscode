// Guarda respostas já calculadas: memo[n] é 0 até fib(n) ser conhecido.
long[] memo = new long[91];

// TODO: devolva o n-ésimo número de Fibonacci de forma recursiva, usando memo para não repetir trabalho
long fib(int n) {
    return 0;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    IO.println("F(" + n + ") = " + fib(n));
}
