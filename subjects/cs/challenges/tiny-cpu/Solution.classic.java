import java.util.Scanner;

public class Main {

    static int[] memory = new int[16];
    static int acc = 0;

    /** Runs one instruction and returns the next line, 0 to stop, or -1 for an unknown instruction. */
    static int execute(String line, int pc, int last) {
        String[] p = line.split(" ");
        String op = p[0];
        int x = p.length > 1 ? Integer.parseInt(p[1]) : 0;
        if (op.equals("SET")) { acc = x; }
        else if (op.equals("LOAD")) { acc = memory[x]; }
        else if (op.equals("STORE")) { memory[x] = acc; }
        else if (op.equals("ADD")) { acc = acc + memory[x]; }
        else if (op.equals("SUB")) { acc = acc - memory[x]; }
        else if (op.equals("JUMP")) { return x; }
        else if (op.equals("JZ")) { return acc == 0 ? x : pc + 1; }
        else if (op.equals("OUT")) { System.out.println(acc); }
        else if (op.equals("HALT")) { return 0; }
        else { return -1; }
        return pc + 1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        String[] program = new String[n];
        for (int i = 0; i < n; i++) {
            program[i] = scanner.nextLine().trim();
        }
        int pc = 1;
        int steps = 0;
        String result = null;
        while (result == null) {
            if (pc < 1 || pc > n) {
                result = "Halted after " + steps + " steps";
            } else if (steps >= 1000) {
                result = "Step limit reached";
            } else {
                int next = execute(program[pc - 1], pc, n);
                if (next == -1) {
                    result = "Error at line " + pc + ": " + program[pc - 1];
                } else {
                    steps++;
                    pc = next;
                }
            }
        }
        System.out.println(result);
    }
}
