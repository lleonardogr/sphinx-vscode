void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] program = new String[n];
    for (int i = 0; i < n; i++) {
        program[i] = IO.readln().trim(); // for example SET 3
    }
    int[] memory = new int[16];
    int acc = 0;
    int pc = 1;

    // TODO: fetch, decode and execute instructions until HALT, the end, 1000 steps or an error
}
