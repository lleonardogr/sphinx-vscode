void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] program = new String[n];
    for (int i = 0; i < n; i++) {
        program[i] = IO.readln().trim(); // por exemplo SET 3
    }
    int[] memory = new int[16];
    int acc = 0;
    int pc = 1;

    // TODO: busque, decodifique e execute instruções até HALT, o fim, 1000 passos ou um erro
}
